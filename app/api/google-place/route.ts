import { getGooglePlace, googlePlacesConfigured } from "@/lib/google-place";

/**
 * GET /api/google-place — live rating, reviews and hours for the site.
 * Never cached (Google's terms forbid caching this content), so every call
 * is billable: the client only calls it when the reviews/visit sections
 * scroll near view, and each IP is rate-limited. Also cap the
 * "Place Details" quota in Google Cloud Console as a hard budget stop.
 */

export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  // 200 (not an error status) so unconfigured sites don't log console errors.
  if (!googlePlacesConfigured()) return Response.json({ configured: false }, { headers: NO_STORE });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429, headers: NO_STORE });

  try {
    return Response.json(await getGooglePlace(), { headers: NO_STORE });
  } catch (err) {
    console.error("[google-place]", err);
    return Response.json({ error: "unavailable" }, { status: 502, headers: NO_STORE });
  }
}
