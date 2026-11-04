"use client";

import { createContext, useContext } from "react";
import type { Site } from "@/lib/site";

const SiteContext = createContext<Site | null>(null);

/** Business info (from Sanity) for client components; the site layout provides it. */
export function SiteProvider({ site, children }: { site: Site; children: React.ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite(): Site {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used within <SiteProvider>");
  return site;
}
