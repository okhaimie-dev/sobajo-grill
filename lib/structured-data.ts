/**
 * schema.org JSON-LD builders. The Restaurant entity is emitted site-wide by
 * the root layout; each page adds its own nodes (Menu, FAQPage, Service,
 * BreadcrumbList) that point back to it through @id.
 */

import { MENU_SECTIONS, MenuItem, MenuSection } from "./menu";
import { SITE, absoluteUrl } from "./site";

export const RESTAURANT_ID = absoluteUrl("/#restaurant");
const MENU_ID = absoluteUrl("/menu/#menu");

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

function menuSection(s: MenuSection) {
  return {
    "@type": "MenuSection",
    name: s.title,
    description: s.note,
    hasMenuItem: s.items.map(menuItem),
  };
}

export function restaurantJsonLd() {
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
        hasMenu: absoluteUrl("/menu/"),
        potentialAction: {
          "@type": "OrderAction",
          target: absoluteUrl("/menu/"),
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
    ],
  };
}

/** Full Menu (every section, item and priced size) for /menu/. */
export function menuJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": MENU_ID,
    name: `${SITE.name} Menu`,
    url: absoluteUrl("/menu/"),
    inLanguage: "en-US",
    mainEntityOfPage: absoluteUrl("/menu/"),
    provider: { "@id": RESTAURANT_ID },
    hasMenuSection: MENU_SECTIONS.map(menuSection),
  };
}

export function cateringServiceJsonLd(trays: MenuSection) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl("/catering/#service"),
    serviceType: "Catering",
    name: `${SITE.name} Catering`,
    description:
      "African barbecue and suya catering in Baltimore — half and full pans of brisket suya, fire-grilled chicken, wings, turkey wings and grilled fish, delivered by a dedicated Sobajo driver.",
    url: absoluteUrl("/catering/"),
    provider: { "@id": RESTAURANT_ID },
    areaServed: { "@type": "City", name: "Baltimore" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catering trays",
      itemListElement: trays.items.map(menuItem),
    },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl(`${path}#faq`),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Serialize for a <script type="application/ld+json">, escaping `<` per the Next.js JSON-LD guide. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
