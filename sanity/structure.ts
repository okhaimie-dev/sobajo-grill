import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";

const byOrder = [{ field: "sortOrder", direction: "asc" as const }];

/** Studio sidebar, laid out for day-to-day restaurant edits. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Sobajo Grill")
    .items([
      S.listItem()
        .title("Business info")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Business info")),
      S.divider(),
      S.listItem()
        .title("Menu by section")
        .child(
          S.documentTypeList("menuSection")
            .title("Sections")
            .defaultOrdering(byOrder)
            .child((sectionId) =>
              S.documentList()
                .title("Items")
                .schemaType("menuItem")
                .apiVersion(apiVersion)
                .filter('_type == "menuItem" && section._ref == $sectionId')
                .params({ sectionId })
                .defaultOrdering(byOrder)
                .initialValueTemplates([S.initialValueTemplateItem("menuItem-in-section", { sectionId })])
            )
        ),
      S.listItem()
        .title("Sold out & coming soon")
        .child(
          S.documentList()
            .title("Not orderable right now")
            .schemaType("menuItem")
            .apiVersion(apiVersion)
            .filter('_type == "menuItem" && status in ["soldOut", "comingSoon"]')
            .defaultOrdering(byOrder)
        ),
      S.documentTypeListItem("menuItem").title("All menu items"),
      S.documentTypeListItem("menuSection").title("Menu sections"),
      S.divider(),
      S.documentTypeListItem("campaign").title("Campaigns"),
      S.documentTypeListItem("faq").title("FAQs"),
      S.documentTypeListItem("shippingProduct").title("Shipping products"),
    ]);
