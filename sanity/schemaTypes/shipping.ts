import { defineField, defineType } from "sanity";

/** Icons from components/icons.tsx that suit a product card. */
const ICONS = ["pepper", "bottle", "package", "gift", "flame", "bag", "heart", "star", "truck", "globe"];

export const shippingProduct = defineType({
  name: "shippingProduct",
  title: "Shipping product",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      description: "The label on the card. Online shipping orders aren't built yet — “Available now” only changes the label.",
      type: "string",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Coming soon", value: "comingSoon" },
          { title: "Available now", value: "available" },
        ],
      },
      initialValue: "comingSoon",
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required().max(40) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2, validation: (r) => r.required().max(140) }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: ICONS },
      initialValue: "package",
      validation: (r) => r.required(),
    }),
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
  preview: {
    select: { title: "name", status: "status" },
    prepare: ({ title, status }) => ({ title, subtitle: status === "available" ? "Available now" : "Coming soon" }),
  },
});
