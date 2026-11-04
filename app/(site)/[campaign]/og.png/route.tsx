import { getCampaign, getCampaigns, getSite } from "@/lib/content";
import { renderOg } from "@/lib/og";

// Per-campaign share card for ads and shared links. Prerendered for known
// campaigns, refreshed with the rest of the content (tag "sanity", hourly).
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCampaigns()).map((c) => ({ campaign: c.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ campaign: string }> }) {
  const [campaign, site] = await Promise.all([getCampaign((await params).campaign), getSite()]);
  if (!campaign) return new Response("Not found", { status: 404 });
  const img = campaign.hero.image;
  return renderOg({
    eyebrow: `${campaign.name} at ${site.name}`,
    line1: campaign.og.line1,
    line2: campaign.og.line2,
    footer: `Pre-order for ${campaign.delivery ? "pickup or DoorDash delivery" : "pickup"} — ${site.address.street}, ${site.address.city}`,
    // Sanity: ask the CDN for a JPEG at card size (Satori can't read WebP/AVIF).
    image: img.startsWith("http") ? `${img.replace("auto=format&", "")}&w=1200&h=630&fit=crop&fm=jpg` : img.replace(/^\//, ""),
  });
}
