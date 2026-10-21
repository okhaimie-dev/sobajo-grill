"use client";

import { DELIVERY_FEE, DELIVERY_MINIMUM } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon, IconName } from "./icons";

const STATS: { icon: IconName; value: string; label: string }[] = [
  { icon: "bag", value: `$${DELIVERY_MINIMUM}`, label: "Order minimum" },
  { icon: "route", value: "20 miles", label: "Delivery radius" },
  { icon: "clock", value: "24 hrs", label: "Advance notice preferred" },
  { icon: "driver", value: "Sobajo", label: "Dedicated driver, not an app" },
];

export default function Delivery() {
  const { openCart } = useCart();

  return (
    <section className="section delivery" id="delivery" aria-labelledby="delivery-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <Icon name="truck" /> Delivery by Sobajo
            </div>
            <h2 className="section-title" id="delivery-title">
              Fresh. Hot. <em>Delivered.</em>
            </h2>
          </div>
          <p className="section-lede">
            Premium delivery for family meals, game nights, office lunches and catering — a flat
            ${DELIVERY_FEE} fee across the Baltimore area.
          </p>
        </div>

        <div className="stat-grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <Icon name={s.icon} />
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <ol className="steps">
          <li className="step">
            <div>
              <strong>Build your order</strong>
              <span>Pick dishes, sizes and spice from the menu.</span>
            </div>
          </li>
          <li className="step">
            <div>
              <strong>Choose delivery</strong>
              <span>Add your address and preferred time.</span>
            </div>
          </li>
          <li className="step">
            <div>
              <strong>Check out securely</strong>
              <span>Pay through Square — we handle the rest.</span>
            </div>
          </li>
          <li className="step-cta">
            <button className="btn btn-primary" onClick={openCart}>
              Review my order <Icon name="arrow" />
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
}
