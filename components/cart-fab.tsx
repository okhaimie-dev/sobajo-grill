"use client";

import { money } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

/** Floating "view order" pill — only once something is in the cart. */
export default function CartFab() {
  const { count, subtotal, openCart, cartOpen, activeItem } = useCart();
  if (count === 0 || cartOpen || activeItem) return null;
  return (
    <button className="cart-fab" onClick={openCart}>
      <Icon name="bag" />
      View order · {count} {count === 1 ? "item" : "items"}
      <span className="fab-total">{money(subtotal)}</span>
    </button>
  );
}
