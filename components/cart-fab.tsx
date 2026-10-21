"use client";

import { useCart } from "./cart-context";

export default function CartFab() {
  const { count, openCart } = useCart();
  return (
    <button className="cart-fab" onClick={openCart}>
      Cart <span className="badge-count">{count}</span>
    </button>
  );
}
