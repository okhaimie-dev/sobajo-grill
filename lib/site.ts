/**
 * Business facts in one place — used by the UI (nav, footer, FAQ), page
 * metadata, sitemap/robots and the schema.org JSON-LD. Update here, not in
 * components.
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
  process.env.NEXT_PUBLIC_SITE_URL ??
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
  /** DoorDash store page — TODO: paste the listing URL; "Order on DoorDash" buttons appear once set. */
  doordashUrl: null as string | null,
  priceRange: "$$",
  cuisines: ["Nigerian", "Cameroonian", "West African", "Barbecue", "Suya"],
  /**
   * TODO: fill in real hours — they feed Google rich results ("Open now").
   * Format: schema.org days + 24h "HH:MM". Left empty so nothing is invented.
   */
  hours: [] as { days: string[]; opens: string; closes: string }[],
};

/** Pre-filled catering quote email (used by the catering teaser + page). */
export const CATERING_QUOTE_HREF = `mailto:${SITE.email}?subject=${encodeURIComponent(
  "Catering request"
)}&body=${encodeURIComponent("Event date:\nGuest count:\nLocation:\nDishes I'm interested in:\n")}`;
