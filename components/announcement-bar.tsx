import Link from "next/link";
import { activeCampaign } from "@/lib/campaigns";
import { Icon } from "./icons";

/**
 * Site-wide strip linking to the campaign whose banner window includes today
 * (lib/campaigns.ts). Rendered on the server; the root layout revalidates
 * hourly, so it switches on/off by date without a redeploy.
 */
export default function AnnouncementBar() {
  const c = activeCampaign();
  if (!c) return null;
  return (
    <Link href={`/${c.slug}/`} className="announce">
      <Icon name="flame" />
      <span className="announce-long">{c.bannerText}</span>
      <span className="announce-short">{c.bannerShort}</span>
      <span className="announce-cta">
        Pre-order <Icon name="arrow" />
      </span>
    </Link>
  );
}
