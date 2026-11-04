/**
 * Business facts. The editable ones (contact, hours, links, rating, SEO
 * copy) live in Sanity → "Business info" and are loaded by lib/content.ts
 * (`getSite()` on the server, `useSite()` in client components); `SITE` here
 * is the seed for the import script, the fallback without Sanity, and the
 * home of the fixed brand facts (name, cuisines, price range).
 */

import { BASE_PATH } from "./assets";

/**
 * Canonical public origin + base path, no trailing slash. Resolution order:
 * 1. NEXT_PUBLIC_SITE_URL — set this to https://sobajogrill.com once the
 *    custom domain is live (robots.txt is only honored at a domain root).
 * 2. Vercel's production domain (system env, available at build time) — so
 *    preview deploys still canonicalize to production, not to themselves.
 * 3. Local dev.
 */
export const SITE_URL = (
  // `||`: a blank NEXT_PUBLIC_SITE_URL= (as in .env.example) counts as unset.
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}${BASE_PATH}`
    : `http://localhost:3000${BASE_PATH}`)
).replace(/\/$/, "");

/** Absolute URL for a root-relative path ("/hero.jpg", "/menu/"). */
export function absoluteUrl(path = "/"): string {
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

export const SITE = {
  name: "Sobajo Grill",
  tagline: "Fire. Flavor. Friendship.",
  title: "Sobajo Grill — Baltimore Suya, BBQ & African Grill | Catering & Delivery",
  description:
    "Fire-grilled beef brisket suya, Obasanjo Fire Chicken, jollof rice and plantains in Baltimore, MD. Nigerian & Cameroonian-rooted African barbecue for pickup, local delivery and event catering.",
  keywords: [
    "suya Baltimore",
    "Baltimore suya",
    "Nigerian food Baltimore",
    "African restaurant Baltimore",
    "African BBQ",
    "beef suya",
    "jollof rice Baltimore",
    "catering Baltimore",
    "African catering",
    "Cameroonian food",
    "grill near me",
  ],
  phone: "(443) 772-6661",
  phoneE164: "+14437726661",
  email: "info@sobajogrill.com",
  address: {
    street: "7108 Liberty Road",
    city: "Baltimore",
    region: "MD",
    postalCode: "21207",
    country: "US",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sobajo+Grill+7108+Liberty+Road+Baltimore+MD+21207",
  socials: {
    instagram: { handle: "@sobajo_grill", url: "https://www.instagram.com/sobajo_grill/" },
    tiktok: { handle: "@sobajogrill", url: "https://www.tiktok.com/@sobajogrill" },
  },
  cashAppUrl: "https://cash.app/$sobajogrillmd",
  /**
   * Free "leave us a review" short link — Google Business Profile → "Ask for
   * reviews" (looks like https://g.page/r/…/review). TODO: paste it here.
   */
  googleReviewUrl: null as string | null,
  /** In-house delivery (our own drivers): order minimum and flat fee in dollars, before fee. */
  delivery: {
    minimum: 120,
    fee: 10,
    area: "Baltimore City & Baltimore County, MD",
  },
  priceRange: "$$",
  /**
   * Google star rating shown in the hero. Update by hand now and then — the
   * live figure is always on the Visit map. Kept to one decimal, no review
   * count, so it doesn't go stale quickly.
   */
  googleRating: 4.9,
  cuisines: ["Nigerian", "Cameroonian", "West African", "Barbecue", "Suya"],
  /**
   * TODO: fill in real hours — shown in "Visit us" and fed to Google via
   * JSON-LD. Days are full English names; times 24h "HH:MM". Example:
   *   { days: ["Wednesday", "Thursday"], opens: "12:00", closes: "20:00" }
   * Left empty so nothing is invented.
   */
  hours: [] as { days: string[]; opens: string; closes: string }[],
};

export type Site = typeof SITE;

/** "(443) 772-6661" → "+14437726661" (US numbers). */
export function phoneToE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `+${digits.length === 10 ? "1" + digits : digits}`;
}

export function mapsUrlFor(name: string, a: Site["address"]): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${a.street} ${a.city} ${a.region} ${a.postalCode}`
  ).replace(/%20/g, "+")}`;
}

/** Pre-filled catering quote email (used by the catering teaser + page). */
export function cateringQuoteHref(email: string): string {
  return `mailto:${email}?subject=${encodeURIComponent("Catering request")}&body=${encodeURIComponent(
    "Event date:\nGuest count:\nLocation:\nDishes I'm interested in:\n"
  )}`;
}
