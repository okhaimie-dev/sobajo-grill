import { campaign } from "./campaign";
import { menuItem, menuSection } from "./menu";
import { faq, siteSettings } from "./site";

export const schemaTypes = [siteSettings, menuSection, menuItem, campaign, faq];

/** Singleton document types: one fixed document each, no create/delete. */
export const SINGLETONS = new Set(["siteSettings"]);
