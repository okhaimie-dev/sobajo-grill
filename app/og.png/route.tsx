import { renderOg } from "@/lib/og";
import { getSite } from "@/lib/content";

// Social share card (links, ads, group chats), prerendered and refreshed with
// the content (address from Sanity). A route named og.png — rather than the
// opengraph-image convention — so the file keeps a .png extension.
export const revalidate = 3600;

export async function GET() {
  const site = await getSite();
  return renderOg({
    eyebrow: "Baltimore Suya",
    line1: "Fire. Flavor.",
    line2: "Friendship.",
    footer: `Pickup · Delivery · Catering — ${site.address.street}, ${site.address.city}`,
  });
}
