import { CAMPAIGNS, getCampaign } from "@/lib/campaigns";
import { renderOg } from "@/lib/og";
import { SITE } from "@/lib/site";

// Per-campaign share card for ads and shared links, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ campaign: c.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ campaign: string }> }) {
  const campaign = getCampaign((await params).campaign)!;
  return renderOg({
    eyebrow: `${campaign.name} at ${SITE.name}`,
    line1: campaign.og.line1,
    line2: campaign.og.line2,
    footer: `Pre-order for pickup or DoorDash delivery — ${SITE.address.street}, ${SITE.address.city}`,
    image: campaign.hero.image.replace(/^\//, ""),
  });
}
