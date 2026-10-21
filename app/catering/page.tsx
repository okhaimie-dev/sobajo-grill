import { asset } from "@/lib/assets";
import { CATERING_FAQS } from "@/lib/faq";
import { DELIVERY_FEE, DELIVERY_MINIMUM, MENU_SECTIONS } from "@/lib/menu";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { cateringServiceJsonLd, faqJsonLd } from "@/lib/structured-data";
import CateringTrays from "@/components/catering-trays";
import Faq from "@/components/faq";
import { Icon, IconName } from "@/components/icons";
import JsonLd from "@/components/json-ld";
import LeadForm from "@/components/lead-form";
import { Tiers } from "@/components/menu-items";
import PageHero from "@/components/page-hero";

export const metadata = pageMetadata({
  title: "Catering in Baltimore — African BBQ & Suya Trays",
  description: `Cater your next event with Sobajo Grill: half and full pans of beef brisket suya, Obasanjo Fire Chicken, wings, turkey wings and grilled fish. Pickup in Baltimore or delivery via DoorDash. Trays from $50.`,
  path: "/catering/",
});

const trays = MENU_SECTIONS.find((s) => s.id === "catering-menu")!;
const ndokoti = MENU_SECTIONS.find((s) => s.id === "ndokoti")!;

const OCCASIONS: { label: string; text: string; icon: IconName }[] = [
  { label: "Offices", text: "Team lunches, meetings and client days.", icon: "store" },
  { label: "Churches", text: "Fellowship, anniversaries and Sunday gatherings.", icon: "users" },
  { label: "Birthdays", text: "Milestones worth a real spread.", icon: "gift" },
  { label: "Graduations", text: "Feed the family and the whole class.", icon: "calendar" },
  { label: "Weddings", text: "Bold flavor for the reception table.", icon: "heart" },
  { label: "Watch parties", text: "Fire wings and trays for game day.", icon: "flame" },
  { label: "Community events", text: "Block parties, fundraisers and festivals.", icon: "globe" },
];

const STEPS = [
  ["Choose your trays", "Pick dishes and pan sizes below, or ask us to build the spread."],
  ["Set the date", "24 hours' notice preferred — earlier for big events."],
  ["Pickup or delivery", `Pick up at our Liberty Road kitchen, or get it delivered via DoorDash ($${DELIVERY_MINIMUM} minimum, $${DELIVERY_FEE} fee).`],
  ["We bring the fire", "Everything arrives hot, with onions and Sobajo hot sauce."],
];

export default function CateringPage() {
  return (
    <>
      <JsonLd data={cateringServiceJsonLd(trays)} />
      <JsonLd data={faqJsonLd(CATERING_FAQS, "/catering/")} />

      <PageHero
        crumb="Catering"
        path="/catering/"
        eyebrow={
          <>
            <Icon name="users" /> Catering &amp; Celebrations
          </>
        }
        title={
          <>
            Baltimore catering, <span className="accent">Sobajo style.</span>
          </>
        }
        lede="Half and full pans of brisket suya, Obasanjo Fire Chicken, wings, turkey wings and fire-grilled fish — West African heritage meets American barbecue, for every kind of gathering."
        image={{ src: asset("/catering.jpg"), alt: "Sobajo Grill catering spread with chafing dishes at an event" }}
      >
        <div className="hero-actions">
          <a className="btn btn-primary" href="#trays">
            See tray pricing <Icon name="arrow" />
          </a>
          <a className="btn btn-ghost" href="#quote">
            <Icon name="mail" /> Request a quote
          </a>
        </div>
        <div className="hero-meta">
          <span>
            <Icon name="package" /> Half &amp; full pans
          </span>
          <span>
            <Icon name="truck" /> Pickup or DoorDash delivery
          </span>
          <span>
            <Icon name="clock" /> 24 hrs notice preferred
          </span>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="occasions-title">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Perfect for</div>
              <h2 className="section-title" id="occasions-title">
                Wherever people <em>gather.</em>
              </h2>
            </div>
            <p className="section-lede">
              Sobajo means friend — and our catering is built for the tables where friends,
              family and community come together.
            </p>
          </div>
          <ul className="occasion-grid">
            {OCCASIONS.map((o) => (
              <li className="occasion" key={o.label}>
                <Icon name={o.icon} />
                <strong>{o.label}</strong>
                <span>{o.text}</span>
              </li>
            ))}
            <li className="occasion occasion-cta">
              <strong>Something else?</strong>
              <a className="text-link" href="#quote">
                Tell us about it <Icon name="arrow" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section-alt" id="trays" aria-labelledby="trays-title">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Trays &amp; pricing</div>
              <h2 className="section-title" id="trays-title">
                Pick your pans.
              </h2>
            </div>
            <p className="section-lede">
              Prices are per pan. Choose spice level and add notes when you add a tray to your
              order.
            </p>
          </div>
          <CateringTrays items={trays.items} />
        </div>
      </section>

      <section className="section" aria-labelledby="platters-title">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Smaller gathering?</div>
              <h2 className="section-title" id="platters-title">
                Ndokoti <em>platters.</em>
              </h2>
            </div>
            <p className="section-lede">{ndokoti.note}</p>
          </div>
          <Tiers items={ndokoti.items} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">How it works</div>
              <h2 className="section-title" id="how-title">
                Four steps to a <em>feast.</em>
              </h2>
            </div>
          </div>
          <ol className="steps steps-4">
            {STEPS.map(([title, text]) => (
              <li className="step" key={title}>
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="quote" aria-labelledby="quote-title">
        <div className="container quote-grid">
          <div>
            <div className="eyebrow">Request a quote</div>
            <h2 className="section-title" id="quote-title">
              Let&apos;s plan your <em>spread.</em>
            </h2>
            <p className="section-lede" style={{ marginTop: 16 }}>
              Share your date, guest count and location and we&apos;ll put together the perfect
              Sobajo feast. Prefer to talk? Call{" "}
              <a href={`tel:${SITE.phoneE164}`} style={{ color: "var(--gold)", fontWeight: 700 }}>
                {SITE.phone}
              </a>
              .
            </p>
          </div>
          <div className="quote-card">
            <LeadForm kind="catering" />
          </div>
        </div>
      </section>

      <Faq
        faqs={CATERING_FAQS}
        title={
          <>
            Catering, <em>answered.</em>
          </>
        }
        intro="Have a date, a guest count or a special request? We'll help you plan the spread."
      />

      <section aria-labelledby="catering-cta-title">
        <div className="container">
          <div className="cta-band">
            <h2 id="catering-cta-title">Bring the fire to your event.</h2>
            <p>Tell us about your gathering and we&apos;ll handle the rest — pickup or delivery via DoorDash.</p>
            <div className="hero-actions">
              <a className="btn btn-dark" href="#quote">
                <Icon name="mail" /> Request a quote
              </a>
              <a className="btn btn-ghost" href={`tel:${SITE.phoneE164}`}>
                <Icon name="phone" /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
