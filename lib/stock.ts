/**
 * Limited items (Sanity → menu item → "Order limit", e.g. 100 Thanksgiving
 * turkeys). Paid quantities are counted straight from Square, so there's no
 * second counter to drift. The count is never shown to guests — only a
 * level: selling fast (60%+), almost gone (90%+), sold out (at the limit).
 *
 * Cached for 2 minutes under the tag "square-orders"; /api/square-webhook
 * expires it on every completed payment, so the page and checkout see a new
 * order within seconds.
 */

import { unstable_cache } from "next/cache";
import type { MenuItem } from "./menu";
import { paidQuantity, squareConfigured } from "./square";

export const ORDERS_TAG = "square-orders";

export type StockLevel = "available" | "sellingFast" | "almostGone" | "soldOut";

export const STOCK_BADGE: Partial<Record<StockLevel, string>> = {
  sellingFast: "Selling fast",
  almostGone: "Almost gone — order now",
};

const cachedPaid = unstable_cache(
  (name: string, since: string) => paidQuantity(name, since),
  ["paid-quantity"],
  { tags: [ORDERS_TAG], revalidate: 120 }
);

export interface Stock {
  level: StockLevel;
  /** Paid so far; null when Square couldn't be asked (fail open, logged). */
  sold: number | null;
  limit: number;
}

/** null for items without an order limit. */
export async function getStock(item: MenuItem): Promise<Stock | null> {
  if (!item.orderLimit) return null;
  const limit = item.orderLimit;
  if (!squareConfigured()) return { level: "available", sold: null, limit };
  try {
    const sold = await cachedPaid(item.name, item.countSince ?? "2000-01-01T00:00:00Z");
    return { level: stockLevel(sold, limit), sold, limit };
  } catch (err) {
    // Don't take the page or checkout down over a count; Square itself is
    // likely down too, so payment links would fail anyway.
    console.error(`[stock] couldn't count paid "${item.name}"`, err);
    return { level: "available", sold: null, limit };
  }
}

export function stockLevel(sold: number, limit: number): StockLevel {
  if (sold >= limit) return "soldOut";
  if (sold >= limit * 0.9) return "almostGone";
  if (sold >= limit * 0.6) return "sellingFast";
  return "available";
}
