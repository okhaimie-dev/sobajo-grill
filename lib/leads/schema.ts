/**
 * Website lead payload (catering quote, shipping waitlist, newsletter) and
 * its server-side validation. No schema library — the shape is small and
 * every field is capped so nothing oversized reaches the CRM.
 */

import type { Attribution, Touch } from "@/lib/attribution";
import { getCampaign } from "@/lib/campaigns";

export const LEAD_KINDS = ["catering", "preorder", "waitlist", "newsletter"] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

export const LEAD_LABELS: Record<LeadKind, string> = {
  catering: "Catering request",
  preorder: "Pre-order request",
  waitlist: "Shipping waitlist",
  newsletter: "Newsletter signup",
};

export interface Lead {
  kind: LeadKind;
  email: string;
  name?: string;
  phone?: string;
  /** YYYY-MM-DD */
  eventDate?: string;
  guests?: number;
  location?: string;
  message?: string;
  /** Campaign slug (pre-orders), validated against lib/campaigns.ts. */
  campaign?: string;
  /** YYYY-MM-DD */
  pickupDate?: string;
  /** Cart lines the guest had when they sent a pre-order (informational). */
  items?: string[];
  /** Path the form was submitted from. */
  page?: string;
  attribution: Attribution;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim().replace(/\s+/g, " ");
  return t ? t.slice(0, max) : undefined;
}

function touch(v: unknown): Touch | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const out: Touch = { landingPage: str(o.landingPage, 300) ?? "", at: str(o.at, 40) ?? "" };
  for (const k of ["source", "medium", "campaign", "term", "content", "gclid", "fbclid", "referrer"] as const) {
    const s = str(o[k], k === "referrer" ? 300 : 200);
    if (s) out[k] = s;
  }
  return out;
}

/** Returns the cleaned lead, or a user-facing error message. */
export function parseLead(body: unknown, today = new Date()): Lead | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const b = body as Record<string, unknown>;

  const kind = b.kind as LeadKind;
  if (!LEAD_KINDS.includes(kind)) return "Invalid request.";

  const email = str(b.email, 254)?.toLowerCase();
  if (!email || !EMAIL.test(email)) return "Please enter a valid email address.";

  const lead: Lead = {
    kind,
    email,
    name: str(b.name, 100),
    phone: str(b.phone, 30),
    location: str(b.location, 120),
    message: str(b.message, 2000),
    page: str(b.page, 200),
    attribution: {
      first: touch((b.attribution as Attribution | undefined)?.first),
      last: touch((b.attribution as Attribution | undefined)?.last),
    },
  };

  if (kind === "preorder") {
    if (!lead.name) return "Please tell us your name.";
    if (!lead.phone) return "Please add a phone number so we can confirm your order.";
    const campaign = getCampaign(str(b.campaign, 60) ?? "");
    if (!campaign) return "Invalid request.";
    lead.campaign = campaign.slug;
    const date = str(b.pickupDate, 10);
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Please enter a valid pickup date.";
      if (date < today.toISOString().slice(0, 10)) return "The pickup date is in the past.";
      lead.pickupDate = date;
    }
    if (Array.isArray(b.items)) {
      lead.items = b.items.map((i) => str(i, 200)).filter((i): i is string => Boolean(i)).slice(0, 30);
    }
  }
  if (kind === "catering" || kind === "preorder") {
    if (!lead.name) return "Please tell us your name.";
    const date = str(b.eventDate, 10);
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Please enter a valid event date.";
      if (date < today.toISOString().slice(0, 10)) return "The event date is in the past.";
      lead.eventDate = date;
    }
    if (b.guests !== undefined && b.guests !== "") {
      const g = Number(b.guests);
      if (!Number.isInteger(g) || g < 1 || g > 10000) return "Please enter a valid guest count.";
      lead.guests = g;
    }
  }
  return lead;
}

/** Human-readable summary (CRM note body, notifications). */
export function leadMarkdown(lead: Lead): string {
  const rows: [string, string | number | undefined][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Campaign", lead.campaign ? getCampaign(lead.campaign)?.name : undefined],
    ["Pickup date", lead.pickupDate],
    ["Event date", lead.eventDate],
    ["Guests", lead.guests],
    ["Location", lead.location],
    ["Submitted from", lead.page],
  ];
  const lines = rows.filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `- **${k}:** ${v}`);
  if (lead.items?.length) lines.push("", "**Cart at time of request**", "", ...lead.items.map((i) => `- ${i}`));
  if (lead.message) lines.push("", "**Message**", "", lead.message);

  const fmt = (t?: Touch) =>
    t
      ? [t.source, t.medium, t.campaign].filter(Boolean).join(" / ") +
        (t.gclid ? " (Google Ads click)" : "") +
        (t.fbclid ? " (Meta ad click)" : "") +
        ` — landed on ${t.landingPage}`
      : "unknown";
  lines.push("", "**Attribution**", "", `- **First touch:** ${fmt(lead.attribution.first)}`, `- **Last touch:** ${fmt(lead.attribution.last)}`);
  return lines.join("\n");
}
