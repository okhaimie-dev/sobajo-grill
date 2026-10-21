/**
 * Analytics event helper. Sends GA4 recommended events and their Meta Pixel
 * equivalents; a no-op when neither is configured (NEXT_PUBLIC_GA_ID,
 * NEXT_PUBLIC_META_PIXEL_ID) or before the scripts load.
 */

type Params = Record<string, unknown> & { value?: number; currency?: string };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** GA4 event name → Meta standard event. */
const META_EVENTS: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  generate_lead: "Lead",
  sign_up: "CompleteRegistration",
};

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const withCurrency = params.value !== undefined ? { currency: "USD", ...params } : params;
  window.gtag?.("event", event, withCurrency);
  const meta = META_EVENTS[event];
  if (meta) window.fbq?.("track", meta, withCurrency);
}
