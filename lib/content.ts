/**
 * Site content from Sanity (edited at /studio), normalized into the same
 * shapes the components always used: MenuItem/MenuSection, Campaign, Site,
 * FAQ lists. Server-only.
 *
 * Caching: everything comes from ONE small GROQ query, cached by Next under
 * the tag `sanity` for up to an hour. Publishing in the Studio calls
 * /api/revalidate (Sanity webhook), which expires the tag, so the next visit
 * renders fresh content. One tag on purpose: the whole site is a few dozen
 * documents, and campaigns reference menu items, so any publish refreshes all.
 *
 * Fallback: without NEXT_PUBLIC_SANITY_PROJECT_ID, or before the import has
 * run (no "Business info" document yet), the seed content in lib/*.ts is
 * used. Once Sanity holds content, a failed fetch throws instead: Next keeps
 * serving the last good page and checkout answers "try again", rather than
 * quietly falling back to stale seed prices.
 */

import { cache } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityConfigured } from "@/sanity/env";
import { CAMPAIGNS, Campaign, activeCampaign, findCampaign } from "./campaigns";
import { CATERING_FAQS, FAQS } from "./faq";
import { ItemStatus, MenuItem, MenuSection, SECTION_DEFS, SectionLayout, buildSections, items as SEED_ITEMS, withSides } from "./menu";
import { imageBase, sanity } from "./sanity";
import { SITE, Site, mapsUrlFor, phoneToE164 } from "./site";
import type { IconName } from "@/components/icons";

export type Faq = { q: string; a: string };

export interface Content {
  site: Site;
  items: MenuItem[];
  sections: MenuSection[];
  campaigns: Campaign[];
  faqs: { home: Faq[]; catering: Faq[] };
}

export const CONTENT_TAG = "sanity";

const QUERY = /* groq */ `{
  "site": *[_id == "siteSettings"][0],
  "sections": *[_type == "menuSection" && defined(anchor.current)] | order(sortOrder asc, title asc) {
    _id, title, tab, "id": anchor.current, layout, note
  },
  "items": *[_type == "menuItem" && defined(section._ref)] | order(sortOrder asc, name asc) {
    name, description, badge, includes, sideMode, offeredAsSide,
    "status": coalesce(status, "available"),
    "sectionRef": section._ref,
    "variations": variations[defined(label) && defined(price)]{ label, price },
    image
  },
  "campaigns": *[_type == "campaign" && defined(slug.current)] | order(bannerFrom desc) {
    name, "slug": slug.current, bannerFrom, bannerUntil, bannerText, bannerShort,
    eventDate, orderBy, pickupWindows, seo, hero, og, showPlatters, reasons, cta, faqs,
    "featured": featured[]->name, "sides": sides[]->name
  },
  "faqs": *[_type == "faq"] | order(sortOrder asc) { page, "q": question, "a": answer }
}`;

type SanityImage = SanityImageSource & { asset?: { _ref: string }; hotspot?: { x: number; y: number } };

interface Raw {
  site: {
    phone: string; email: string; address: Site["address"] & { country?: string };
    hours?: { days: string[]; opens: string; closes: string }[];
    googleRating: number; googleReviewUrl?: string; doordashUrl?: string; cashAppUrl?: string;
    instagram?: { handle?: string; url?: string }; tiktok?: { handle?: string; url?: string };
    tagline: string; seoTitle: string; seoDescription: string; keywords?: string[];
  } | null;
  sections: { _id: string; id: string; title: string; tab: string; layout: SectionLayout; note?: string }[];
  items: {
    name: string; description?: string; badge?: string; includes?: string[];
    sideMode?: "none" | "optional" | "included"; offeredAsSide?: boolean; status?: ItemStatus;
    sectionRef: string; variations?: { label: string; price: number }[]; image?: SanityImage;
  }[];
  campaigns: (Omit<Campaign, "hero" | "featured" | "sides" | "reasons" | "faqs" | "pickupWindows" | "orderBy"> & {
    hero: Omit<Campaign["hero"], "image"> & { image?: SanityImage };
    featured?: (string | null)[]; sides?: (string | null)[];
    reasons?: Campaign["reasons"]; faqs?: Faq[]; pickupWindows?: string[]; orderBy?: string;
  })[];
  faqs: { page: "home" | "catering"; q: string; a: string }[];
}

const hasAsset = (img?: SanityImage): img is SanityImage => Boolean(img?.asset?._ref);
const pct = (n: number) => `${Math.round(n * 100)}%`;
const names = (refs?: (string | null)[]) => (refs ?? []).filter((n): n is string => Boolean(n));

function normalize(raw: Raw): Content {
  const s = raw.site!;
  const address = { ...SITE.address, ...s.address, country: SITE.address.country };
  const site: Site = {
    ...SITE,
    tagline: s.tagline,
    title: s.seoTitle,
    description: s.seoDescription,
    keywords: s.keywords?.length ? s.keywords : SITE.keywords,
    phone: s.phone,
    phoneE164: phoneToE164(s.phone),
    email: s.email,
    address,
    mapsUrl: mapsUrlFor(SITE.name, address),
    socials: {
      instagram: { handle: s.instagram?.handle ?? "", url: s.instagram?.url ?? "" },
      tiktok: { handle: s.tiktok?.handle ?? "", url: s.tiktok?.url ?? "" },
    },
    cashAppUrl: s.cashAppUrl ?? "",
    googleReviewUrl: s.googleReviewUrl ?? null,
    doordashUrl: s.doordashUrl ?? null,
    googleRating: s.googleRating,
    hours: s.hours ?? [],
  };

  const anchorByRef = new Map(raw.sections.map((sec) => [sec._id, sec.id]));
  const items = withSides(
    raw.items
      .filter((i) => anchorByRef.has(i.sectionRef) && i.variations?.length)
      .map((i): MenuItem => ({
        name: i.name,
        description: i.description ?? "",
        section: anchorByRef.get(i.sectionRef)!,
        image: hasAsset(i.image) ? imageBase(i.image) : undefined,
        imagePosition: hasAsset(i.image) && i.image.hotspot ? `${pct(i.image.hotspot.x)} ${pct(i.image.hotspot.y)}` : undefined,
        badge: i.badge || undefined,
        includes: i.includes?.length ? i.includes : undefined,
        variations: i.variations!.map((v) => [v.label, v.price]),
        sideMode: i.sideMode === "optional" || i.sideMode === "included" ? i.sideMode : undefined,
        offeredAsSide: i.offeredAsSide ?? false,
        status: i.status ?? "available",
        available: (i.status ?? "available") === "available",
      }))
  );
  const sections = buildSections(
    raw.sections.map(({ id, title, tab, layout, note }) => ({ id, title, tab, layout, note: note || undefined })),
    items
  );

  const campaigns = raw.campaigns
    .filter((c) => hasAsset(c.hero?.image))
    .map((c): Campaign => ({
      ...c,
      orderBy: c.orderBy ?? null,
      pickupWindows: c.pickupWindows?.length ? c.pickupWindows : null,
      hero: { ...c.hero, image: imageBase(c.hero.image!) },
      featured: names(c.featured),
      sides: names(c.sides),
      showPlatters: c.showPlatters ?? false,
      reasons: (c.reasons ?? []).map((r) => ({ ...r, icon: r.icon as IconName })),
      faqs: c.faqs ?? [],
    }));

  return {
    site,
    items,
    sections,
    campaigns,
    faqs: {
      home: raw.faqs.filter((f) => f.page === "home"),
      catering: raw.faqs.filter((f) => f.page === "catering"),
    },
  };
}

function seedContent(): Content {
  const items = withSides(SEED_ITEMS);
  return {
    site: SITE,
    items,
    sections: buildSections(SECTION_DEFS, items),
    campaigns: CAMPAIGNS,
    faqs: { home: FAQS, catering: CATERING_FAQS },
  };
}

/** All site content, deduplicated per request and cached across requests by tag. */
export const getContent = cache(async (): Promise<Content> => {
  if (!sanityConfigured) return seedContent();
  const raw = await sanity.fetch<Raw>(
    QUERY,
    {},
    // Dev: always fresh, so a Studio publish shows on the next refresh (Next's
    // data cache also runs under `next dev`, and the webhook can't reach localhost).
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : { next: { tags: [CONTENT_TAG], revalidate: 3600 } }
  );
  if (!raw.site) {
    console.warn("[content] Sanity has no Business info yet — using seed content (run `npm run sanity:import`)");
    return seedContent();
  }
  return normalize(raw);
});

export const getSite = async () => (await getContent()).site;
export const getMenu = async () => {
  const { items, sections } = await getContent();
  return { items, sections };
};
export const getCampaigns = async () => (await getContent()).campaigns;
export const getCampaign = async (slug: string) => findCampaign(await getCampaigns(), slug);
export const getActiveCampaign = async () => activeCampaign(await getCampaigns());
export const getFaqs = async () => (await getContent()).faqs;
