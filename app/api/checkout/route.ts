import { BASE_PATH } from "@/lib/assets";
import { items, sideOptions } from "@/lib/menu";
import { SquareLineItem, createPaymentLink, squareConfigured } from "@/lib/square";

/**
 * POST /api/checkout — turns the cart into a Square hosted checkout link.
 * Prices are looked up from the menu here; the client only says what was
 * picked, so a tampered cart can't change what the customer is charged.
 */

const json = (status: number, body: object) => Response.json(body, { status });

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!squareConfigured()) {
    console.error("[checkout] Square not configured (SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID)");
    return json(503, { error: "Online checkout is temporarily unavailable." });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  if (!rawLines.length || rawLines.length > 50) return json(400, { error: "Your cart is empty." });

  const lineItems: SquareLineItem[] = [];
  for (const raw of rawLines as Record<string, unknown>[]) {
    const item = items.find((i) => i.name === raw?.name && i.available !== false);
    const variation = item?.variations.find((v) => v[0] === raw?.variation);
    if (!item || !variation) return json(400, { error: `"${str(raw?.name)}" is no longer available — please remove it.` });

    const sides = sideOptions(item);
    const sideName = str(raw.side);
    const side = sides.find((s) => s[0] === sideName);
    if (sides.length && !side) return json(400, { error: `Please re-add ${item.name} — its side option changed.` });

    const quantity = Number(raw.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return json(400, { error: "Invalid quantity." });

    const note = [str(raw.spice, 20), side && side[0] !== "No Side" ? side[0] : "", str(raw.notes)]
      .filter(Boolean)
      .join(" · ");
    lineItems.push({
      name: item.name,
      variationName: variation[0],
      quantity,
      unitPrice: variation[1] + (side?.[1] ?? 0),
      note,
    });
  }

  const isDelivery = body.fulfillment === "delivery";
  const address = str(body.address, 300);
  if (isDelivery && !address) return json(400, { error: "Please enter a delivery address." });
  const time = str(body.time, 40);

  const paymentNote = [
    isDelivery ? `DELIVERY to ${address}` : "PICKUP",
    time ? `requested ${time.replace("T", " ")}` : "ASAP",
  ].join(" · ");

  try {
    const url = await createPaymentLink({
      lineItems,
      paymentNote,
      redirectUrl: `${new URL(request.url).origin}${BASE_PATH}/?checkout=success`,
      askForShippingAddress: isDelivery,
    });
    return json(200, { url });
  } catch (err) {
    console.error("[checkout]", err);
    return json(502, { error: "We couldn't start checkout. Please try again or call us." });
  }
}
