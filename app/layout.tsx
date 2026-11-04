import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { getSite } from "@/lib/content";
import { SITE, SITE_URL } from "@/lib/site";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

/**
 * Root shell shared by the public site (app/(site)/layout.tsx: nav, cart,
 * footer) and the Sanity Studio (/studio), which needs a bare full screen.
 *
 * Site-wide metadata defaults; each page sets title/description/canonical/OG
 * via `pageMetadata`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    // Trailing slash so relative metadata URLs keep the GitHub Pages sub-path.
    metadataBase: new URL(SITE_URL + "/"),
    title: { default: site.title, template: `%s | ${SITE.name}` },
    description: site.description,
    keywords: site.keywords,
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
}

export const viewport: Viewport = {
  themeColor: "#0a0706",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions add attributes to <html>
    // before React loads (applies to this element's attributes only).
    <html lang="en-US" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
