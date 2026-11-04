import { defineArrayMember, defineField, defineType } from "sanity";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Singleton (document id "siteSettings"): contact info, hours, links, SEO defaults. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Business info",
  type: "document",
  groups: [
    { name: "contact", title: "Contact & hours", default: true },
    { name: "delivery", title: "Delivery" },
    { name: "links", title: "Links & rating" },
    { name: "seo", title: "Search (SEO)" },
  ],
  fields: [
    defineField({
      name: "phone",
      title: "Phone",
      description: "As customers should see it, e.g. (443) 772-6661.",
      type: "string",
      group: "contact",
      validation: (r) =>
        r.required().custom((v) => (!v || v.replace(/\D/g, "").length === 10 ? true : "Enter a 10-digit US number.")),
    }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact", validation: (r) => r.required().email() }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      options: { columns: 2 },
      fields: [
        defineField({ name: "street", title: "Street", type: "string", validation: (r) => r.required() }),
        defineField({ name: "city", title: "City", type: "string", validation: (r) => r.required() }),
        defineField({ name: "region", title: "State", type: "string", validation: (r) => r.required().length(2) }),
        defineField({ name: "postalCode", title: "ZIP", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "hours",
      title: "Opening hours",
      description:
        "Shown in “Visit us” and sent to Google. Leave empty if unsure — the site then asks guests to call. 24-hour times, e.g. 12:00 and 20:00.",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "hoursRow",
          fields: [
            defineField({
              name: "days",
              title: "Days",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { list: DAYS, layout: "grid" },
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: "opens",
              title: "Opens (HH:MM)",
              type: "string",
              validation: (r) => r.required().regex(TIME, { name: "24-hour time" }),
            }),
            defineField({
              name: "closes",
              title: "Closes (HH:MM)",
              type: "string",
              validation: (r) => r.required().regex(TIME, { name: "24-hour time" }),
            }),
          ],
          preview: {
            select: { days: "days", opens: "opens", closes: "closes" },
            prepare: ({ days, opens, closes }) => ({
              title: (days ?? []).join(", ") || "No days",
              subtitle: `${opens ?? "?"} – ${closes ?? "?"}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "googleRating",
      title: "Google rating",
      description: "Shown in the hero and reviews. Update now and then from Google Maps.",
      type: "number",
      group: "links",
      validation: (r) => r.required().min(1).max(5).precision(1),
    }),
    defineField({
      name: "googleReviewUrl",
      title: "“Leave a review” link",
      description: "Google Business Profile → Ask for reviews (looks like https://g.page/r/…/review).",
      type: "url",
      group: "links",
    }),
    defineField({
      name: "deliveryMinimum",
      title: "Delivery minimum ($)",
      description: "Food total needed before delivery can be chosen (the fee doesn't count toward it).",
      type: "number",
      group: "delivery",
      validation: (r) => r.required().min(0).precision(2),
    }),
    defineField({
      name: "deliveryFee",
      title: "Delivery fee ($)",
      description: "Flat fee added to every delivery order. 0 = free delivery.",
      type: "number",
      group: "delivery",
      validation: (r) => r.required().min(0).max(200).precision(2),
    }),
    defineField({
      name: "deliveryArea",
      title: "Delivery area",
      description: "Shown in the cart and FAQs, e.g. “Baltimore City & Baltimore County, MD”.",
      type: "string",
      group: "delivery",
      validation: (r) => r.required().max(80),
    }),
    defineField({ name: "cashAppUrl", title: "Cash App link", type: "url", group: "links" }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "object",
      group: "links",
      options: { columns: 2 },
      fields: [
        defineField({ name: "handle", title: "Handle", type: "string" }),
        defineField({ name: "url", title: "Profile URL", type: "url" }),
      ],
    }),
    defineField({
      name: "tiktok",
      title: "TikTok",
      type: "object",
      group: "links",
      options: { columns: 2 },
      fields: [
        defineField({ name: "handle", title: "Handle", type: "string" }),
        defineField({ name: "url", title: "Profile URL", type: "url" }),
      ],
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "seo", validation: (r) => r.required() }),
    defineField({
      name: "seoTitle",
      title: "Home page title",
      description: "Shown in Google results and browser tabs. Aim for under 70 characters.",
      type: "string",
      group: "seo",
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "seoDescription",
      title: "Home page description",
      description: "The snippet under the title in Google. Aim for 140–160 characters.",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      group: "seo",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
  ],
  preview: { prepare: () => ({ title: "Business info" }) },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "page",
      title: "Shown on",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Home page", value: "home" },
          { title: "Catering page", value: "catering" },
        ],
      },
      initialValue: "home",
      validation: (r) => r.required(),
    }),
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({
      name: "sortOrder",
      title: "Position",
      description: "Lower numbers show first.",
      type: "number",
      initialValue: 100,
      validation: (r) => r.integer(),
    }),
  ],
  orderings: [{ title: "Position", name: "position", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "page" } },
});
