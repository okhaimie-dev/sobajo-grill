"use client";

import { SITE } from "@/lib/site";
import { useCart } from "./cart-context";
import { Icon, IconName } from "./icons";

const STATS: { icon: IconName; value: string; label: string }[] = [
  { icon: "bag", value: "No minimum", label: "Order exactly what you're craving" },
  { icon: "store", value: "Pickup", label: "Order ahead on Liberty Road" },
  { icon: "clock", value: "24 hrs", label: "Advance notice preferred" },
  { icon: "truck", value: "DoorDash", label: "Delivered by DoorDash Dashers" },
];

export default function Delivery() {
  const { openCart } = useCart();

  return (
    <section className="section delivery" id="delivery" aria-labelledby="delivery-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <Icon name="truck" /> Delivery via DoorDash
            </div>
            <h2 className="section-title" id="delivery-title">
              Fresh. Hot. <em>Delivered.</em>
            </h2>
          </div>
          <p className="section-lede">
            Delivery for family meals, game nights, office lunches and catering — brought to
            your door by DoorDash, with no order minimum.
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
              <span>Pick dishes, sizes and sides from the menu.</span>
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
          <li className="step-cta" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
            <button className="btn btn-primary" onClick={openCart}>
              Review my order <Icon name="arrow" />
            </button>
            {SITE.doordashUrl && (
              <a className="btn btn-ghost" href={SITE.doordashUrl} target="_blank" rel="noopener noreferrer">
                Order on DoorDash
              </a>
            )}
          </li>
        </ol>
      </div>
    </section>
  );
}
