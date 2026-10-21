import type { MetadataRoute } from "next";
import { CAMPAIGNS } from "@/lib/campaigns";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
    ...CAMPAIGNS.map((c) => ({
      url: absoluteUrl(`/${c.slug}/`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/privacy/"), lastModified, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
