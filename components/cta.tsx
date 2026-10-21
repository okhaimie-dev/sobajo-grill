"use client";

import { useCart } from "./cart-context";

export default function Cta() {
  const { openCart } = useCart();

  return (
    <section>
      <div className="container">
        <div className="cta">
          <h2>Ready for the Sobajo experience?</h2>
          <p>
            Build your order, choose pickup or delivery, explore nationwide
            shipping, and continue to Square checkout.
          </p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <a
              className="btn red"
              href="https://cash.app/$sobajogrillmd"
              target="_blank"
              rel="noopener"
            >
              Start Order
            </a>
            <button className="btn dark" onClick={openCart}>
              View Cart
            </button>
            <a className="btn dark" href="#shipping">
              Explore Shipping
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
