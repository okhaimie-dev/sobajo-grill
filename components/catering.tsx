import Link from "next/link";
import { asset } from "@/lib/assets";
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
            grilled fish — for pickup, or delivered hot via DoorDash.
          </p>
          <ul className="occasions" aria-label="Perfect for">
            {OCCASIONS.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link className="btn btn-gold" href="/catering/">
              Explore catering <Icon name="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/catering/#quote">
              <Icon name="mail" /> Request a quote
            </Link>
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
