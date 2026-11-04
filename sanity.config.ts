"use client";

/**
 * Sanity Studio, embedded at /studio (app/studio/[[...tool]]/page.tsx).
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { BASE_PATH } from "./lib/assets";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { SINGLETONS, schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "sobajo-grill",
  title: "Sobajo Grill",
  basePath: `${BASE_PATH}/studio`,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      // Hide the generic "new Business info" option — it's a singleton.
      ...prev.filter((t) => !SINGLETONS.has(t.schemaType)),
      {
        id: "menuItem-in-section",
        title: "Menu item in section",
        schemaType: "menuItem",
        parameters: [{ name: "sectionId", type: "string" }],
        value: ({ sectionId }: { sectionId: string }) => ({
          status: "available",
          sideMode: "none",
          sortOrder: 100,
          section: { _type: "reference", _ref: sectionId },
        }),
      },
    ],
  },
  document: {
    // Singletons can only be edited and published — not duplicated or deleted.
    actions: (prev, { schemaType }) =>
      SINGLETONS.has(schemaType) ? prev.filter((a) => ["publish", "discardChanges", "restore"].includes(a.action ?? "")) : prev,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
