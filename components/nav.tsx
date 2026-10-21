"use client";

import { useCart } from "./cart-context";

const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#delivery", label: "Delivery" },
  { href: "#catering", label: "Catering" },
  { href: "#shipping", label: "Shipping" },
  { href: "#experiences", label: "Signature Experiences" },
  { href: "#story", label: "Our Story" },
  { href: "#reviews", label: "Reviews" },
];

export default function Nav() {
  const { count, openCart } = useCart();

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#top" aria-label="Sobajo Grill — back to top">
          <img src="/logo.png" alt="Sobajo Grill logo" className="logo" />
        </a>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <button className="nav-cta" onClick={openCart}>
          View Cart <span id="navCount">{count}</span>
        </button>
      </div>
    </nav>
  );
}
