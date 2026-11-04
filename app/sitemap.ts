import type { MetadataRoute } from "next";
import { getCampaigns } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

// Refreshed with the content, so new campaigns appear without a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const campaigns = await getCampaigns();
  const lastModified = new Date();
  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl("/hero.jpg"), absoluteUrl("/story.jpg")],
    },
    { url: absoluteUrl("/menu/"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    {
      url: absoluteUrl("/catering/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [absoluteUrl("/catering.jpg")],
    },
    ...campaigns.map((c) => ({
      url: absoluteUrl(`/${c.slug}/`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/privacy/"), lastModified, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
