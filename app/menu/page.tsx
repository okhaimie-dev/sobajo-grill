import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { menuJsonLd } from "@/lib/structured-data";
import Cta from "@/components/cta";
import { Icon } from "@/components/icons";
import JsonLd from "@/components/json-ld";
import MenuSections from "@/components/menu-sections";
import PageHero from "@/components/page-hero";

export const metadata = pageMetadata({
  title: "Menu — Beef Suya, Fire-Grilled Chicken, Jollof & More",
  description:
    "The full Sobajo Grill menu: beef brisket suya, Obasanjo Fire Chicken, BBQ chicken, fire wings, smoked turkey wings, grilled fish, Ndokoti platters, catering trays, jollof, plantains, zobo and more. Order for pickup or delivery in Baltimore.",
  path: "/menu/",
});

export default function MenuPage() {
  return (
    <>
      <JsonLd data={menuJsonLd()} />
      <PageHero
        crumb="Menu"
        path="/menu/"
        eyebrow={
          <>
            <Icon name="flame" /> Full Menu
          </>
        }
        title={
          <>
            The Sobajo <span className="accent">menu.</span>
          </>
        }
        lede="Tap any dish to choose size and sides, then pick pickup or delivery at checkout."
      >
        <div className="hero-meta">
          <span>
            <Icon name="store" /> Pickup in Baltimore
          </span>
          <span>
            <Icon name="truck" /> Delivery via DoorDash · no minimum
          </span>
          <Link href="/catering/">
            <Icon name="users" /> Catering trays
          </Link>
        </div>
      </PageHero>
      <MenuSections />
      <Cta />
    </>
  );
}
