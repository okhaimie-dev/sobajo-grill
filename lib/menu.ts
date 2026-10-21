/**
 * Sobajo Grill — full menu data, lifted from the "Branded Full Menu &
 * Ordering Demo" page.
 */

export type ItemSection = "bowls" | "grill" | "ndokoti" | "catering" | "sides" | "drinks";

export interface MenuItem {
  name: string;
  description: string;
  image: string;
  section: ItemSection;
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

export function hasSpiceOption(item: MenuItem): boolean {
  return item.spice !== false && item.section !== "drinks";
}

export function sideOptions(item: MenuItem): [string, number][] {
  if (!item.sideMode) return [];
  return item.sideMode === "included"
    ? [["Jollof Rice", 0], ["Fried Plantains", 0], ["Coleslaw", 0]]
    : [["No Side", 0], ["Jollof Rice", 5], ["Fried Plantains", 5], ["Coleslaw", 4]];
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const items: MenuItem[] = [
  { section: "bowls", name: "Beef Brisket Suya", description: "The Sobajo signature—where West African suya meets American barbecue. Beef brisket seasoned with our suya-inspired spice blend and served the Sobajo way with onions, hot sauce, and suya powder.", image: U("photo-1529193591184-b1d58069ecdd"), variations: [["Small", 15], ["Medium", 20], ["Large", 30], ["Extra Large", 50]], available: true },
  { section: "grill", name: "Obasanjo Fire Chicken", description: "A tribute to our Nigerian community and the customers who helped shape the Sobajo journey—fire-grilled chicken with bold spice, heat, onions, and unmistakable Sobajo character.", image: U("photo-1532550907401-a500c9a57435"), variations: [["Whole Chicken", 25]], available: true },
  { section: "grill", name: "BBQ Chicken", description: "Sobajo BBQ Chicken celebrates the barbecue side of our story—fire, smoke, char, and the joy of sharing grilled chicken around the table. It brings familiar American barbecue comfort together with Sobajo’s bold African personality, creating a simple, smoky meal made for family, friends, and gatherings.", image: U("photo-1598103442097-8b74394b95c6"), variations: [["Half Chicken", 15], ["Whole Chicken", 25]], available: true },
  { section: "grill", name: "Sobajo Smoked Turkey Wings", description: "Back by popular demand. Our customers asked for them, so Sobajo Smoked Turkey Wings return with rich smoke, bold seasoning, and hearty fire-grilled character.", image: U("photo-1518492104633-130d0cc84637"), variations: [["2 Wings", 18]], available: true },
  { section: "grill", name: "Sobajo Fire Wings", description: "Our tribute to Baltimore and America’s love of great wings—bringing Sobajo’s bold African flavors together with a familiar American favorite. Made for game nights, celebrations, family, and friends. Sides are optional and sold separately.", image: U("photo-1562967914-608f82629710"), variations: [["4 Full Wings", 12], ["8 Full Wings", 24], ["20 Full Wings", 50]], sideMode: "optional", spice: true, available: true },
  { section: "grill", name: "Fire-Grilled Fish", description: "Fire-Grilled Fish reflects the place grilled fish holds in African food culture and communal dining. Tilapia or Pompano is cooked over fire, served with onions, Sobajo hot sauce, and one included side—an experience built around spice, smoke, sharing, and the table. No suya spice.", image: U("photo-1519708227418-c8fd9a32b7a2"), variations: [["Whole Tilapia", 25], ["Whole Pompano", 25]], sideMode: "included", spice: false, available: true },
  { section: "ndokoti", name: "Ndokoti Classic", description: "Signature Beef Brisket Suya with jollof rice, fried plantains, fresh onions, and Sobajo hot sauce.", image: U("photo-1547592180-85f173990554"), variations: [["Serves 1–2", 50]], available: true },
  { section: "ndokoti", name: "Ndokoti Deluxe", description: "Everything in Classic plus Obasanjo Fire Chicken.", image: U("photo-1504674900247-0877df9cc836"), variations: [["Serves 2–3", 100]], available: true },
  { section: "ndokoti", name: "Ndokoti Supreme", description: "Everything in Deluxe plus Sobajo Fire Wings.", image: U("photo-1555244162-803834f70033"), variations: [["Serves 3–4", 150]], available: true },
  { section: "ndokoti", name: "Ndokoti Royal", description: "Everything in Supreme plus Sobajo Smoked Turkey Wings.", image: U("photo-1515003197210-e0cd71810b5f"), variations: [["Serves 4–6", 300]], available: true },
  { section: "catering", name: "Beef Brisket Suya Tray", description: "Catering tray of signature brisket suya.", image: U("photo-1555244162-803834f70033"), variations: [["Half Shallow", 100], ["Half Deep", 150], ["Full Shallow", 300], ["Full Deep", 400]], available: true },
  { section: "catering", name: "Obasanjo Fire Chicken Tray", description: "Catering tray of Obasanjo Fire Chicken.", image: U("photo-1532550907401-a500c9a57435"), variations: [["Half Shallow", 50], ["Half Deep", 90], ["Full Shallow", 150], ["Full Deep", 250]], available: true },
  { section: "catering", name: "BBQ Chicken Tray", description: "Catering tray of charcoal BBQ chicken.", image: U("photo-1598103442097-8b74394b95c6"), variations: [["Half Shallow", 50], ["Half Deep", 70], ["Full Shallow", 120], ["Full Deep", 200]], available: true },
  { section: "catering", name: "Turkey Wings Tray", description: "Catering tray of smoked turkey wings.", image: U("photo-1518492104633-130d0cc84637"), variations: [["Half Shallow", 80], ["Half Deep", 130], ["Full Shallow", 220], ["Full Deep", 350]], available: true },
  { section: "catering", name: "Sobajo Fire Wings Catering Tray", description: "Catering tray of Sobajo Fire Wings with bold fire-grilled flavor.", image: U("photo-1562967914-608f82629710"), variations: [["Half Deep", 50], ["Full Shallow", 100], ["Full Deep", 150]], spice: true, available: true },
  { section: "catering", name: "Fire-Grilled Fish Catering Tray", description: "Choose Tilapia or Pompano. Served with onions and Sobajo hot sauce; no suya spice.", image: U("photo-1519708227418-c8fd9a32b7a2"), variations: [["Tilapia — Half Deep", 80], ["Tilapia — Full Shallow", 120], ["Tilapia — Full Deep", 180], ["Pompano — Half Deep", 80], ["Pompano — Full Shallow", 120], ["Pompano — Full Deep", 180]], spice: false, available: true },
  { section: "sides", name: "Jollof Rice", description: "Smoky, richly seasoned West African rice.", image: U("photo-1604329760661-e71dc83f8f26"), variations: [["Standard", 5]], available: true },
  { section: "sides", name: "Fried Plantains", description: "Sweet, golden, and caramelized.", image: U("photo-1589301760014-d929f3979dbc"), variations: [["Standard", 5]], available: true },
  { section: "sides", name: "Coleslaw", description: "Cool and refreshing.", image: U("photo-1625938145744-e380515399bf"), variations: [["Standard", 4]], available: true },
  { section: "sides", name: "Extra Suya Spice", description: "Add extra authentic suya spice.", image: U("photo-1596040033229-a9821ebd058d"), variations: [["Standard", 2]], available: true },
  { section: "sides", name: "Extra Hot Sauce", description: "Extra house hot sauce.", image: U("photo-1585620385456-4759f9b5c7d9"), variations: [["Standard", 2]], available: true },
  { section: "sides", name: "Extra Onions", description: "Fresh sliced onions.", image: U("photo-1508747703725-719777637510"), variations: [["Standard", 1]], available: true },
  { section: "drinks", name: "Zobo", description: "Refreshing hibiscus drink with bold West African flavor.", image: U("photo-1544145945-f90425340c7e"), variations: [["Bottle", 5]], spice: false, available: true },
  { section: "drinks", name: "Fresh Ginger Drink", description: "Fresh house-made ginger drink with a bright, spicy finish.", image: U("photo-1622597467836-f3285f2131b8"), variations: [["Bottle", 5]], spice: false, available: true },
  { section: "drinks", name: "Pineapple Ginger Drink", description: "Tropical pineapple blended with fresh ginger.", image: U("photo-1600271886742-f049cd451bba"), variations: [["Bottle", 5]], spice: false, available: true },
  { section: "drinks", name: "Coca-Cola", description: "Chilled Coca-Cola.", image: U("photo-1629203849820-fdd70d49c38e"), variations: [["Can", 3]], spice: false, available: true },
  { section: "drinks", name: "Sprite", description: "Chilled lemon-lime soda.", image: U("photo-1625772299848-391b6a87d7b3"), variations: [["Can", 3]], spice: false, available: true },
  { section: "drinks", name: "Fanta Orange", description: "Chilled orange soda.", image: U("photo-1624517452488-04869289c4ca"), variations: [["Can", 3]], spice: false, available: true },
  { section: "drinks", name: "Bottled Water", description: "Cold bottled water.", image: U("photo-1602143407151-7111542de6e8"), variations: [["Bottle", 2]], spice: false, available: true },
];

export interface MenuSection {
  /** anchor id */
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
}

export const MENU_SECTIONS: MenuSection[] = [
  { id: "bowls", title: "Signature Bowls", items: items.filter((i) => i.section === "bowls") },
  {
    id: "grill",
    title: "Signature Fire-Grilled Collection",
    items: items.filter((i) => i.section === "grill"),
  },
  {
    id: "ndokoti",
    title: "Ndokoti Experience",
    note: "Named after Carrefour Ndokoti in Douala, Cameroon—a crossroads where roads, journeys, people, and communities meet. At Sobajo, Ndokoti represents the table as a meeting place for food, culture, friendship, and community.",
    items: items.filter((i) => i.section === "ndokoti"),
  },
  { id: "catering-menu", title: "Catering Trays", items: items.filter((i) => i.section === "catering") },
  { id: "sides", title: "Sides & Extras", items: items.filter((i) => i.section === "sides") },
  { id: "drinks", title: "Signature Drinks", items: items.filter((i) => i.section === "drinks") },
];
