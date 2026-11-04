/**
 * Sanity project settings (public — safe in the browser). Shared by the
 * embedded Studio (/studio), the site's data loaders and the import script.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-01";

/** Off → the site falls back to the content in lib/*.ts (local dev without keys). */
export const sanityConfigured = projectId !== "";
