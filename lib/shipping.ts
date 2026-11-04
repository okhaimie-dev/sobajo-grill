/**
 * Nationwide shipping products ("Send Sobajo nationwide" on the home page),
 * edited in Sanity → Shipping products and loaded by lib/content.ts.
 * `SHIPPING_PRODUCTS` is the import seed and the fallback without Sanity.
 */

import type { IconName } from "@/components/icons";

export type ShippingStatus = "comingSoon" | "available";

export interface ShippingProduct {
  name: string;
  text: string;
  icon: IconName;
  status: ShippingStatus;
}

export const SHIPPING_STATUS_LABEL: Record<ShippingStatus, string> = {
  comingSoon: "Coming soon",
  available: "Available now",
};

export const SHIPPING_PRODUCTS: ShippingProduct[] = [
  { name: "Sobajo Suya Spice", text: "Authentic Sobajo seasoning for grilling and cooking at home.", icon: "pepper", status: "comingSoon" },
  { name: "Sobajo Hot Sauce", text: "Our bold house heat, bottled for customers nationwide.", icon: "bottle", status: "comingSoon" },
  { name: "Beef Brisket Suya Packs", text: "Vacuum-sealed packs prepared for safe nationwide delivery.", icon: "package", status: "comingSoon" },
  { name: "Sobajo Gift Packages", text: "Curated boxes for birthdays, holidays and family surprises.", icon: "gift", status: "comingSoon" },
];
