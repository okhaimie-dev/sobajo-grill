import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";

export const metadata: Metadata = {
  title: "Sobajo Grill — Branded Full Menu & Ordering Demo",
  description:
    "Sobajo Grill is a Baltimore barbecue and suya brand blending bold African flavors with American barbecue for catering, shipping, and takeout. Sobajo means friend.",
  // favicon: app/icon.png file convention (base-path aware)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
