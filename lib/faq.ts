import { SITE } from "./site";

/**
 * Visible FAQ + FAQPage JSON-LD share this list, so answers stay in sync with
 * what search engines (and AI answer engines) quote.
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is suya?",
    a: "Suya is a West African grilled meat tradition — meat coated in a bold pepper spice blend (traditionally made with ground peanuts) and cooked over open fire. At Sobajo Grill our suya-inspired blend meets American barbecue on beef brisket, served with onions, hot sauce and extra suya powder.",
  },
  {
    q: "Where is Sobajo Grill located?",
    a: `We're at ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}. Order ahead online for pickup, or choose delivery.`,
  },
  {
    q: "Do you deliver?",
    a: "Yes — delivery is handled by DoorDash, with no order minimum; DoorDash's delivery fee is shown at checkout. You can also order ahead for pickup. For large or catering-size orders, 24 hours' notice is preferred.",
  },
  {
    q: "Do you cater events?",
    a: "Yes — we cater offices, churches, birthdays, graduations, weddings, watch parties and community events. Catering trays come in half and full pans (shallow or deep) of brisket suya, Obasanjo Fire Chicken, BBQ chicken, turkey wings, fire wings and grilled fish.",
  },
  {
    q: "How spicy is the food?",
    a: "You choose. Most dishes can be ordered Mild, Medium, Hot or Extra Hot. Our Fire-Grilled Fish is made without suya spice.",
  },
  {
    q: "Do you ship nationwide?",
    a: "Nationwide shipping is coming soon. Shelf-stable products like Sobajo Suya Spice and hot sauce will launch first. Join the shipping list and we'll let you know.",
  },
  {
    q: "What does Sobajo mean?",
    a: "Sobajo means friend. Sobajo Grill was born in Baltimore from the heritage of a Cameroonian father and a Nigerian mother — come as a customer, leave as a friend.",
  },
];

/** Catering page FAQ (rendered + FAQPage JSON-LD on /catering/). */
export const CATERING_FAQS: { q: string; a: string }[] = [
  {
    q: "How much notice do you need for catering?",
    a: "24 hours' notice is preferred so every tray comes off the fire fresh. For large events, reach out as early as you can and we'll plan it with you.",
  },
  {
    q: "What tray sizes do you offer?",
    a: "Catering trays come in half and full pans, each in shallow or deep — Half Shallow, Half Deep, Full Shallow and Full Deep. Prices for every size are listed on this page.",
  },
  {
    q: "Do you deliver catering orders?",
    a: `Yes — catering delivery is handled by DoorDash, and DoorDash's delivery fee is shown at checkout. Pickup is available at ${SITE.address.street}, ${SITE.address.city}.`,
  },
  {
    q: "Can I choose the spice level for catering trays?",
    a: "Yes — trays can be made Mild, Medium, Hot or Extra Hot, so the whole crowd is covered. Fire-Grilled Fish trays are made without suya spice.",
  },
  {
    q: "What events do you cater?",
    a: "Offices, churches, birthdays, graduations, weddings, watch parties and community events — anywhere people gather around good food.",
  },
  {
    q: "How do I get a quote for a large event?",
    a: `Email ${SITE.email} or call ${SITE.phone} with your date, guest count and location, and we'll put together a spread for you.`,
  },
];
