/**
 * Sobajo Grill — full menu data, lifted from the "Branded Full Menu &
 * Ordering Demo" page.
 */

export type ItemSection = "bowls" | "grill" | "ndokoti" | "catering" | "sides" | "drinks";

export interface MenuItem {
  name: string;
  description: string;
  /** Unsplash base URL (see `U`) or a root-relative /public path; omitted for list-style sections. */
  image?: string;
  section: ItemSection;
  /** Short highlight chip shown on the card. */
  badge?: string;
  /** Ndokoti tiers: what this level adds on top of the previous one. */
  includes?: string[];
  variations: [string, number][];
  /** "optional" → side sold as extra; "included" → one side comes with the item. */
  sideMode?: "optional" | "included";
  /** false → no spice level offered (fish, drinks…). Default is spice-eligible. */
  spice?: boolean;
  available?: boolean;
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
  spice: string;
  side: string;
  notes: string;
}

export const SQUARE_CHECKOUT_URL = "https://squareup.com/your-sobajo-ordering-link"; // TODO: replace with the real Sobajo Square ordering link

export const DELIVERY_FEE = 20;
export const DELIVERY_MINIMUM = 100;

export const SPICE_OPTIONS = ["Mild", "Medium", "Hot", "Extra Hot"] as const;

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

export function hasSpiceOption(item: MenuItem): boolean {
  return item.spice !== false && item.section !== "drinks";
}

export function sideOptions(item: MenuItem): [string, number][] {
  if (!item.sideMode) return [];
  return item.sideMode === "included"
    ? [["Jollof Rice", 0], ["Fried Plantains", 0], ["Coleslaw", 0]]
    : [["No Side", 0], ["Jollof Rice", 5], ["Fried Plantains", 5], ["Coleslaw", 4]];
}

/** Unsplash base URL; components append `&w=` per srcset width. */
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75`;

export function imageSrcSet(base: string, widths = [480, 800, 1200]): string {
  return widths.map((w) => `${base}&w=${w} ${w}w`).join(", ");
}

export const items: MenuItem[] = [
  { section: "bowls", name: "Beef Brisket Suya", badge: "The Sobajo signature", description: "The Sobajo signature—where West African suya meets American barbecue. Beef brisket seasoned with our suya-inspired spice blend and served the Sobajo way with onions, hot sauce, and suya powder.", image: "/hero.jpg", variations: [["Small", 15], ["Medium", 20], ["Large", 30], ["Extra Large", 50]], available: true },
  { section: "grill", name: "Obasanjo Fire Chicken", badge: "Signature", description: "A tribute to our Nigerian community and the customers who helped shape the Sobajo journey—fire-grilled chicken with bold spice, heat, onions, and unmistakable Sobajo character.", image: U("photo-1532550907401-a500c9a57435"), variations: [["Whole Chicken", 25]], available: true },
  { section: "grill", name: "BBQ Chicken", description: "Sobajo BBQ Chicken celebrates the barbecue side of our story—fire, smoke, char, and the joy of sharing grilled chicken around the table. It brings familiar American barbecue comfort together with Sobajo’s bold African personality, creating a simple, smoky meal made for family, friends, and gatherings.", image: U("photo-1598103442097-8b74394b95c6"), variations: [["Half Chicken", 15], ["Whole Chicken", 25]], available: true },
  { section: "grill", name: "Sobajo Smoked Turkey Wings", badge: "Back by demand", description: "Back by popular demand. Our customers asked for them, so Sobajo Smoked Turkey Wings return with rich smoke, bold seasoning, and hearty fire-grilled character.", image: U("photo-1518492104633-130d0cc84637"), variations: [["2 Wings", 18]], available: true },
  { section: "grill", name: "Sobajo Fire Wings", description: "Our tribute to Baltimore and America’s love of great wings—bringing Sobajo’s bold African flavors together with a familiar American favorite. Made for game nights, celebrations, family, and friends. Sides are optional and sold separately.", image: U("photo-1562967914-608f82629710"), variations: [["4 Full Wings", 12], ["8 Full Wings", 24], ["20 Full Wings", 50]], sideMode: "optional", spice: true, available: true },
  { section: "grill", name: "Fire-Grilled Fish", badge: "Side included", description: "Fire-Grilled Fish reflects the place grilled fish holds in African food culture and communal dining. Tilapia or Pompano is cooked over fire, served with onions, Sobajo hot sauce, and one included side—an experience built around spice, smoke, sharing, and the table. No suya spice.", image: U("photo-1519708227418-c8fd9a32b7a2"), variations: [["Whole Tilapia", 25], ["Whole Pompano", 25]], sideMode: "included", spice: false, available: true },
  { section: "ndokoti", name: "Ndokoti Classic", description: "Signature Beef Brisket Suya with jollof rice, fried plantains, fresh onions, and Sobajo hot sauce.", includes: ["Beef Brisket Suya", "Jollof rice", "Fried plantains", "Onions & Sobajo hot sauce"], variations: [["Serves 1–2", 50]], available: true },
  { section: "ndokoti", name: "Ndokoti Deluxe", description: "Everything in Classic plus Obasanjo Fire Chicken.", includes: ["Obasanjo Fire Chicken"], variations: [["Serves 2–3", 100]], available: true },
  { section: "ndokoti", name: "Ndokoti Supreme", description: "Everything in Deluxe plus Sobajo Fire Wings.", includes: ["Sobajo Fire Wings"], variations: [["Serves 3–4", 150]], available: true },
  { section: "ndokoti", name: "Ndokoti Royal", description: "Everything in Supreme plus Sobajo Smoked Turkey Wings.", includes: ["Sobajo Smoked Turkey Wings"], variations: [["Serves 4–6", 300]], available: true },
  { section: "catering", name: "Beef Brisket Suya Tray", description: "Catering tray of signature brisket suya.", image: U("photo-1555244162-803834f70033"), variations: [["Half Shallow", 100], ["Half Deep", 150], ["Full Shallow", 300], ["Full Deep", 400]], available: true },
  { section: "catering", name: "Obasanjo Fire Chicken Tray", description: "Catering tray of Obasanjo Fire Chicken.", image: U("photo-1532550907401-a500c9a57435"), variations: [["Half Shallow", 50], ["Half Deep", 90], ["Full Shallow", 150], ["Full Deep", 250]], available: true },
  { section: "catering", name: "BBQ Chicken Tray", description: "Catering tray of charcoal BBQ chicken.", image: U("photo-1598103442097-8b74394b95c6"), variations: [["Half Shallow", 50], ["Half Deep", 70], ["Full Shallow", 120], ["Full Deep", 200]], available: true },
  { section: "catering", name: "Turkey Wings Tray", description: "Catering tray of smoked turkey wings.", image: U("photo-1518492104633-130d0cc84637"), variations: [["Half Shallow", 80], ["Half Deep", 130], ["Full Shallow", 220], ["Full Deep", 350]], available: true },
  { section: "catering", name: "Sobajo Fire Wings Catering Tray", description: "Catering tray of Sobajo Fire Wings with bold fire-grilled flavor.", image: U("photo-1562967914-608f82629710"), variations: [["Half Deep", 50], ["Full Shallow", 100], ["Full Deep", 150]], spice: true, available: true },
  { section: "catering", name: "Fire-Grilled Fish Catering Tray", description: "Choose Tilapia or Pompano. Served with onions and Sobajo hot sauce; no suya spice.", image: U("photo-1519708227418-c8fd9a32b7a2"), variations: [["Tilapia — Half Deep", 80], ["Tilapia — Full Shallow", 120], ["Tilapia — Full Deep", 180], ["Pompano — Half Deep", 80], ["Pompano — Full Shallow", 120], ["Pompano — Full Deep", 180]], spice: false, available: true },
  { section: "sides", name: "Jollof Rice", description: "Smoky, richly seasoned West African rice.", variations: [["Standard", 5]], available: true },
  { section: "sides", name: "Fried Plantains", description: "Sweet, golden, and caramelized.", variations: [["Standard", 5]], available: true },
  { section: "sides", name: "Coleslaw", description: "Cool and refreshing.", variations: [["Standard", 4]], available: true },
  { section: "sides", name: "Extra Suya Spice", description: "Add extra authentic suya spice.", variations: [["Standard", 2]], available: true },
  { section: "sides", name: "Extra Hot Sauce", description: "Extra house hot sauce.", variations: [["Standard", 2]], available: true },
  { section: "sides", name: "Extra Onions", description: "Fresh sliced onions.", variations: [["Standard", 1]], available: true },
  { section: "drinks", name: "Zobo", description: "Refreshing hibiscus drink with bold West African flavor.", variations: [["Bottle", 5]], spice: false, available: true },
  { section: "drinks", name: "Fresh Ginger Drink", description: "Fresh house-made ginger drink with a bright, spicy finish.", variations: [["Bottle", 5]], spice: false, available: true },
  { section: "drinks", name: "Pineapple Ginger Drink", description: "Tropical pineapple blended with fresh ginger.", variations: [["Bottle", 5]], spice: false, available: true },
  { section: "drinks", name: "Coca-Cola", description: "Chilled Coca-Cola.", variations: [["Can", 3]], spice: false, available: true },
  { section: "drinks", name: "Sprite", description: "Chilled lemon-lime soda.", variations: [["Can", 3]], spice: false, available: true },
  { section: "drinks", name: "Fanta Orange", description: "Chilled orange soda.", variations: [["Can", 3]], spice: false, available: true },
  { section: "drinks", name: "Bottled Water", description: "Cold bottled water.", variations: [["Bottle", 2]], spice: false, available: true },
];

export interface MenuSection {
  /** anchor id */
  id: string;
  title: string;
  /** Short label for the category tabs. */
  tab: string;
  /** feature: one wide hero card · cards: photo grid · tiers: Ndokoti ladder · list: compact rows */
  layout: "feature" | "cards" | "tiers" | "list";
  note?: string;
  items: MenuItem[];
}

export const MENU_SECTIONS: MenuSection[] = [
  { id: "bowls", title: "Signature Bowls", tab: "Signature", layout: "feature", items: items.filter((i) => i.section === "bowls") },
  {
    id: "grill",
    title: "Signature Fire-Grilled Collection",
    tab: "Fire-Grilled",
    layout: "cards",
    items: items.filter((i) => i.section === "grill"),
  },
  {
    id: "ndokoti",
    title: "Ndokoti Experience",
    tab: "Ndokoti Platters",
    layout: "tiers",
    note: "Named after Carrefour Ndokoti in Douala, Cameroon—a crossroads where roads, journeys, people, and communities meet. At Sobajo, Ndokoti represents the table as a meeting place for food, culture, friendship, and community.",
    items: items.filter((i) => i.section === "ndokoti"),
  },
  { id: "catering-menu", title: "Catering Trays", tab: "Catering Trays", layout: "cards", note: "Half and full pans, shallow or deep — sized for offices, churches, birthdays and celebrations.", items: items.filter((i) => i.section === "catering") },
  { id: "sides", title: "Sides & Extras", tab: "Sides", layout: "list", items: items.filter((i) => i.section === "sides") },
  { id: "drinks", title: "Signature Drinks", tab: "Drinks", layout: "list", items: items.filter((i) => i.section === "drinks") },
];
