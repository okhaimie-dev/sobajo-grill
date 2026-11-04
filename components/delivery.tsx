"use client";

import { price } from "@/lib/menu";
import { useCart } from "./cart-context";
import { useSite } from "./site-context";
import { Icon, IconName } from "./icons";

/** In-house delivery; minimum, fee and area come from Sanity → Business info → Delivery. */
export default function Delivery() {
  const site = useSite();
  const { openCart } = useCart();
  const { minimum, fee, area } = site.delivery;
  const stats: { icon: IconName; value: string; label: string }[] = [
    { icon: "truck", value: "Our own drivers", label: area },
    { icon: "bag", value: `${price(minimum)} minimum`, label: fee ? `Flat ${price(fee)} delivery fee` : "Free delivery" },
    { icon: "store", value: "Pickup", label: "Any size order, on Liberty Road" },
    { icon: "clock", value: "24 hrs", label: "Advance notice preferred for big orders" },
  ];

  return (
    <section className="section delivery" id="delivery" aria-labelledby="delivery-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <Icon name="truck" /> In-house delivery
            </div>
            <h2 className="section-title" id="delivery-title">
              Fresh. Hot. <em>Delivered.</em>
            </h2>
          </div>
          <p className="section-lede">
            {`Family meals, game nights, office lunches and catering — delivered hot by our own team across ${area}. Orders from ${price(minimum)}${fee ? `, flat ${price(fee)} delivery fee` : ", free delivery"}.`}
          </p>
        </div>

        <div className="stat-grid">
          {stats.map((s) => (
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
              <span>{`Orders of ${price(minimum)}+ — add your address and preferred time.`}</span>
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
          </li>
        </ol>
      </div>
    </section>
  );
}
