import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/assets";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Sobajo",
    description: SITE.description,
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#0a0706",
    theme_color: "#0a0706",
    icons: [{ src: `${BASE_PATH}/icon.png`, sizes: "512x512", type: "image/png" }],
  };
}
