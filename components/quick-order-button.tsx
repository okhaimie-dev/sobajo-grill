"use client";

import type { MenuItem } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

/** "Order now": puts the item in the cart and opens it (see CartContext.quickOrder). */
export default function QuickOrderButton({
  item,
  className = "btn btn-primary",
  label = "Order now",
}: {
  item: MenuItem;
  className?: string;
  label?: string;
}) {
  const { quickOrder } = useCart();
  return (
    <button type="button" className={className} onClick={() => quickOrder(item)}>
      {label} <Icon name="arrow" />
    </button>
  );
}
