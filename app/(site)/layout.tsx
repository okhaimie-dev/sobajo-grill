import "../globals.css";
import AnnouncementBar from "@/components/announcement-bar";
import Analytics from "@/components/analytics";
import { CartProvider } from "@/components/cart-context";
import CartFab from "@/components/cart-fab";
import CartModal from "@/components/cart-modal";
import Footer from "@/components/footer";
import ItemModal from "@/components/item-modal";
import JsonLd from "@/components/json-ld";
import Nav from "@/components/nav";
import { SiteProvider } from "@/components/site-context";
import { getSite } from "@/lib/content";
import { restaurantJsonLd } from "@/lib/structured-data";

// Re-render at least hourly so date-based content (campaign announcement bar)
// switches on and off without a redeploy. Publishing in the Studio refreshes
// content immediately via /api/revalidate.
export const revalidate = 3600;

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getSite();
  return (
    <SiteProvider site={site}>
      <JsonLd data={restaurantJsonLd(site)} />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CartProvider>
        <AnnouncementBar />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CartFab />
        <ItemModal />
        <CartModal />
      </CartProvider>
      <Analytics />
    </SiteProvider>
  );
}
