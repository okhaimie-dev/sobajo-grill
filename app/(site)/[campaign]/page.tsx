import { notFound } from "next/navigation";
import { asset } from "@/lib/assets";
import { formatDay } from "@/lib/campaigns";
import { getCampaign, getCampaigns, getContent } from "@/lib/content";
import { MenuItem, sectionById } from "@/lib/menu";
import { OG_IMAGE, pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { faqJsonLd } from "@/lib/structured-data";
import Faq from "@/components/faq";
import { Icon } from "@/components/icons";
import JsonLd from "@/components/json-ld";
import LeadForm from "@/components/lead-form";
import { DishCard, ListRows, Tiers } from "@/components/menu-items";
import PageHero from "@/components/page-hero";

/**
 * One landing page per campaign in Sanity. Known ones are prerendered at
 * build; one created later renders on its first visit (then cached). Unknown
 * slugs 404.
 */
export async function generateStaticParams() {
  return (await getCampaigns()).map((c) => ({ campaign: c.slug }));
}

type Props = { params: Promise<{ campaign: string }> };

export async function generateMetadata({ params }: Props) {
  const c = await getCampaign((await params).campaign);
  if (!c) return {};
  return pageMetadata({
    title: c.seo.title,
    description: c.seo.description,
    path: `/${c.slug}/`,
    image: { ...OG_IMAGE, url: absoluteUrl(`/${c.slug}/og.png`), alt: `${c.name} at ${SITE.name}` },
  });
}

/** Menu items by exact name, in the campaign's order (ones no longer on the menu are skipped). */
function menuItems(all: MenuItem[], names: string[]): MenuItem[] {
  return names.flatMap((name) => all.find((i) => i.name === name) ?? []);
}

export default async function CampaignPage({ params }: Props) {
  const [{ campaign: slug }, { campaigns, items, sections, site }] = await Promise.all([params, getContent()]);
  const c = campaigns.find((x) => x.slug === slug);
  if (!c) notFound();

  const featured = menuItems(items, c.featured);
  const sides = menuItems(items, c.sides);
  const platters = sectionById(sections, "ndokoti");
  const heroSrc = c.hero.image.startsWith("http") ? `${c.hero.image}&w=1600` : asset(c.hero.image);
  const faqs = c.orderBy
    ? [{ q: `What's the last day to pre-order?`, a: `Please send your pre-order request by ${formatDay(c.orderBy)}.` }, ...c.faqs]
    : c.faqs;

  return (
    <>
      <JsonLd data={faqJsonLd(faqs, `/${c.slug}/`)} />

      <PageHero
        crumb={c.name}
        path={`/${c.slug}/`}
        eyebrow={
          <>
            <Icon name="flame" /> {c.hero.eyebrow}
          </>
        }
        title={
          <>
            {c.hero.title} <span className="accent">{c.hero.accent}</span>
          </>
        }
        lede={c.hero.lede}
        image={{ src: heroSrc, alt: c.hero.imageAlt }}
      >
        <div className="hero-actions">
          <a className="btn btn-primary" href="#preorder">
            Pre-order now <Icon name="arrow" />
          </a>
          <a className="btn btn-ghost" href="#menu-picks">
            See the menu
          </a>
        </div>
        <div className="hero-meta">
          {c.eventDate && (
            <span>
              <Icon name="calendar" /> {c.name}: {formatDay(c.eventDate)}
            </span>
          )}
          {c.orderBy && (
            <span>
              <Icon name="clock" /> Order by {formatDay(c.orderBy)}
            </span>
          )}
          {c.delivery ? (
            <span>
              <Icon name="truck" /> Pickup or DoorDash delivery
            </span>
          ) : (
            <span>
              <Icon name="store" /> Pickup only · {site.address.street}
            </span>
          )}
        </div>
      </PageHero>

      <section className="section" aria-labelledby="why-title">
        <div className="container">
          <h2 className="sr-only" id="why-title">
            Why Sobajo for {c.name}
          </h2>
          <ul className="occasion-grid reason-grid">
            {c.reasons.map((r) => (
              <li className="occasion" key={r.title}>
                <Icon name={r.icon} />
                <strong>{r.title}</strong>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt" id="menu-picks" aria-labelledby="picks-title">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The {c.name} table</div>
              <h2 className="section-title" id="picks-title">
                Off the fire, <em>onto your table.</em>
              </h2>
            </div>
            <p className="section-lede">
              {featured.length + sides.length > 1 ||
              featured.some((i) => i.variations.length > 1 || i.sideMode)
                ? "Add dishes to your order, pick sizes and sides — then send your pre-order request below and we'll confirm everything with you."
                : "Send your pre-order request below and we'll confirm your order, pickup day and payment with you."}
            </p>
          </div>
          <div className="menu-grid">
            {featured.map((i) => (
              <DishCard key={i.name} item={i} />
            ))}
          </div>
          {sides.length > 0 && (
            <div className="campaign-sides">
              <h3>On the side</h3>
              <ListRows items={sides} />
            </div>
          )}
        </div>
      </section>

      {c.showPlatters && platters.items.length > 0 && (
        <section className="section" aria-labelledby="platters-title">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">All-in-one spreads</div>
                <h2 className="section-title" id="platters-title">
                  Ndokoti <em>platters.</em>
                </h2>
              </div>
              <p className="section-lede">{platters.note}</p>
            </div>
            <Tiers items={platters.items} />
          </div>
        </section>
      )}

      <section className="section section-alt" id="preorder" aria-labelledby="preorder-title">
        <div className="container quote-grid">
          <div>
            <div className="eyebrow">Pre-order</div>
            <h2 className="section-title" id="preorder-title">
              Reserve your <em>{c.name} spread.</em>
            </h2>
            <p className="section-lede" style={{ marginTop: 16 }}>
              Send your request and we&apos;ll call or text to confirm your order, pickup time and
              payment. Prefer to talk? Call{" "}
              <a href={`tel:${site.phoneE164}`} style={{ color: "var(--gold)", fontWeight: 700 }}>
                {site.phone}
              </a>
              .
            </p>
            <dl className="key-dates">
              {c.eventDate && (
                <div>
                  <dt>{c.name}</dt>
                  <dd>{formatDay(c.eventDate)}</dd>
                </div>
              )}
              {c.orderBy && (
                <div>
                  <dt>Pre-order by</dt>
                  <dd>{formatDay(c.orderBy)}</dd>
                </div>
              )}
              <div>
                <dt>Pickup</dt>
                <dd>
                  {c.pickupWindows?.length
                    ? c.pickupWindows.join(" · ")
                    : `${site.address.street}, ${site.address.city} — time confirmed with your order`}
                </dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{c.delivery ? "Via DoorDash" : "Not available — pickup only"}</dd>
              </div>
            </dl>
          </div>
          <div className="quote-card" data-hide-fab>
            <LeadForm kind="preorder" campaign={c.slug} minDate={c.pickupFrom} maxDate={c.pickupUntil ?? c.eventDate} delivery={c.delivery} />
          </div>
        </div>
      </section>

      <Faq
        faqs={faqs}
        title={
          <>
            {c.name}, <em>answered.</em>
          </>
        }
        intro="Questions about your order? We're happy to help you plan the table."
      />

      <section aria-labelledby="campaign-cta-title">
        <div className="container">
          <div className="cta-band">
            <h2 id="campaign-cta-title">{c.cta.title}</h2>
            <p>{c.cta.text}</p>
            <div className="hero-actions">
              <a className="btn btn-dark" href="#preorder">
                Pre-order now <Icon name="arrow" />
              </a>
              <a className="btn btn-ghost" href={`tel:${site.phoneE164}`}>
                <Icon name="phone" /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
