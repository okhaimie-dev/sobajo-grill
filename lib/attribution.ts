/**
 * Marketing attribution (client-side). Records where a visitor came from —
 * UTM tags, ad click IDs, referrer, landing page — as a first touch (kept
 * forever) and a last touch (updated whenever they arrive from a campaign or
 * another site). Sent with every lead so the CRM shows which campaign
 * produced it.
 */

export interface Touch {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  /** Google Ads click ID */
  gclid?: string;
  /** Meta (Facebook/Instagram) click ID */
  fbclid?: string;
  referrer?: string;
  landingPage: string;
  at: string;
}

export interface Attribution {
  first?: Touch;
  last?: Touch;
}

const KEY = "sobajo-attribution-v1";
const PARAMS = ["source", "medium", "campaign", "term", "content"] as const;

function read(): Attribution {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

/** Call once per page load. */
export function captureAttribution(): void {
  const url = new URL(window.location.href);
  const q = url.searchParams;
  const external = document.referrer && new URL(document.referrer).host !== url.host ? document.referrer : undefined;

  const touch: Touch = { landingPage: url.pathname + url.search, at: new Date().toISOString() };
  for (const p of PARAMS) {
    const v = q.get(`utm_${p}`);
    if (v) touch[p] = v.slice(0, 120);
  }
  if (q.get("gclid")) touch.gclid = q.get("gclid")!.slice(0, 200);
  if (q.get("fbclid")) touch.fbclid = q.get("fbclid")!.slice(0, 200);
  if (external) touch.referrer = external.slice(0, 300);

  const isCampaign = Boolean(touch.source || touch.gclid || touch.fbclid);
  const current = read();
  // Untagged referrals (e.g. a Google search) still count as a source.
  if (!touch.source && external) touch.source = new URL(external).hostname.replace(/^www\./, "");
  if (!current.first) current.first = touch.source ? touch : { ...touch, source: "direct" };
  if (isCampaign || external) current.last = touch;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // storage unavailable (private mode) — attribution is best-effort
  }
}

export function getAttribution(): Attribution {
  return typeof window === "undefined" ? {} : read();
}
