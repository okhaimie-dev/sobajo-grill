import { defineArrayMember, defineField, defineType } from "sanity";

export const menuSection = defineType({
  name: "menuSection",
  title: "Menu section",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tab",
      title: "Tab label",
      description: "Short name for the category tabs on /menu/, e.g. “Drinks”.",
      type: "string",
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: "anchor",
      title: "Page anchor",
      description: "Used in links like /menu/#drinks. Lowercase, no spaces. Changing it breaks existing links.",
      type: "slug",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Feature — one wide hero card", value: "feature" },
          { title: "Cards — photo grid", value: "cards" },
          { title: "Tiers — Ndokoti platter ladder", value: "tiers" },
          { title: "List — compact rows (sides, drinks)", value: "list" },
        ],
      },
      initialValue: "cards",
      validation: (r) => r.required(),
    }),
    defineField({ name: "note", title: "Intro note", type: "text", rows: 3 }),
    defineField({
      name: "sortOrder",
      title: "Position on the menu",
      description: "Lower numbers show first.",
      type: "number",
      initialValue: 100,
      validation: (r) => r.required().integer(),
    }),
  ],
  orderings: [{ title: "Menu order", name: "menuOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "tab" } },
});

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu item",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      description: "Sold out and Coming soon items stay on the menu with that label, but can't be ordered.",
      type: "string",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Available", value: "available" },
          { title: "Sold out", value: "soldOut" },
          { title: "Coming soon", value: "comingSoon" },
        ],
      },
      initialValue: "available",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      description: "Must be unique. Changing it removes this item from carts customers already have open.",
      type: "string",
      validation: (r) =>
        r.required().custom(async (name, ctx) => {
          if (!name) return true;
          const id = ctx.document?._id.replace(/^drafts\./, "");
          const taken = await ctx
            .getClient({ apiVersion: "2026-11-01" })
            .fetch<number>(
              `count(*[_type == "menuItem" && name == $name && !(_id in [$id, "drafts." + $id])])`,
              { name, id }
            );
          return taken ? "Another menu item already uses this name." : true;
        }),
    }),
    defineField({
      name: "section",
      title: "Menu section",
      type: "reference",
      to: [{ type: "menuSection" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "image",
      title: "Photo",
      description: "Landscape works best. Drag the circle to choose what stays in frame when cropped.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "badge",
      title: "Badge",
      description: "Short highlight chip on the card, e.g. “Back by demand”. Optional.",
      type: "string",
      validation: (r) => r.max(28),
    }),
    defineField({
      name: "variations",
      title: "Sizes & prices",
      description: "At least one. Use a single “Standard” size for items with one price.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "variation",
          fields: [
            defineField({ name: "label", title: "Size", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "price",
              title: "Price ($)",
              type: "number",
              validation: (r) => r.required().min(0).max(5000).precision(2),
            }),
          ],
          preview: {
            select: { title: "label", price: "price" },
            prepare: ({ title, price }) => ({ title, subtitle: price != null ? `$${price}` : "No price" }),
          },
        }),
      ],
      validation: (r) =>
        r
          .required()
          .min(1)
          .custom((rows?: { label?: string }[]) => {
            const labels = (rows ?? []).map((v) => v.label);
            return new Set(labels).size === labels.length ? true : "Each size needs a different name.";
          }),
    }),
    defineField({
      name: "sideMode",
      title: "Sides",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "No side choice", value: "none" },
          { title: "Customer may add a side (charged extra)", value: "optional" },
          { title: "One side included", value: "included" },
        ],
      },
      initialValue: "none",
    }),
    defineField({
      name: "offeredAsSide",
      title: "Offer as a side choice",
      description: "For sides: list this as a side customers can pick on other dishes, at this item's price.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "campaignOnly",
      title: "Only on campaign pages",
      description: "Hide from the menu, home and catering pages — sell it only where a campaign features it (e.g. the Thanksgiving turkey).",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "pickupOnly",
      title: "Pickup only",
      description: "Can't be delivered. A cart with this item switches to pickup, and checkout refuses delivery.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "orderLimit",
      title: "Order limit",
      description:
        "Stop taking orders once this many are paid (e.g. 100 turkeys). Guests never see the number — only “Selling fast” (60%), “Almost gone” (90%), then Sold out + a waitlist. Raise it to reopen sales. Leave empty for no limit.",
      type: "number",
      validation: (r) => r.integer().min(1),
    }),
    defineField({
      name: "includes",
      title: "What this tier adds",
      description: "Ndokoti platters only: what this level adds on top of the one before.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "sortOrder",
      title: "Position in section",
      description: "Lower numbers show first.",
      type: "number",
      initialValue: 100,
      validation: (r) => r.integer(),
    }),
  ],
  orderings: [{ title: "Menu order", name: "menuOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: {
    select: { title: "name", section: "section.tab", status: "status", media: "image", price: "variations.0.price" },
    prepare: ({ title, section, status, media, price }) => ({
      title: status === "soldOut" ? `${title} — SOLD OUT` : status === "comingSoon" ? `${title} — COMING SOON` : title,
      subtitle: [section, price != null ? `from $${price}` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
