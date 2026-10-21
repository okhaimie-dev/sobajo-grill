/**
 * schema.org JSON-LD for the home page: Restaurant (with full Menu and
 * offers), WebSite and FAQPage, linked through @id so Google reads them as
 * one entity graph.
 */

import { FAQS } from "./faq";
import { MENU_SECTIONS, MenuItem } from "./menu";
import { SITE, absoluteUrl } from "./site";

const RESTAURANT_ID = absoluteUrl("/#restaurant");

function itemImage(item: MenuItem): string | undefined {
  if (!item.image) return undefined;
  return item.image.startsWith("http") ? `${item.image}&w=1200` : absoluteUrl(item.image);
}

function menuItem(item: MenuItem) {
  return {
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    image: itemImage(item),
    offers: item.variations.map(([name, price]) => ({
      "@type": "Offer",
      name,
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability:
        item.available === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    })),
  };
}

export function buildJsonLd() {
  const { address } = SITE;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": RESTAURANT_ID,
        name: SITE.name,
        slogan: SITE.tagline,
        description: SITE.description,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/logo.png"),
        image: [absoluteUrl("/hero.jpg"), absoluteUrl("/catering.jpg"), absoluteUrl("/story.jpg")],
        telephone: SITE.phoneE164,
        email: SITE.email,
        priceRange: SITE.priceRange,
        servesCuisine: SITE.cuisines,
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: address.city,
          addressRegion: address.region,
          postalCode: address.postalCode,
          addressCountry: address.country,
        },
        hasMap: SITE.mapsUrl,
        areaServed: { "@type": "City", name: "Baltimore" },
        sameAs: Object.values(SITE.socials).map((s) => s.url),
        acceptsReservations: false,
        ...(SITE.hours.length && {
          openingHoursSpecification: SITE.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }),
        hasMenu: {
          "@type": "Menu",
          name: `${SITE.name} Menu`,
          url: absoluteUrl("/#menu"),
          hasMenuSection: MENU_SECTIONS.map((s) => ({
            "@type": "MenuSection",
            name: s.title,
            description: s.note,
            hasMenuItem: s.items.map(menuItem),
          })),
        },
        potentialAction: {
          "@type": "OrderAction",
          target: absoluteUrl("/#menu"),
          deliveryMethod: [
            "http://purl.org/goodrelations/v1#DeliveryModePickUp",
            "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: SITE.name,
        publisher: { "@id": RESTAURANT_ID },
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl("/#faq"),
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/** Serialize for a <script type="application/ld+json">, escaping `<` per the Next.js JSON-LD guide. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
