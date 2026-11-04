/**
 * One-time import: copies the seed content in lib/*.ts (menu, campaigns,
 * FAQs, business info, shipping products) into Sanity, uploading every photo.
 *
 *   npm run sanity:import            # create what's missing, keep edits
 *   npm run sanity:import -- --force # overwrite Sanity with the seed
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and an Editor token in
 * SANITY_API_WRITE_TOKEN (.env.local). Document ids are deterministic, so
 * re-running never duplicates anything; without --force, existing documents
 * (and any edits made in the Studio) are left alone.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import { CAMPAIGNS } from "../lib/campaigns";
import { CATERING_FAQS, FAQS } from "../lib/faq";
import { SECTION_DEFS, items } from "../lib/menu";
import { SHIPPING_PRODUCTS } from "../lib/shipping";
import { SITE } from "../lib/site";

try {
  process.loadEnvFile(".env.local");
} catch {
  // rely on the environment
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}
const force = process.argv.includes("--force");

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-01",
  token,
  useCdn: false,
});

const slug = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
// Ids without dots: dotted ids aren't readable by the public (tokenless) site client.
const itemId = (name: string) => `menuItem-${slug(name)}`;
let k = 0;
const key = () => `k${(k++).toString(36).padStart(4, "0")}`;
const ref = (_ref: string) => ({ _type: "reference", _ref, _key: key() });

/** Upload a /public file or remote image once; Sanity dedupes identical files too. */
const uploaded = new Map<string, Promise<string>>();
function uploadImage(src: string): Promise<string> {
  if (!uploaded.has(src)) {
    uploaded.set(
      src,
      (async () => {
        let buf: Buffer;
        let filename: string;
        if (src.startsWith("http")) {
          const res = await fetch(`${src}&w=1800&fm=jpg`);
          if (!res.ok) throw new Error(`${res.status} downloading ${src}`);
          buf = Buffer.from(await res.arrayBuffer());
          filename = `${new URL(src).pathname.split("/").pop()}.jpg`;
        } else {
          buf = await readFile(join(process.cwd(), "public", src));
          filename = src.replace(/^\//, "");
        }
        const asset = await client.assets.upload("image", buf, { filename });
        console.log(`  image  ${filename}`);
        return asset._id;
      })()
    );
  }
  return uploaded.get(src)!;
}
const image = async (src: string) => ({ _type: "image", asset: { _type: "reference", _ref: await uploadImage(src) } });

async function main() {
  console.log(`Importing into ${projectId}/${client.config().dataset}${force ? " (--force: overwriting)" : ""}…`);
  const docs: { _id: string; _type: string; [k: string]: unknown }[] = [];

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    phone: SITE.phone,
    email: SITE.email,
    address: { street: SITE.address.street, city: SITE.address.city, region: SITE.address.region, postalCode: SITE.address.postalCode },
    hours: SITE.hours.map((h) => ({ ...h, _key: key(), _type: "hoursRow" })),
    googleRating: SITE.googleRating,
    ...(SITE.googleReviewUrl && { googleReviewUrl: SITE.googleReviewUrl }),
    ...(SITE.doordashUrl && { doordashUrl: SITE.doordashUrl }),
    cashAppUrl: SITE.cashAppUrl,
    instagram: SITE.socials.instagram,
    tiktok: SITE.socials.tiktok,
    tagline: SITE.tagline,
    seoTitle: SITE.title,
    seoDescription: SITE.description,
    keywords: SITE.keywords,
  });

  SECTION_DEFS.forEach((s, i) =>
    docs.push({
      _id: `menuSection-${s.id}`,
      _type: "menuSection",
      title: s.title,
      tab: s.tab,
      anchor: { _type: "slug", current: s.id },
      layout: s.layout,
      ...(s.note && { note: s.note }),
      sortOrder: (i + 1) * 10,
    })
  );

  const perSection = new Map<string, number>();
  for (const item of items) {
    const n = (perSection.get(item.section) ?? 0) + 1;
    perSection.set(item.section, n);
    docs.push({
      _id: itemId(item.name),
      _type: "menuItem",
      status: item.status ?? (item.available === false ? "soldOut" : "available"),
      name: item.name,
      section: { _type: "reference", _ref: `menuSection-${item.section}` },
      description: item.description,
      ...(item.image && { image: await image(item.image) }),
      ...(item.badge && { badge: item.badge }),
      variations: item.variations.map(([label, price]) => ({ _type: "variation", _key: key(), label, price })),
      sideMode: item.sideMode ?? "none",
      offeredAsSide: item.offeredAsSide ?? false,
      ...(item.includes && { includes: item.includes }),
      sortOrder: n * 10,
    });
  }

  for (const c of CAMPAIGNS) {
    const refs = (names: string[]) =>
      names.map((name) => {
        if (!items.some((i) => i.name === name)) throw new Error(`Campaign ${c.slug}: no menu item "${name}"`);
        return ref(itemId(name));
      });
    docs.push({
      _id: `campaign-${c.slug}`,
      _type: "campaign",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      bannerFrom: c.bannerFrom,
      bannerUntil: c.bannerUntil,
      bannerText: c.bannerText,
      bannerShort: c.bannerShort,
      ...(c.eventDate && { eventDate: c.eventDate }),
      ...(c.orderBy && { orderBy: c.orderBy }),
      ...(c.pickupWindows && { pickupWindows: c.pickupWindows }),
      hero: { ...c.hero, image: await image(c.hero.image) },
      reasons: c.reasons.map((r) => ({ ...r, _type: "reason", _key: key() })),
      cta: c.cta,
      faqs: c.faqs.map((f) => ({ ...f, _type: "campaignFaq", _key: key() })),
      featured: refs(c.featured),
      sides: refs(c.sides),
      showPlatters: c.showPlatters,
      seo: c.seo,
      og: c.og,
    });
  }

  for (const [page, list] of [["home", FAQS], ["catering", CATERING_FAQS]] as const) {
    list.forEach((f, i) =>
      docs.push({ _id: `faq-${page}-${i + 1}`, _type: "faq", page, question: f.q, answer: f.a, sortOrder: (i + 1) * 10 })
    );
  }

  SHIPPING_PRODUCTS.forEach((p, i) =>
    docs.push({
      _id: `shippingProduct-${slug(p.name)}`,
      _type: "shippingProduct",
      status: p.status,
      name: p.name,
      description: p.text,
      icon: p.icon,
      sortOrder: (i + 1) * 10,
    })
  );

  const existing = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: docs.map((d) => d._id) }));
  const tx = client.transaction();
  for (const d of docs) (force ? tx.createOrReplace(d) : tx.createIfNotExists(d));
  await tx.commit({ visibility: "async" });

  const created = docs.filter((d) => !existing.has(d._id)).length;
  const kept = docs.length - created;
  console.log(
    `Done: ${created} created, ${kept} ${force ? "overwritten" : "already there (left unchanged)"}, ${uploaded.size} images.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
