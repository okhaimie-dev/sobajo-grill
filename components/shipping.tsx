import { Icon, IconName } from "./icons";
import LeadForm from "./lead-form";

const PRODUCTS: { name: string; text: string; icon: IconName }[] = [
  { name: "Sobajo Suya Spice", text: "Authentic Sobajo seasoning for grilling and cooking at home.", icon: "pepper" },
  { name: "Sobajo Hot Sauce", text: "Our bold house heat, bottled for customers nationwide.", icon: "bottle" },
  { name: "Beef Brisket Suya Packs", text: "Vacuum-sealed packs prepared for safe nationwide delivery.", icon: "package" },
  { name: "Sobajo Gift Packages", text: "Curated boxes for birthdays, holidays and family surprises.", icon: "gift" },
];

const STEPS = [
  ["Choose products", "Select package size"],
  ["Enter address", "Recipient and date"],
  ["Pay securely", "Square checkout"],
  ["Track shipment", "USPS or UPS"],
];

export default function Shipping() {
  return (
    <section className="section section-alt" id="shipping" aria-labelledby="shipping-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <Icon name="globe" /> Shipping Beyond Baltimore
            </div>
            <h2 className="section-title" id="shipping-title">
              Send Sobajo <em>nationwide.</em>
            </h2>
          </div>
          <p className="section-lede">
            Share the flavor with family and friends across the country — carefully packaged,
            trackable, and coming soon.
          </p>
        </div>

        <div className="ship-grid">
          {PRODUCTS.map((p) => (
            <article className="ship-card" key={p.name}>
              <div className="ship-icon">
                <Icon name={p.icon} />
              </div>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
              <span className="chip">Coming soon</span>
            </article>
          ))}
        </div>

        <div className="waitlist">
          <div>
            <h3>Be first in line.</h3>
            <p>
              Shelf-stable products like suya spice and hot sauce launch first. Perishables follow
              once cold-chain packaging, labeling and carrier requirements are approved and tested.
            </p>
            <div style={{ marginTop: 22 }}>
              <LeadForm kind="waitlist" compact />
            </div>
          </div>
          <ol className="ship-steps" aria-label="How shipping will work">
            {STEPS.map(([a, b]) => (
              <li key={a}>
                <strong>{a}</strong>
                <span>{b}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
