/**
 * Marketing campaigns, edited in Sanity → Campaigns and loaded by
 * lib/content.ts. Each becomes a landing page at /<slug>/ (with its own SEO
 * metadata, share image and sitemap entry), and while it's live a site-wide
 * announcement bar links to it. `CAMPAIGNS` below is the import seed and the
 * fallback without Sanity.
 *
 * Featured dishes are menu items by name, so prices always match the menu.
 * Owner decisions (deadline, pickup days) stay null until set: the page hides
 * anything that isn't.
 */

import type { IconName } from "@/components/icons";

export interface Campaign {
  slug: string;
  /** Short name used in labels, e.g. "Thanksgiving". */
  name: string;
  /** Announcement bar window (inclusive, YYYY-MM-DD, America/New_York). */
  bannerFrom: string;
  bannerUntil: string;
  bannerText: string;
  /** Phone-width version of bannerText (one line at 390px). */
  bannerShort: string;
  /** The holiday/event itself, e.g. Thanksgiving Day. */
  eventDate?: string;
  /** TODO(owner): last day to pre-order. */
  orderBy: string | null;
  /** TODO(owner): pickup days/times, e.g. ["Wed, Nov 25 · 12–8 PM"]. */
  pickupWindows: string[] | null;
  seo: { title: string; description: string };
  /** image: a /public path or an image base URL that takes `&w=` (Sanity CDN). */
  hero: { eyebrow: string; title: string; accent: string; lede: string; image: string; imageAlt: string };
  /** Share-image headline (two lines). */
  og: { line1: string; line2: string };
  /** DoorDash delivery offered for this campaign; false → pickup only (page copy follows). */
  delivery: boolean;
  /** Main dishes, by exact menu name. */
  featured: string[];
  /** Ndokoti platters block. */
  showPlatters: boolean;
  /** Sides, by exact menu name. */
  sides: string[];
  reasons: { icon: IconName; title: string; text: string }[];
  cta: { title: string; text: string };
  faqs: { q: string; a: string }[];
}

export const CAMPAIGNS: Campaign[] = [
  {
    slug: "thanksgiving",
    name: "Thanksgiving",
    // TODO(owner): adjust when the bar should start/stop showing.
    bannerFrom: "2026-11-01",
    bannerUntil: "2026-11-26",
    bannerText: "Thanksgiving pre-orders are open — smoked whole turkey, suya trays & more",
    bannerShort: "Thanksgiving pre-orders open",
    eventDate: "2026-11-26",
    orderBy: null,
    pickupWindows: null,
    seo: {
      title: "Thanksgiving in Baltimore — Smoked Whole Turkey & Suya Trays",
      description:
        "Bring the fire to your Thanksgiving table: a Sobajo smoked whole turkey, beef brisket suya trays, Ndokoti platters, jollof and plantains. Pre-order for pickup on Liberty Road.",
    },
    hero: {
      eyebrow: "Thanksgiving 2026",
      title: "This Thanksgiving,",
      accent: "bring the fire.",
      lede: "A smoked whole turkey, brisket suya trays, smoky jollof and sweet plantains — West African heritage meets American barbecue, for the whole table. Pre-order for pickup on Liberty Road.",
      image: "/hero.jpg",
      imageAlt: "Sobajo brisket suya cooking over an open flame grill",
    },
    og: { line1: "Thanksgiving,", line2: "off the fire." },
    delivery: false,
    featured: ["Sobajo Smoked Whole Turkey", "Beef Brisket Suya Tray"],
    showPlatters: true,
    sides: ["Jollof Rice", "Fried Plantains", "Coleslaw"],
    reasons: [
      {
        icon: "flame",
        title: "Skip the oven",
        text: "Let us handle the bird: a whole Sobajo smoked turkey, ready for your table.",
      },
      {
        icon: "users",
        title: "Feed the whole family",
        text: "Half and full pans, plus Ndokoti platters that serve from 1–2 up to 4–6.",
      },
    ],
    cta: {
      title: "Make this Thanksgiving one to remember.",
      text: "A smoked whole turkey, suya trays and all the sides — pre-order now and let us bring the fire.",
    },
    faqs: [
      {
        q: "How do I pre-order for Thanksgiving?",
        a: "Send a pre-order request on this page with your dishes, preferred pickup date and guest count. We'll confirm the details and payment with you directly.",
      },
      {
        q: "Can I get my Thanksgiving order delivered?",
        a: "Thanksgiving orders are pickup only, at 7108 Liberty Road, Baltimore. We'll confirm your pickup time with your order.",
      },
      {
        q: "What should I order for a big group?",
        a: "Catering trays come in half pans (shallow or deep) and full trays. For an all-in-one spread, Ndokoti platters combine brisket suya, chicken, wings and sides and serve up to 4–6.",
      },
      {
        q: "Can you make it less spicy?",
        a: "Yes — most dishes come Mild, Medium, Hot or Extra Hot, and our fire-grilled fish is made without suya spice.",
      },
    ],
  },
];

export function findCampaign(campaigns: Campaign[], slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

/** Today's date in Baltimore as YYYY-MM-DD. */
export function todayInBaltimore(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);
}

/** The campaign whose announcement bar should show today, if any. */
export function activeCampaign(campaigns: Campaign[], now = new Date()): Campaign | undefined {
  const today = todayInBaltimore(now);
  return campaigns.find((c) => c.bannerFrom <= today && today <= c.bannerUntil);
}

/** "Thursday, November 26" */
export function formatDay(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
