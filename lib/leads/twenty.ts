/**
 * Twenty CRM destination (https://twenty.com). Works with Twenty Cloud or a
 * self-hosted instance — only the base URL differs.
 *
 *   TWENTY_API_KEY   Settings → Developers → API → + Create key
 *   TWENTY_API_URL   default https://api.twenty.com (self-hosted: https://crm.your-domain)
 *
 * Per lead: find-or-create the Person by email, then attach a Note with the
 * details + attribution. Catering requests also open an Opportunity so they
 * land in the sales pipeline. Field names are Twenty's standard objects
 * (name, emails, phones; note.bodyV2; noteTarget.target*Id).
 */

import { LEAD_LABELS, Lead, leadMarkdown } from "./schema";

const BASE = (process.env.TWENTY_API_URL ?? "https://api.twenty.com").replace(/\/$/, "");

export const twentyConfigured = () => Boolean(process.env.TWENTY_API_KEY);

async function twenty<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${BASE}/rest/${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Twenty ${init?.method ?? "GET"} /rest/${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

type Created<K extends string> = { data: Record<K, { id: string }> };

function splitName(name?: string) {
  const [firstName = "", ...rest] = (name ?? "").split(" ");
  return { firstName, lastName: rest.join(" ") };
}

/** US numbers → national 10 digits + +1; anything else is kept as typed. */
function phoneFields(phone?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return national.length === 10
    ? { primaryPhoneNumber: national, primaryPhoneCountryCode: "US", primaryPhoneCallingCode: "+1" }
    : { primaryPhoneNumber: phone };
}

async function findOrCreatePerson(lead: Lead): Promise<string> {
  const filter = encodeURIComponent(`emails.primaryEmail[eq]:"${lead.email.replace(/"/g, "")}"`);
  const found = await twenty<{ data: { people: { id: string }[] } }>(`people?filter=${filter}&limit=1&fields=id`);
  if (found.data.people[0]) return found.data.people[0].id;

  const created = await twenty<Created<"createPerson">>("people", {
    method: "POST",
    body: {
      name: splitName(lead.name),
      emails: { primaryEmail: lead.email },
      ...(lead.phone && { phones: phoneFields(lead.phone) }),
      // Location lives in the note: the standard Person object has no city field.
    },
  });
  return created.data.createPerson.id;
}

export async function sendToTwenty(lead: Lead): Promise<void> {
  const personId = await findOrCreatePerson(lead);

  let opportunityId: string | undefined;
  if (lead.kind === "catering") {
    const parts = [lead.name, lead.eventDate ?? "date TBD", lead.guests ? `${lead.guests} guests` : null].filter(Boolean);
    const opp = await twenty<Created<"createOpportunity">>("opportunities", {
      method: "POST",
      body: { name: `Catering · ${parts.join(" · ")}`, pointOfContactId: personId },
    });
    opportunityId = opp.data.createOpportunity.id;
  }

  const source = lead.attribution.last?.source ?? lead.attribution.first?.source;
  const note = await twenty<Created<"createNote">>("notes", {
    method: "POST",
    body: {
      title: `Website · ${LEAD_LABELS[lead.kind]}${source ? ` · via ${source}` : ""}`,
      bodyV2: { markdown: leadMarkdown(lead) },
    },
  });
  const noteId = note.data.createNote.id;
  await twenty("noteTargets", { method: "POST", body: { noteId, targetPersonId: personId } });
  if (opportunityId) {
    await twenty("noteTargets", { method: "POST", body: { noteId, targetOpportunityId: opportunityId } });
  }
}
