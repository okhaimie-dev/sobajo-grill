import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Read-only client for published content. The CDN is skipped: Next caches
 * the response (tagged, see lib/content.ts) and the publish webhook clears
 * it, so every cache miss should see the latest publish.
 */
export const sanity = createClient({ projectId: projectId || "unset", dataset, apiVersion, useCdn: false, perspective: "published" });

const builder = createImageUrlBuilder({ projectId: projectId || "unset", dataset });

/**
 * CDN URL that still takes `&w=` (see imageSrcSet in lib/menu.ts): applies
 * the editor's crop, serves WebP/AVIF where supported.
 */
export function imageBase(source: SanityImageSource): string {
  return builder.image(source).auto("format").quality(75).url();
}
