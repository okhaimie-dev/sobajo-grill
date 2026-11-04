import Link from "next/link";
import { getActiveCampaign } from "@/lib/content";
import { Icon } from "./icons";

/**
 * Site-wide strip linking to the campaign whose banner window includes today
 * (Sanity → Campaigns). Rendered on the server; the site layout revalidates
 * hourly, so it switches on/off by date without a redeploy.
 */
export default async function AnnouncementBar() {
  const c = await getActiveCampaign();
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
