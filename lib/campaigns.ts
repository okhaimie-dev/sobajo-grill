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
  /** Pre-order pickup date range (YYYY-MM-DD, inclusive); the form only offers these days. */
  pickupFrom?: string;
  pickupUntil?: string;
  seo: { title: string; description: string };
  /** image: a /public path or an image base URL that takes `&w=` (Sanity CDN). */
  hero: { eyebrow: string; title: string; accent: string; lede: string; image: string; imageAlt: string };
  /** Share-image headline (two lines). */
  og: { line1: string; line2: string };
  /** Delivery offered for this campaign; false → pickup only (page copy follows). */
  delivery: boolean;
  /** Guests pay online via the cart (paid orders → CRM); false → pre-order request form. */
  orderOnline?: boolean;
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
    bannerText: "Thanksgiving pre-orders are open — Sobajo smoked whole turkey, $100",
    bannerShort: "Thanksgiving pre-orders open",
    eventDate: "2026-11-26",
    orderBy: null,
    pickupWindows: ["Wed, Nov 25", "Thu, Nov 26 (Thanksgiving Day)"],
    pickupFrom: "2026-11-25",
    pickupUntil: "2026-11-26",
    seo: {
      title: "Thanksgiving in Baltimore — Sobajo Smoked Whole Turkey",
      description:
        "Bring the fire to your Thanksgiving table with a Sobajo smoked whole turkey, $100. Pre-order now and pick up Wednesday, Nov 25 or Thanksgiving Day at 7108 Liberty Road, Baltimore.",
    },
    hero: {
      eyebrow: "Thanksgiving 2026",
      title: "This Thanksgiving,",
      accent: "bring the fire.",
      lede: "A whole turkey, smoked and fire-finished the Sobajo way — West African heritage meets American barbecue, the centerpiece for your table. Pre-order now, pick up Nov 25 or Thanksgiving Day.",
      image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&q=75",
      imageAlt: "A Sobajo smoked whole turkey, fresh off the fire",
    },
    og: { line1: "Thanksgiving,", line2: "off the fire." },
    delivery: false,
    orderOnline: true,
    featured: ["Sobajo Smoked Whole Turkey"],
    showPlatters: false,
    sides: [],
    reasons: [
      {
        icon: "flame",
        title: "Skip the oven",
        text: "Let us handle the bird: a whole Sobajo smoked turkey, ready for your table.",
      },
      {
        icon: "calendar",
        title: "Two pickup days",
        text: "Pick up Wednesday, Nov 25 or Thanksgiving Day, Nov 26 at 7108 Liberty Road.",
      },
    ],
    cta: {
      title: "Make this Thanksgiving one to remember.",
      text: "One whole Sobajo smoked turkey, ready for your table — pre-order now and let us bring the fire.",
    },
    faqs: [
      {
        q: "How do I pre-order for Thanksgiving?",
        a: "Tap Order now, add the turkey, choose your pickup day — Wednesday, Nov 25 or Thanksgiving Day, Nov 26 — and pay securely online. Your receipt is your confirmation.",
      },
      {
        q: "What if they sell out?",
        a: "We smoke a limited number of turkeys each year. If they're gone, join the waitlist on this page and we'll text you first if we can make more.",
      },
      {
        q: "Can I get my Thanksgiving order delivered?",
        a: "Thanksgiving orders are pickup only, at 7108 Liberty Road, Baltimore, on Wednesday, Nov 25 or Thanksgiving Day, Nov 26.",
      },
      {
        q: "What's on the Thanksgiving menu?",
        a: "One thing, done right: the Sobajo smoked whole turkey, $100.",
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

/** Every day from `from` to `until`, inclusive (YYYY-MM-DD). */
export function daysBetween(from: string, until: string): string[] {
  const out: string[] = [];
  for (let d = new Date(`${from}T12:00:00Z`); d.toISOString().slice(0, 10) <= until; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
    if (out.length > 60) break; // guard against a typo'd range
  }
  return out;
}

/** "Wed, Nov 25" */
export function shortDay(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** "Thursday, November 26" */
export function formatDay(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
