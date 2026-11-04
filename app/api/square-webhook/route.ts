import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { getContent } from "@/lib/content";
import { notifyWebhook, webhookConfigured } from "@/lib/leads/notify";
import type { Lead } from "@/lib/leads/schema";
import { orderRecorded, sendToTwenty, twentyConfigured } from "@/lib/leads/twenty";
import { getCustomer, getOrder, validSquareSignature } from "@/lib/square";
import { ORDERS_TAG } from "@/lib/stock";

/**
 * POST /api/square-webhook/ — Square calls this when a payment changes
 * (subscription: payment.updated; Developer Console → Webhooks). On a
 * completed payment for a campaign item (e.g. the Thanksgiving turkey):
 *
 * 1. expire the paid-order count, so the page badge and the order limit
 *    update within seconds (lib/stock.ts);
 * 2. record the order in Twenty as a "<Campaign> order · PAID" opportunity
 *    with the customer, pickup day and items — once per order, even though
 *    Square retries and sends several updates per payment;
 * 3. ping LEAD_WEBHOOK_URL.
 *
 * A non-2xx answer makes Square retry, so a CRM outage doesn't lose orders.
 */

interface PaymentEvent {
  type?: string;
  data?: {
    object?: {
      payment?: {
        id: string;
        status?: string;
        order_id?: string;
        customer_id?: string;
        buyer_email_address?: string;
        note?: string;
        shipping_address?: { first_name?: string; last_name?: string };
        billing_address?: { first_name?: string; last_name?: string };
      };
    };
  };
}

const json = (status: number, body: object) => Response.json(body, { status });

export async function POST(req: Request) {
  const raw = await req.text();
  // Must be exactly the URL registered with Square (keep the trailing slash).
  const url = process.env.SQUARE_WEBHOOK_URL ?? req.url;
  if (!validSquareSignature(raw, req.headers.get("x-square-hmacsha256-signature"), url)) {
    console.error("[square-webhook] bad or missing signature (check SQUARE_WEBHOOK_SIGNATURE_KEY / URL)");
    return json(401, { error: "Invalid signature" });
  }

  const event = JSON.parse(raw) as PaymentEvent;
  const payment = event.data?.object?.payment;
  if (!event.type?.startsWith("payment.") || payment?.status !== "COMPLETED" || !payment.order_id) {
    return json(200, { ignored: true });
  }

  const [order, { items, campaigns }] = await Promise.all([getOrder(payment.order_id), getContent()]);
  if (!order) return json(200, { ignored: "order not found" });

  // Campaign items in this order (regular menu orders are left to Square).
  const campaignOf = new Map<string, (typeof campaigns)[number]>();
  for (const c of campaigns) for (const name of c.featured) campaignOf.set(name, c);
  const lines = (order.line_items ?? []).filter((l) => {
    const item = items.find((i) => i.name === l.name);
    return item?.campaignOnly && campaignOf.has(item.name);
  });
  if (!lines.length) return json(200, { ignored: "no campaign items" });

  revalidateTag(ORDERS_TAG, { expire: 0 });

  const campaign = campaignOf.get(lines[0].name!)!;
  const customer = payment.customer_id ? await getCustomer(payment.customer_id).catch(() => null) : null;
  const addr = payment.shipping_address ?? payment.billing_address;
  const name =
    [customer?.given_name, customer?.family_name].filter(Boolean).join(" ") ||
    [addr?.first_name, addr?.last_name].filter(Boolean).join(" ") ||
    undefined;
  const email = (customer?.email_address ?? payment.buyer_email_address ?? "").toLowerCase();

  const lead: Lead = {
    kind: "order",
    email: email || `square-order-${order.id}@invalid.local`,
    name,
    phone: customer?.phone_number,
    campaign: campaign.slug,
    campaignName: campaign.name,
    pickupDate: payment.note?.match(/requested (\d{4}-\d{2}-\d{2})/)?.[1],
    items: (order.line_items ?? []).map(
      (l) => `${l.name} — ${[l.variation_name, Number(l.quantity) > 1 ? `× ${l.quantity}` : "", l.note].filter(Boolean).join(" · ")}`
    ),
    orderId: order.id,
    amount: (order.total_money?.amount ?? 0) / 100,
    message: payment.note,
    page: `/${campaign.slug}/`,
    attribution: {},
  };

  if (twentyConfigured()) {
    try {
      if (await orderRecorded(order.id)) return json(200, { ok: true, duplicate: true });
      await sendToTwenty(lead);
    } catch (err) {
      console.error("[square-webhook] Twenty write failed — Square will retry:", err);
      return json(500, { error: "CRM write failed" });
    }
  } else {
    console.warn("[square-webhook] TWENTY_API_KEY not set — paid order not added to the CRM:", order.id);
  }
  if (webhookConfigured()) {
    after(() => notifyWebhook(lead).catch((err) => console.error("[square-webhook] notify failed:", err)));
  }
  return json(200, { ok: true });
}
