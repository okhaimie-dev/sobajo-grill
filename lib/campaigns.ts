/**
 * Marketing campaigns. Each entry becomes a landing page at /<slug>/ (with
 * its own SEO metadata, share image and sitemap entry), and while it's live
 * a site-wide announcement bar links to it. A new campaign is a new entry
 * here — no new page code.
 *
 * Featured dishes reference lib/menu.ts by name, so prices always match the
 * menu. Leave owner decisions (deadline, pickup days) null until confirmed:
 * the page hides anything that isn't set.
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
  hero: { eyebrow: string; title: string; accent: string; lede: string; image: string; imageAlt: string };
  /** Share-image headline (two lines). */
  og: { line1: string; line2: string };
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
    bannerText: "Thanksgiving pre-orders are open — smoked turkey wings, suya trays & more",
    bannerShort: "Thanksgiving pre-orders open",
    eventDate: "2026-11-26",
    orderBy: null,
    pickupWindows: null,
    seo: {
      title: "Thanksgiving in Baltimore — Smoked Turkey Wings & Suya Trays",
      description:
        "Bring the fire to your Thanksgiving table: Sobajo smoked turkey wings, turkey wing and beef brisket suya trays, Ndokoti platters, jollof and plantains. Pre-order for pickup on Liberty Road or delivery via DoorDash.",
    },
    hero: {
      eyebrow: "Thanksgiving 2026",
      title: "This Thanksgiving,",
      accent: "bring the fire.",
      lede: "Smoked turkey wings, brisket suya trays, smoky jollof and sweet plantains — West African heritage meets American barbecue, for the whole table. Pre-order for pickup, or get it delivered via DoorDash.",
      image: "/hero.jpg",
      imageAlt: "Sobajo brisket suya cooking over an open flame grill",
    },
    og: { line1: "Thanksgiving,", line2: "off the fire." },
    featured: ["Sobajo Smoked Turkey Wings", "Turkey Wings Tray", "Beef Brisket Suya Tray"],
    showPlatters: true,
    sides: ["Jollof Rice", "Fried Plantains", "Coleslaw"],
    reasons: [
      {
        icon: "flame",
        title: "Skip the oven",
        text: "Let us handle the bird: Sobajo smoked turkey wings, by the plate or by the tray.",
      },
      {
        icon: "users",
        title: "Feed the whole family",
        text: "Half and full pans, plus Ndokoti platters that serve from 1–2 up to 4–6.",
      },
      {
        icon: "pepper",
        title: "Spice for every guest",
        text: "Mild for the kids, Extra Hot for the uncles — choose per dish.",
      },
    ],
    cta: {
      title: "Make this Thanksgiving one to remember.",
      text: "Smoked turkey wings, suya trays and all the sides — pre-order now and let us bring the fire.",
    },
    faqs: [
      {
        q: "How do I pre-order for Thanksgiving?",
        a: "Send a pre-order request on this page with your dishes, preferred pickup date and guest count. We'll confirm the details and payment with you directly.",
      },
      {
        q: "Can I get my Thanksgiving order delivered?",
        a: "Yes — delivery is handled by DoorDash. Pickup is at 7108 Liberty Road, Baltimore.",
      },
      {
        q: "What should I order for a big group?",
        a: "Catering trays come in half and full pans (shallow or deep). For an all-in-one spread, Ndokoti platters combine brisket suya, chicken, wings and sides and serve up to 4–6.",
      },
      {
        q: "Can you make it less spicy?",
        a: "Yes — most dishes come Mild, Medium, Hot or Extra Hot, and our fire-grilled fish is made without suya spice.",
      },
    ],
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug);
}

/** Today's date in Baltimore as YYYY-MM-DD. */
export function todayInBaltimore(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);
}

/** The campaign whose announcement bar should show today, if any. */
export function activeCampaign(now = new Date()): Campaign | undefined {
  const today = todayInBaltimore(now);
  return CAMPAIGNS.find((c) => c.bannerFrom <= today && today <= c.bannerUntil);
}

/** "Thursday, November 26" */
export function formatDay(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
