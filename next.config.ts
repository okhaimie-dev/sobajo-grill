import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * The site is served from a sub-path:
 *   https://okhaimie-dev.github.io/sobajo-grill/
 * The Pages workflow sets NEXT_PUBLIC_BASE_PATH=/sobajo-grill; leave it
 * unset for local development or any host serving from the domain root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Fully static site (no server features in use) → out/ folder.
  // Note: cacheComponents/PPR is not compatible with `output: "export"` —
  // this page is a static prerender + client hydration anyway.
  output: "export",
  basePath,
};

export default nextConfig;
