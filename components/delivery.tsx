"use client";

import { useCart } from "./cart-context";

export default function Delivery() {
  const { openCart } = useCart();

  return (
    <section className="delivery" id="delivery">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Delivery by Sobajo</div>
            <h2>Fresh. Hot. Delivered.</h2>
          </div>
          <p>
            Premium delivery for family meals, game nights, office lunches, and
            catering orders.
          </p>
        </div>
        <div className="delivery-grid">
          <div className="panel">
            <h3>Delivery Details</h3>
            <div className="info-row">
              <span>Minimum order</span>
              <strong>$100</strong>
            </div>
            <div className="info-row">
              <span>Delivery radius</span>
              <strong>Up to 20 miles</strong>
            </div>
            <div className="info-row">
              <span>Advance notice</span>
              <strong>24 hours preferred</strong>
            </div>
            <div className="info-row">
              <span>Driver</span>
              <strong>Dedicated Sobajo driver</strong>
            </div>
          </div>
          <div className="panel">
            <h3>How It Works</h3>
            <p>
              Choose your food, add it to the cart, select delivery, enter your
              address and preferred time, then continue to Square checkout.
            </p>
            <button className="btn red" onClick={openCart}>
              Review Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
