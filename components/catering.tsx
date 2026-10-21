import { asset } from "@/lib/assets";
import { SITE } from "@/lib/site";
import { Icon } from "./icons";

const OCCASIONS = [
  "Offices",
  "Churches",
  "Birthdays",
  "Graduations",
  "Weddings",
  "Watch parties",
  "Community events",
];

const QUOTE_HREF = `mailto:${SITE.email}?subject=${encodeURIComponent(
  "Catering request"
)}&body=${encodeURIComponent("Event date:\nGuest count:\nLocation:\nDishes I'm interested in:\n")}`;

export default function Catering() {
  return (
    <section className="section catering" id="catering" aria-labelledby="catering-title">
      <div className="container split">
        <div>
          <div className="eyebrow">
            <Icon name="users" /> Catering &amp; Celebrations
          </div>
          <h2 id="catering-title">Bring the Sobajo experience to your event.</h2>
          <p className="lede">
            Half and full pans of brisket suya, Obasanjo Fire Chicken, wings, turkey wings and
            grilled fish — delivered hot by a dedicated Sobajo driver.
          </p>
          <ul className="occasions" aria-label="Perfect for">
            {OCCASIONS.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <a className="btn btn-gold" href="#catering-menu">
              Browse catering trays <Icon name="arrow" />
            </a>
            <a className="btn btn-ghost" href={QUOTE_HREF}>
              <Icon name="mail" /> Request a quote
            </a>
          </div>
        </div>
        <div className="split-media">
          <img
            src={asset("/catering.jpg")}
            alt="Sobajo Grill catering spread with chafing dishes for an event"
            loading="lazy"
            decoding="async"
            width={1200}
            height={800}
          />
          <div className="media-badge">
            <Icon name="calendar" width={26} height={26} color="var(--gold)" />
            <div>
              <strong>24 hrs</strong>
              <span>notice preferred</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
