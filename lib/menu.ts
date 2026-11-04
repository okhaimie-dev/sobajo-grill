/**
 * Menu types + helpers. The live menu is edited in Sanity (/studio) and loaded
 * by lib/content.ts; the `items` / `SECTION_DEFS` below are the seed for the
 * import script (scripts/sanity-import.ts) and the fallback when Sanity isn't
 * configured (local dev without keys).
 */

export interface MenuItem {
  name: string;
  description: string;
  /**
   * Image base URL that accepts `&w=` (Sanity CDN or Unsplash, see `U`) or a
   * root-relative /public path; omitted for list-style sections.
   */
  image?: string;
  /** CSS object-position from the Sanity hotspot, e.g. "50% 30%". */
  imagePosition?: string;
  /** Anchor id of the section the item is in (MenuSection.id). */
  section: string;
  /** Short highlight chip shown on the card. */
  badge?: string;
  /** Ndokoti tiers: what this level adds on top of the previous one. */
  includes?: string[];
  variations: [string, number][];
  /** "optional" → side sold as extra; "included" → one side comes with the item. */
  sideMode?: "optional" | "included";
  /** Sides only: offered as a side choice on dishes with a sideMode. */
  offeredAsSide?: boolean;
  /** Sold only through campaign pages (e.g. the Thanksgiving turkey): hidden from /menu/, home and catering. */
  campaignOnly?: boolean;
  /** Can't be delivered: the cart switches to pickup and checkout refuses delivery. */
  pickupOnly?: boolean;
  /**
   * Only these pickup days (YYYY-MM-DD). Set by lib/content.ts for a
   * campaign-only item from its campaign's first/last pickup day.
   */
  pickupDates?: string[];
  /** Stop selling once this many are paid (Square count, see lib/stock.ts). */
  orderLimit?: number;
  /** Count paid orders created since (ISO); set from the item's campaign. */
  countSince?: string;
  /** Side choices for this item (name, extra price), filled in by `withSides`. */
  sides?: [string, number][];
  /** Sold out / coming soon: listed with that label, not orderable. Default available. */
  status?: ItemStatus;
  /** false when status isn't "available" (kept for checkout + JSON-LD). */
  available?: boolean;
}

export type ItemStatus = "available" | "soldOut" | "comingSoon";

/** Label for an item that can't be ordered right now, else null. */
export function unavailableLabel(item: MenuItem): string | null {
  if (item.status === "comingSoon") return "Coming soon";
  if (item.status === "soldOut" || item.available === false) return "Sold out";
  return null;
}

export interface CartLine {
  /** unique line id */
  id: number;
  name: string;
  variation: string;
  /** variation price + side extra */
  unitPrice: number;
  quantity: number;
  /** unitPrice * quantity */
  price: number;
  side: string;
  notes: string;
  /** Copied from the item so the cart can force pickup (and pickup days). */
  pickupOnly?: boolean;
  pickupDates?: string[];
}

/**
 * Pickup days allowed for an order (YYYY-MM-DD, today or later in Baltimore):
 * the days every restricted line shares. null when no line restricts them; an
 * empty list when they don't overlap or have all passed.
 */
export function allowedPickupDays(lists: (string[] | undefined)[], today: string): string[] | null {
  const restricted = lists.filter((l): l is string[] => Boolean(l?.length));
  if (!restricted.length) return null;
  return restricted.reduce((acc, l) => acc.filter((d) => l.includes(d))).filter((d) => d >= today);
}

// Delivery is in-house: minimum, flat fee and area live in Sanity → Business
// info → Delivery (Site.delivery); the cart and /api/checkout apply them.

export function money(v: number): string {
  return "$" + v.toFixed(2);
}

/** "$15" for whole dollars, "$15.50" otherwise — for menu prices. */
export function price(v: number): string {
  return Number.isInteger(v) ? `$${v}` : money(v);
}

export function fromPrice(item: MenuItem): number {
  return Math.min(...item.variations.map((v) => v[1]));
}

export function sideOptions(item: MenuItem): [string, number][] {
  return item.sides ?? [];
}

/**
 * Attach side choices to every item with a sideMode: each available item
 * marked `offeredAsSide`, at its price when optional ("No Side" first) or
 * free when one side is included.
 */
export function withSides(items: MenuItem[]): MenuItem[] {
  const pool = items
    .filter((i) => i.offeredAsSide && i.available !== false && i.variations.length)
    .map((i): [string, number] => [i.name, fromPrice(i)]);
  return items.map((item) => {
    if (!item.sideMode) return item;
    const sides: [string, number][] =
      item.sideMode === "included" ? pool.map(([n]) => [n, 0]) : [["No Side", 0], ...pool];
    return { ...item, sides };
  });
}

/** Unsplash base URL; components append `&w=` per srcset width. */
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75`;

export function imageSrcSet(base: string, widths = [480, 800, 1200]): string {
  return widths.map((w) => `${base}&w=${w} ${w}w`).join(", ");
}

export const items: MenuItem[] = [
  { section: "bowls", name: "Beef Brisket Suya", badge: "The Sobajo signature", description: "The Sobajo signature—where West African suya meets American barbecue. Beef brisket seasoned with our suya-inspired spice blend and served the Sobajo way with onions, hot sauce, and suya powder.", image: "/hero.jpg", variations: [["Small", 15], ["Medium", 20], ["Large", 30], ["Extra Large", 50], ["Half Shallow", 100], ["Half Deep", 150], ["Full Tray", 350]], available: true },
  { section: "grill", name: "Obasanjo Fire Chicken", badge: "Signature", description: "A tribute to our Nigerian community and the customers who helped shape the Sobajo journey—farm-raised chicken, fire-grilled with bold spice, heat, onions, and unmistakable Sobajo character.", image: U("photo-1532550907401-a500c9a57435"), variations: [["Full Chicken", 25]], available: true },
  { section: "grill", name: "BBQ Chicken", description: "Sobajo BBQ Chicken celebrates the barbecue side of our story—fire, smoke, char, and the joy of sharing grilled chicken around the table. It brings familiar American barbecue comfort together with Sobajo’s bold African personality, creating a simple, smoky meal made for family, friends, and gatherings.", image: U("photo-1598103442097-8b74394b95c6"), variations: [["Half Chicken", 12], ["Full Chicken", 20]], available: true },
  { section: "grill", name: "Sobajo Smoked Turkey Wings", badge: "Back by demand", description: "Back by popular demand. Our customers asked for them, so Sobajo Smoked Turkey Wings return with rich smoke, bold seasoning, and hearty fire-grilled character.", image: U("photo-1518492104633-130d0cc84637"), variations: [["2 Full Wings", 15]], available: true },
  { section: "grill", name: "Sobajo Smoked Whole Turkey", campaignOnly: true, pickupOnly: true, orderLimit: 100, description: "A whole turkey, smoked and fire-finished the Sobajo way — the centerpiece for your Thanksgiving table. Pre-order for pickup.", image: U("photo-1518492104633-130d0cc84637"), variations: [["Whole Turkey", 100]], available: true },
  { section: "grill", name: "Sobajo Fire Wings", description: "Our tribute to Baltimore and America’s love of great wings—bringing Sobajo’s bold African flavors together with a familiar American favorite. Made for game nights, celebrations, family, and friends. Sides are optional and sold separately.", image: U("photo-1562967914-608f82629710"), variations: [["4 Full Wings", 12], ["8 Full Wings", 24], ["20 Full Wings", 50]], sideMode: "optional", available: true },
  { section: "grill", name: "Fire-Grilled Fish", badge: "Side included", description: "Fire-Grilled Fish reflects the place grilled fish holds in African food culture and communal dining. Tilapia or Pompano is cooked over fire, served with onions, Sobajo hot sauce, and one included side—an experience built around spice, smoke, sharing, and the table. No suya spice.", image: U("photo-1519708227418-c8fd9a32b7a2"), variations: [["Whole Tilapia", 25], ["Whole Pompano", 25]], sideMode: "included", available: true },
  { section: "ndokoti", name: "Ndokoti Classic", description: "Signature Beef Brisket Suya with jollof rice, fried plantains, fresh onions, and Sobajo hot sauce.", includes: ["Beef Brisket Suya", "Jollof rice", "Fried plantains", "Onions & Sobajo hot sauce"], variations: [["Serves 1–2", 50]], available: true },
  { section: "ndokoti", name: "Ndokoti Deluxe", description: "Everything in Classic plus Obasanjo Fire Chicken.", includes: ["Obasanjo Fire Chicken"], variations: [["Serves 2–3", 100]], available: true },
  { section: "ndokoti", name: "Ndokoti Supreme", description: "Everything in Deluxe plus Sobajo Fire Wings.", includes: ["Sobajo Fire Wings"], variations: [["Serves 3–4", 150]], available: true },
  { section: "ndokoti", name: "Ndokoti Royal", description: "Everything in Supreme plus Sobajo Smoked Turkey Wings.", includes: ["Sobajo Smoked Turkey Wings"], variations: [["Serves 4–6", 300]], available: true },
  { section: "catering-menu", name: "Beef Brisket Suya Tray", description: "Catering tray of signature brisket suya.", image: U("photo-1555244162-803834f70033"), variations: [["Half Shallow", 100], ["Half Deep", 150], ["Full Tray", 350]], available: true },
  { section: "catering-menu", name: "Obasanjo Fire Chicken Tray", description: "Catering tray of Obasanjo Fire Chicken.", image: U("photo-1532550907401-a500c9a57435"), variations: [["Half Shallow", 50], ["Half Deep", 90], ["Full Tray", 200]], available: true },
  { section: "catering-menu", name: "BBQ Chicken Tray", description: "Catering tray of charcoal BBQ chicken.", image: U("photo-1598103442097-8b74394b95c6"), variations: [["Half Shallow", 50], ["Half Deep", 70], ["Full Tray", 170]], available: true },
  { section: "catering-menu", name: "Turkey Wings Tray", description: "Catering tray of smoked turkey wings.", image: U("photo-1518492104633-130d0cc84637"), variations: [["Half Shallow", 80], ["Half Deep", 130], ["Full Tray", 300]], available: true },
  { section: "catering-menu", name: "Sobajo Fire Wings Catering Tray", description: "Catering tray of Sobajo Fire Wings with bold fire-grilled flavor.", image: U("photo-1562967914-608f82629710"), variations: [["Half Deep", 50], ["Full Tray", 150]], available: true },
  { section: "catering-menu", name: "Fire-Grilled Fish Catering Tray", description: "Choose Tilapia or Pompano. Served with onions and Sobajo hot sauce; no suya spice.", image: U("photo-1519708227418-c8fd9a32b7a2"), variations: [["Tilapia — Half Deep", 80], ["Tilapia — Full Tray", 180], ["Pompano — Half Deep", 80], ["Pompano — Full Tray", 180]], available: true },
  { section: "sides", offeredAsSide: true, name: "Jollof Rice", description: "Smoky, richly seasoned West African rice.", variations: [["Standard", 5]], available: true },
  { section: "sides", offeredAsSide: true, name: "Fried Plantains", description: "Sweet, golden, and caramelized.", variations: [["Standard", 5]], available: true },
  { section: "sides", offeredAsSide: true, name: "Coleslaw", description: "Cool and refreshing.", variations: [["Standard", 4]], available: true },
  { section: "sides", name: "Extra Suya Spice", description: "Add extra authentic suya spice.", variations: [["Standard", 2]], available: true },
  { section: "sides", name: "Extra Hot Sauce", description: "Extra house hot sauce.", variations: [["Standard", 2]], available: true },
  { section: "sides", name: "Extra Onions", description: "Fresh sliced onions.", variations: [["Standard", 1]], available: true },
  { section: "drinks", name: "Zobo", description: "Refreshing hibiscus drink with bold West African flavor.", variations: [["Bottle", 5]], available: true },
  { section: "drinks", name: "Fresh Ginger Drink", description: "Fresh house-made ginger drink with a bright, spicy finish.", variations: [["Bottle", 5]], available: true },
  { section: "drinks", name: "Pineapple Ginger Drink", description: "Tropical pineapple blended with fresh ginger.", variations: [["Bottle", 5]], available: true },
  { section: "drinks", name: "Coca-Cola", description: "Chilled Coca-Cola.", variations: [["Can", 3]], available: true },
  { section: "drinks", name: "Sprite", description: "Chilled lemon-lime soda.", variations: [["Can", 3]], available: true },
  { section: "drinks", name: "Fanta Orange", description: "Chilled orange soda.", variations: [["Can", 3]], available: true },
  { section: "drinks", name: "Bottled Water", description: "Cold bottled water.", variations: [["Bottle", 2]], available: true },
];

export type SectionLayout = "feature" | "cards" | "tiers" | "list";

export interface MenuSection {
  /** anchor id */
  id: string;
  title: string;
  /** Short label for the category tabs. */
  tab: string;
  /** feature: one wide hero card · cards: photo grid · tiers: Ndokoti ladder · list: compact rows */
  layout: SectionLayout;
  note?: string;
  items: MenuItem[];
}

export type SectionDef = Omit<MenuSection, "items">;

/** Seed/fallback sections, in menu order. */
export const SECTION_DEFS: SectionDef[] = [
  { id: "bowls", title: "Signature Bowls", tab: "Signature", layout: "feature" },
  { id: "grill", title: "Signature Fire-Grilled Collection", tab: "Fire-Grilled", layout: "cards" },
  {
    id: "ndokoti",
    title: "Ndokoti Experience",
    tab: "Ndokoti Platters",
    layout: "tiers",
    note: "Named after Carrefour Ndokoti in Douala, Cameroon—a crossroads where roads, journeys, people, and communities meet. At Sobajo, Ndokoti represents the table as a meeting place for food, culture, friendship, and community.",
  },
  { id: "catering-menu", title: "Catering Trays", tab: "Catering Trays", layout: "cards", note: "Half pans, shallow or deep, and full trays — sized for offices, churches, birthdays and celebrations." },
  { id: "sides", title: "Sides & Extras", tab: "Sides", layout: "list" },
  { id: "drinks", title: "Signature Drinks", tab: "Drinks", layout: "list" },
];

/** Group items (already in display order) under their sections; campaign-only items are left out. */
export function buildSections(defs: SectionDef[], items: MenuItem[]): MenuSection[] {
  return defs.map((d) => ({ ...d, items: items.filter((i) => i.section === d.id && !i.campaignOnly) }));
}

/**
 * Section by anchor id. Pages that feature a specific section (home, catering,
 * campaigns) get an empty one rather than crashing if it was renamed in Sanity.
 */
export function sectionById(sections: MenuSection[], id: string): MenuSection {
  return sections.find((s) => s.id === id) ?? { id, title: "", tab: "", layout: "cards", items: [] };
}
