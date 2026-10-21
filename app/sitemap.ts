import type { MetadataRoute } from "next";
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
  ];
}
