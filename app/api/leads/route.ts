import { after } from "next/server";
import { notifyWebhook, webhookConfigured } from "@/lib/leads/notify";
import { parseLead } from "@/lib/leads/schema";
import { sendToTwenty, twentyConfigured } from "@/lib/leads/twenty";

/**
 * POST /api/leads — catering quotes, shipping waitlist, newsletter signups.
 * The CRM write must succeed before we report success, so leads are never
 * silently dropped; the notification ping runs after the response.
 */

// Best-effort per-instance limiter (serverless instances don't share memory);
// enough to blunt a form-spam loop. Swap for Vercel KV/Upstash if abused.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const json = (status: number, body: object) => Response.json(body, { status });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return json(429, { error: "Too many requests — please try again in a minute." });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  // Honeypot: a hidden field real visitors never fill in. Pretend success.
  if (typeof body.company === "string" && body.company.trim()) return json(200, { ok: true });

  const lead = parseLead(body);
  if (typeof lead === "string") return json(400, { error: lead });

  if (!twentyConfigured() && !webhookConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[leads] no destination configured — lead not stored:", lead);
      return json(200, { ok: true, stored: false });
    }
    console.error("[leads] no destination configured (TWENTY_API_KEY / LEAD_WEBHOOK_URL)");
    return json(503, { error: "Online requests are temporarily unavailable." });
  }

  if (twentyConfigured()) {
    try {
      await sendToTwenty(lead);
    } catch (err) {
      console.error("[leads] Twenty write failed:", err);
      // Still try to get the lead to a human before failing the request.
      if (!webhookConfigured()) return json(502, { error: "We couldn't save your request." });
      try {
        await notifyWebhook(lead);
        return json(200, { ok: true });
      } catch (hookErr) {
        console.error("[leads] webhook fallback failed:", hookErr);
        return json(502, { error: "We couldn't save your request." });
      }
    }
    if (webhookConfigured()) {
      after(() => notifyWebhook(lead).catch((err) => console.error("[leads] webhook failed:", err)));
    }
    return json(200, { ok: true });
  }

  try {
    await notifyWebhook(lead);
    return json(200, { ok: true });
  } catch (err) {
    console.error("[leads] webhook failed:", err);
    return json(502, { error: "We couldn't save your request." });
  }
}
