import { campaign } from "./campaign";
import { menuItem, menuSection } from "./menu";
import { shippingProduct } from "./shipping";
import { faq, siteSettings } from "./site";

export const schemaTypes = [siteSettings, menuSection, menuItem, campaign, faq, shippingProduct];

/** Singleton document types: one fixed document each, no create/delete. */
export const SINGLETONS = new Set(["siteSettings"]);
