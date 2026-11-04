import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/lib/content";

/**
 * POST /api/revalidate — called by a Sanity webhook on every publish,
 * unpublish or delete (sanity.io/manage → API → Webhooks; see README).
 * Expires the cached content so the next visit renders the change; without
 * this, edits still show up within the hourly revalidate.
 *
 * The request is signed with SANITY_REVALIDATE_SECRET (set the same value as
 * the webhook's secret); unsigned or wrongly signed calls are rejected.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set");
    return Response.json({ error: "Not configured" }, { status: 500 });
  }
  try {
    // `true`: wait for Sanity's eventual consistency so the refetch sees this publish.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return Response.json({ error: "Invalid signature" }, { status: 401 });
    // expire: 0 → the next request refetches instead of serving the old copy
    // (a sold-out toggle should take effect on the very next page view).
    revalidateTag(CONTENT_TAG, { expire: 0 });
    return Response.json({ revalidated: true, type: body?._type ?? null });
  } catch (err) {
    console.error("[revalidate]", err);
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
}
