import { defineArrayMember, defineField, defineType } from "sanity";

/** Icons from components/icons.tsx that read well on a reason card. */
const ICONS = ["flame", "users", "gift", "calendar", "clock", "truck", "store", "package", "heart", "globe", "pepper", "bottle", "star", "check"];

const menuItemRefs = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    group: "menu",
    of: [defineArrayMember({ type: "reference", to: [{ type: "menuItem" }] })],
    validation: (r) => r.unique(),
  });

export const campaign = defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  groups: [
    { name: "basics", title: "Basics & dates", default: true },
    { name: "page", title: "Page content" },
    { name: "menu", title: "Featured dishes" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", description: "Short, e.g. “Thanksgiving”.", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Page address",
      description: "The page lives at /<this>/. Don't change it once ads or links point to it.",
      type: "slug",
      group: "basics",
      options: { source: "name" },
      validation: (r) =>
        r.required().custom((s) =>
          !s?.current || /^[a-z0-9-]+$/.test(s.current)
            ? ["menu", "catering", "privacy", "studio", "api"].includes(s?.current ?? "")
              ? "That address is already used by the site."
              : true
            : "Lowercase letters, numbers and dashes only."
        ),
    }),
    defineField({
      name: "bannerFrom",
      title: "Announcement bar: first day",
      type: "date",
      group: "basics",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bannerUntil",
      title: "Announcement bar: last day",
      type: "date",
      group: "basics",
      validation: (r) =>
        r.required().custom((until, ctx) => {
          const from = (ctx.parent as { bannerFrom?: string })?.bannerFrom;
          return !until || !from || until >= from ? true : "Must be on or after the first day.";
        }),
    }),
    defineField({ name: "bannerText", title: "Announcement bar text", type: "string", group: "basics", validation: (r) => r.required().max(110) }),
    defineField({
      name: "bannerShort",
      title: "Announcement bar text (phones)",
      description: "Must fit one line on a phone — about 30 characters.",
      type: "string",
      group: "basics",
      validation: (r) => r.required().max(34),
    }),
    defineField({
      name: "delivery",
      title: "Offer delivery",
      description: "Off → the page says pickup only. To stop featured dishes being delivered, also tick “Pickup only” on those menu items.",
      type: "boolean",
      group: "basics",
      initialValue: false,
    }),
    defineField({
      name: "orderOnline",
      title: "Customers pay online",
      description:
        "On → guests add featured dishes to the cart and pay (Square); paid orders go to the CRM automatically. Off → the page shows a pre-order request form instead and staff confirm by phone.",
      type: "boolean",
      group: "basics",
      initialValue: false,
    }),
    defineField({ name: "eventDate", title: "Event / holiday date", type: "date", group: "basics" }),
    defineField({ name: "orderBy", title: "Last day to pre-order", description: "Hidden on the page until set.", type: "date", group: "basics" }),
    defineField({
      name: "pickupFrom",
      title: "First pickup day",
      description: "Pre-order form only lets guests pick a day in this range. Leave both empty to allow any day up to the event.",
      type: "date",
      group: "basics",
    }),
    defineField({
      name: "pickupUntil",
      title: "Last pickup day",
      type: "date",
      group: "basics",
      validation: (r) =>
        r.custom((until, ctx) => {
          const from = (ctx.parent as { pickupFrom?: string })?.pickupFrom;
          return !until || !from || until >= from ? true : "Must be on or after the first pickup day.";
        }),
    }),
    defineField({
      name: "pickupWindows",
      title: "Pickup windows",
      description: "e.g. “Wed, Nov 25 · 12–8 PM”. Hidden on the page until set.",
      type: "array",
      group: "basics",
      of: [defineArrayMember({ type: "string" })],
    }),

    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "page",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (r) => r.required() }),
        defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "accent", title: "Title accent (gold)", type: "string", validation: (r) => r.required() }),
        defineField({ name: "lede", title: "Intro", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({
          name: "image",
          title: "Photo",
          description: "Also used for the share card. JPEG or PNG.",
          type: "image",
          options: { hotspot: true },
          validation: (r) => r.required(),
        }),
        defineField({ name: "imageAlt", title: "Photo description (for screen readers)", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "reasons",
      title: "Reason cards",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          name: "reason",
          fields: [
            defineField({ name: "icon", title: "Icon", type: "string", options: { list: ICONS }, initialValue: "flame", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Closing call to action",
      type: "object",
      group: "page",
      fields: [
        defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
        defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          name: "campaignFaq",
          fields: [
            defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "a", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "q", subtitle: "a" } },
        }),
      ],
    }),

    menuItemRefs("featured", "Featured dishes", "Main dishes shown as cards. Prices come from the menu."),
    menuItemRefs("sides", "Sides", "Shown in the “On the side” list."),
    defineField({ name: "showPlatters", title: "Show Ndokoti platters", type: "boolean", group: "menu", initialValue: true }),

    defineField({
      name: "seo",
      title: "Search result",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required().max(90) }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
      ],
    }),
    defineField({
      name: "og",
      title: "Share card headline",
      description: "Two short lines on the image shown when the page is shared.",
      type: "object",
      group: "seo",
      options: { columns: 2 },
      fields: [
        defineField({ name: "line1", title: "Line 1", type: "string", validation: (r) => r.required().max(22) }),
        defineField({ name: "line2", title: "Line 2 (gold)", type: "string", validation: (r) => r.required().max(22) }),
      ],
    }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "bannerFrom", direction: "desc" }] }],
  preview: {
    select: { title: "name", from: "bannerFrom", until: "bannerUntil", slug: "slug.current", media: "hero.image" },
    prepare: ({ title, from, until, slug, media }) => ({ title, subtitle: `/${slug ?? "…"}/ · ${from ?? "?"} → ${until ?? "?"}`, media }),
  },
});
