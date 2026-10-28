/**
 * Square hosted checkout (Checkout API → payment links). The server builds an
 * itemized order and Square returns a one-time checkout URL, so card details
 * never touch this site.
 *
 *   SQUARE_ACCESS_TOKEN   Developer Console → app → Credentials (sandbox or production)
 *   SQUARE_LOCATION_ID    Developer Console → app → Locations
 *   SQUARE_ENVIRONMENT    "sandbox" (default) or "production"
 */

const BASE =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

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
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      "Square-Version": "2025-01-23",
      "Content-Type": "application/json",
    },
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
