"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/assets";
import { SITE } from "@/lib/site";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#experiences", label: "Experiences" },
  { href: "#catering", label: "Catering" },
  { href: "#delivery", label: "Delivery" },
  { href: "#story", label: "Our Story" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="nav">
        <nav className="container nav-inner" aria-label="Main">
          <a href="#top" className="nav-brand" aria-label="Sobajo Grill — back to top">
            <img src={asset("/logo.png")} alt="Sobajo Grill" className="logo" width={480} height={325} />
          </a>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <a className="btn btn-primary btn-sm" href="#menu">
              Order now
            </a>
            <button
              className="cart-btn"
              onClick={() => {
              setMenuOpen(false);
              openCart();
            }}
              aria-label={`View cart, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <Icon name="bag" />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
            <button
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </header>

      {/* Outside <header>: its backdrop-filter would become this fixed panel's containing block. */}
      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu" onClick={() => setMenuOpen(false)}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="mobile-link">
              {l.label}
            </a>
          ))}
          <div className="mobile-meta">
            <a className="btn btn-primary" href="#menu">
              Start your order
            </a>
            <a className="btn btn-ghost" href={`tel:${SITE.phoneE164}`}>
              <Icon name="phone" /> {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
