/**
 * Instant "new lead" ping. LEAD_WEBHOOK_URL accepts a Slack incoming webhook,
 * a Discord webhook, or any automation hook (Zapier, Make, n8n) — the payload
 * carries both `text` (Slack) and `content` (Discord).
 */

import { LEAD_LABELS, Lead, leadMarkdown } from "./schema";

export const webhookConfigured = () => Boolean(process.env.LEAD_WEBHOOK_URL);

export async function notifyWebhook(lead: Lead): Promise<void> {
  const text = `🔥 New ${LEAD_LABELS[lead.kind].toLowerCase()} from ${lead.name ?? lead.email}\n\n${leadMarkdown(lead)}`;
  const res = await fetch(process.env.LEAD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Discord caps messages at 2000 chars.
    body: JSON.stringify({ text, content: text.slice(0, 1990), lead }),
  });
  if (!res.ok) throw new Error(`Lead webhook → ${res.status}`);
}
