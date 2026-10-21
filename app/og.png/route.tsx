import { renderOg } from "@/lib/og";
import { SITE } from "@/lib/site";

// Social share card (links, ads, group chats), rendered once at build time.
// A route named og.png — rather than the opengraph-image convention — so the
// file keeps a .png extension and static hosts send image/png.
export const dynamic = "force-static";

export function GET() {
  return renderOg({
    eyebrow: "Baltimore Suya & African Grill",
    line1: "Fire. Flavor.",
    line2: "Friendship.",
    footer: `Pickup · Delivery · Catering — ${SITE.address.street}, ${SITE.address.city}`,
  });
}
