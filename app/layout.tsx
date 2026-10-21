import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";
import { CartProvider } from "@/components/cart-context";
import CartFab from "@/components/cart-fab";
import CartModal from "@/components/cart-modal";
import Footer from "@/components/footer";
import ItemModal from "@/components/item-modal";
import JsonLd from "@/components/json-ld";
import Nav from "@/components/nav";
import { SITE, SITE_URL } from "@/lib/site";
import { restaurantJsonLd } from "@/lib/structured-data";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

/** Site-wide defaults; each page sets title/description/canonical/OG via `pageMetadata`. */
export const metadata: Metadata = {
  // Trailing slash so relative metadata URLs keep the GitHub Pages sub-path.
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  category: "restaurant",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: true, address: true, email: true },
  // favicon + apple icon come from the app/ file conventions (base-path aware)
};

export const viewport: Viewport = {
  themeColor: "#0a0706",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd data={restaurantJsonLd()} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <CartFab />
          <ItemModal />
          <CartModal />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
