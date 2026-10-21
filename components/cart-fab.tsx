"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { money } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

/** Floating "view order" pill — only once something is in the cart. */
/** True while any [data-hide-fab] element (e.g. a form) is in view, so the pill never covers it. */
function useFormInView(): boolean {
  const [inView, setInView] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setInView(false);
    const els = document.querySelectorAll("[data-hide-fab]");
    if (!els.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setInView(visible.size > 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return inView;
}

export default function CartFab() {
  const { count, subtotal, openCart, cartOpen, activeItem } = useCart();
  const formInView = useFormInView();
  if (count === 0 || cartOpen || activeItem || formInView) return null;
  return (
    <button className="cart-fab" onClick={openCart}>
      <Icon name="bag" />
      View order · {count} {count === 1 ? "item" : "items"}
      <span className="fab-total">{money(subtotal)}</span>
    </button>
  );
}
