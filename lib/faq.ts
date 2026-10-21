import { DELIVERY_FEE, DELIVERY_MINIMUM } from "./menu";
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
    a: `Yes. Sobajo delivers up to 20 miles with a dedicated driver. Delivery orders have a $${DELIVERY_MINIMUM} minimum and a $${DELIVERY_FEE} delivery fee, and 24 hours' notice is preferred.`,
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
