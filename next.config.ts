import type { NextConfig } from "next";

/**
 * Deployed on Vercel (server runtime for /api routes). Pages stay statically
 * prerendered. NEXT_PUBLIC_BASE_PATH is still honored for sub-path hosts.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath,
  // Keep the /menu/ /catering/ URLs already indexed and shared.
  trailingSlash: true,
};

export default nextConfig;
