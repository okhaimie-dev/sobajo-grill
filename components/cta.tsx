"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

export default function Cta() {
  const { openCart } = useCart();

  return (
    <section aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band">
          <h2 id="cta-title">Ready for the Sobajo experience?</h2>
          <p>
            Build your order, choose pickup or delivery, and check out securely with Square.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-dark" href="/menu/">
              Start your order <Icon name="arrow" />
            </Link>
            <button className="btn btn-ghost" onClick={openCart}>
              <Icon name="bag" /> View cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
