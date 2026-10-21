/**
 * Live Google Business data (Places API, New) — rating, reviews, hours.
 * Server-only: GOOGLE_MAPS_API_KEY never reaches the browser.
 *
 * Google's terms allow storing the place ID but NOT caching reviews, ratings
 * or hours, so details are fetched fresh per request (`no-store`). Cost is
 * the "Place Details Enterprise + Atmosphere" SKU (reviews), so callers
 * should fetch lazily — see components/use-google-place.ts.
 */

import { SITE } from "./site";

// Overridable only for tests against a mock server.
const API = process.env.GOOGLE_PLACES_API_URL ?? "https://places.googleapis.com/v1";

export interface GoogleReview {
  author: string;
  authorUri?: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  translated: boolean;
  relativeTime: string;
  publishTime?: string;
  reviewUri?: string;
}

export interface GooglePlace {
  rating?: number;
  ratingCount?: number;
  reviews: GoogleReview[];
  placeUri?: string;
  reviewsUri?: string;
  writeReviewUri?: string;
  directionsUri?: string;
  openNow?: boolean;
  hours: string[];
}

export const googlePlacesConfigured = () => Boolean(process.env.GOOGLE_MAPS_API_KEY);

function headers(fieldMask: string) {
  return {
    "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
    "X-Goog-FieldMask": fieldMask,
    "Content-Type": "application/json",
  };
}

// Place IDs may be stored indefinitely (Maps Service Terms), so the lookup
// result is memoized for the life of the server instance.
let placeId: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || undefined;

/** Text Search "IDs only" — the free Essentials SKU. */
async function resolvePlaceId(): Promise<string> {
  if (placeId) return placeId;
  const { street, city, region, postalCode } = SITE.address;
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: headers("places.id"),
    body: JSON.stringify({ textQuery: `${SITE.name}, ${street}, ${city}, ${region} ${postalCode}`, pageSize: 1 }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Places searchText → ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const id = ((await res.json()) as { places?: { id: string }[] }).places?.[0]?.id;
  if (!id) throw new Error("Places searchText: no match for Sobajo Grill");
  console.info(`[google-place] resolved place ID ${id} — set NEXT_PUBLIC_GOOGLE_PLACE_ID=${id} to skip this lookup`);
  return (placeId = id);
}

interface RawReview {
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
}

interface RawPlace {
  rating?: number;
  userRatingCount?: number;
  reviews?: RawReview[];
  googleMapsUri?: string;
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string; directionsUri?: string; placeUri?: string };
  currentOpeningHours?: { openNow?: boolean };
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
}

const FIELDS = [
  "rating",
  "userRatingCount",
  "reviews",
  "googleMapsUri",
  "googleMapsLinks",
  "currentOpeningHours.openNow",
  "regularOpeningHours.weekdayDescriptions",
].join(",");

export async function getGooglePlace(): Promise<GooglePlace> {
  const id = await resolvePlaceId();
  const res = await fetch(`${API}/places/${encodeURIComponent(id)}?languageCode=en`, {
    headers: headers(FIELDS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Places details → ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const p = (await res.json()) as RawPlace;

  return {
    rating: p.rating,
    ratingCount: p.userRatingCount,
    reviews: (p.reviews ?? [])
      .filter((r) => r.text?.text || r.originalText?.text)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUri: r.authorAttribution?.uri,
        authorPhoto: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText!.text!,
        translated: Boolean(
          r.text?.languageCode && r.originalText?.languageCode && r.text.languageCode !== r.originalText.languageCode
        ),
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime,
        reviewUri: r.googleMapsUri,
      })),
    placeUri: p.googleMapsLinks?.placeUri ?? p.googleMapsUri,
    reviewsUri: p.googleMapsLinks?.reviewsUri ?? p.googleMapsUri,
    writeReviewUri: p.googleMapsLinks?.writeAReviewUri,
    directionsUri: p.googleMapsLinks?.directionsUri,
    openNow: p.currentOpeningHours?.openNow,
    hours: p.regularOpeningHours?.weekdayDescriptions ?? [],
  };
}
