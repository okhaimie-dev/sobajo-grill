/**
 * Hand-picked guest reviews for "What our guests say" — shown whenever live
 * Google reviews (Places API) aren't enabled.
 *
 * To feature a real Google review, copy it from the Sobajo Grill listing and
 * fill in every field. Reviews with a `url` are labeled "Google review" and
 * link to the original; without one they're labeled "Customer review", so
 * nothing on the site claims to be from Google unless it links there.
 */

export interface CuratedReview {
  text: string;
  /** Reviewer's name as shown on Google, e.g. "Tola A." */
  author?: string;
  /** 1–5 */
  rating?: number;
  /** Link to the review on Google Maps (Share → Copy link on the review). */
  url?: string;
  /** e.g. "March 2026" */
  date?: string;
}

// TODO(owner): replace with 3–6 real Google reviews (author, rating, url).
// These three came from the original demo page and are unverified.
export const CURATED_REVIEWS: CuratedReview[] = [
  { text: "The best suya spot in Baltimore — fresh, flavorful, and always cooked just right." },
  { text: "Made with love. The smoky jollof and flavorful meat are 10/10 every time." },
  { text: "So good we ship it to family in Texas. Beck is the suya king." },
];
