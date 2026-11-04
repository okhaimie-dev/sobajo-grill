/**
 * Square hosted checkout (Checkout API → payment links). The server builds an
 * itemized order and Square returns a one-time checkout URL, so card details
 * never touch this site.
 *
 *   SQUARE_ACCESS_TOKEN   Developer Console → app → Credentials (sandbox or production)
 *   SQUARE_LOCATION_ID    Developer Console → app → Locations
 *   SQUARE_ENVIRONMENT    "sandbox" (default) or "production"
 *   SQUARE_WEBHOOK_SIGNATURE_KEY  Developer Console → app → Webhooks → subscription
 *                                 (payment.updated → /api/square-webhook/)
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const BASE =
  process.env.SQUARE_API_URL ?? // tests / proxies
  (process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com");

const HEADERS = () => ({
  Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
  "Square-Version": "2025-01-23",
  "Content-Type": "application/json",
});

async function square<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: HEADERS(),
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { errors?: { detail?: string; code?: string }[] };
  if (!res.ok) {
    const detail = data.errors?.map((e) => e.detail ?? e.code).join("; ") ?? "no detail";
    throw new Error(`Square ${path} → ${res.status}: ${detail}`);
  }
  return data;
}

export interface SquareOrder {
  id: string;
  state?: string;
  created_at?: string;
  line_items?: { name?: string; variation_name?: string; quantity: string; note?: string }[];
  tenders?: { id: string }[];
  refunds?: { status?: string }[];
  total_money?: { amount: number; currency: string };
  customer_id?: string;
}

/** Paid and not refunded. */
const isPaid = (o: SquareOrder) =>
  (o.tenders?.length ?? 0) > 0 && !(o.refunds ?? []).some((r) => r.status === "COMPLETED" || r.status === "PENDING");

/** How many of `itemName` paid orders contain, counting orders created since `sinceISO`. */
export async function paidQuantity(itemName: string, sinceISO: string): Promise<number> {
  let total = 0;
  let cursor: string | undefined;
  for (let page = 0; page < 40; page++) {
    const data = await square<{ orders?: SquareOrder[]; cursor?: string }>("/v2/orders/search", {
      location_ids: [process.env.SQUARE_LOCATION_ID],
      limit: 500,
      cursor,
      query: {
        filter: {
          state_filter: { states: ["OPEN", "COMPLETED"] },
          date_time_filter: { created_at: { start_at: sinceISO } },
        },
        sort: { sort_field: "CREATED_AT", sort_order: "ASC" },
      },
    });
    for (const o of data.orders ?? []) {
      if (!isPaid(o)) continue;
      for (const l of o.line_items ?? []) if (l.name === itemName) total += Number(l.quantity) || 0;
    }
    cursor = data.cursor;
    if (!cursor) break;
  }
  return total;
}

export async function getOrder(id: string): Promise<SquareOrder | null> {
  return (await square<{ order?: SquareOrder }>(`/v2/orders/${encodeURIComponent(id)}`)).order ?? null;
}

export interface SquareCustomer {
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
}

export async function getCustomer(id: string): Promise<SquareCustomer | null> {
  return (await square<{ customer?: SquareCustomer }>(`/v2/customers/${encodeURIComponent(id)}`)).customer ?? null;
}

/**
 * Square signs webhooks with HMAC-SHA256(key, notificationUrl + rawBody),
 * base64, in the x-square-hmacsha256-signature header. `notificationUrl` must
 * be exactly the URL registered in the subscription.
 */
export function validSquareSignature(rawBody: string, signature: string | null, notificationUrl: string): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key || !signature) return false;
  const expected = createHmac("sha256", key).update(notificationUrl + rawBody).digest();
  const given = Buffer.from(signature, "base64");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export const squareConfigured = () =>
  Boolean(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);

export interface SquareLineItem {
  name: string;
  variationName: string;
  quantity: number;
  /** dollars */
  unitPrice: number;
  note?: string;
}

const cents = (dollars: number) => ({ amount: Math.round(dollars * 100), currency: "USD" });

export async function createPaymentLink(input: {
  lineItems: SquareLineItem[];
  paymentNote: string;
  redirectUrl: string;
  askForShippingAddress: boolean;
}): Promise<string> {
  const res = await fetch(`${BASE}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: HEADERS(),
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: process.env.SQUARE_LOCATION_ID,
        line_items: input.lineItems.map((l) => ({
          name: l.name,
          variation_name: l.variationName,
          quantity: String(l.quantity),
          base_price_money: cents(l.unitPrice),
          note: l.note || undefined,
        })),
      },
      checkout_options: {
        redirect_url: input.redirectUrl,
        ask_for_shipping_address: input.askForShippingAddress,
      },
      payment_note: input.paymentNote.slice(0, 500),
    }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    payment_link?: { url: string };
    errors?: { detail?: string; code?: string }[];
  };
  if (!res.ok || !data.payment_link?.url) {
    const detail = data.errors?.map((e) => e.detail ?? e.code).join("; ") ?? "no detail";
    throw new Error(`Square payment link → ${res.status}: ${detail}`);
  }
  return data.payment_link.url;
}
