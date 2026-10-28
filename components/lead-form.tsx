"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import type { LeadKind } from "@/lib/leads/schema";
import { BASE_PATH } from "@/lib/assets";
import { money } from "@/lib/menu";
import { CATERING_QUOTE_HREF, SITE } from "@/lib/site";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

const COPY: Record<LeadKind, { button: string; done: string; doneText: string }> = {
  catering: {
    button: "Send my request",
    done: "Request received!",
    doneText: "Thank you — we'll reach out shortly to plan your spread.",
  },
  preorder: {
    button: "Send my pre-order request",
    done: "Pre-order request received!",
    doneText: "We'll call or text to confirm your order, pickup time and payment.",
  },
  waitlist: {
    button: "Join the shipping list",
    done: "You're on the list.",
    doneText: "We'll email you the moment nationwide shipping opens.",
  },
  newsletter: {
    button: "Sign up",
    done: "Welcome to the family!",
    doneText: "Look out for specials and new drops in your inbox.",
  },
};

const today = () => new Date().toISOString().slice(0, 10);

/** Lead capture → POST /api/leads → CRM. Falls back to email if the API is unavailable. */
export default function LeadForm({
  kind,
  compact = false,
  campaign,
  maxDate,
}: {
  kind: LeadKind;
  compact?: boolean;
  /** Campaign slug (pre-orders). */
  campaign?: string;
  /** Latest selectable pickup date (YYYY-MM-DD). */
  maxDate?: string;
}) {
  const pathname = usePathname();
  const { lines, clearCart } = useCart();
  const cartItems = lines.map(
    (l) => `${l.name} — ${[l.variation, l.quantity > 1 ? `× ${l.quantity}` : "", l.side, l.notes].filter(Boolean).join(" · ")} (${money(l.price)})`
  );
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const copy = COPY[kind];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`${BASE_PATH}/api/leads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          kind,
          campaign,
          ...(kind === "preorder" && { items: cartItems }),
          page: pathname,
          attribution: getAttribution(),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      setStatus("done");
      track(kind === "newsletter" ? "sign_up" : "generate_lead", { lead_type: kind, campaign, method: "website_form" });
      if (kind === "preorder" && cartItems.length) clearCart();
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="lead-done" role="status">
        <Icon name="check" />
        <div>
          <strong>{copy.done}</strong>
          <span>{copy.doneText}</span>
        </div>
      </div>
    );
  }

  const fallback = kind === "catering" ? CATERING_QUOTE_HREF : `mailto:${SITE.email}`;

  return (
    <form className={`lead-form lead-${kind}${compact ? " compact" : ""}`} onSubmit={onSubmit}>
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className="hp" aria-hidden="true">
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {kind === "preorder" ? (
        <div className="lead-grid">
          <label className="field">
            <span className="field-label">Name *</span>
            <input className="input" name="name" required autoComplete="name" />
          </label>
          <label className="field">
            <span className="field-label">Phone *</span>
            <input className="input" name="phone" type="tel" required autoComplete="tel" placeholder="(443) 555-0123" />
          </label>
          <label className="field lead-wide">
            <span className="field-label">Email *</span>
            <input className="input" name="email" type="email" required autoComplete="email" />
          </label>
          <label className="field">
            <span className="field-label">Preferred pickup date</span>
            <input className="input" name="pickupDate" type="date" min={today()} max={maxDate} />
          </label>
          <label className="field">
            <span className="field-label">Guests</span>
            <input className="input" name="guests" type="number" min={1} max={10000} inputMode="numeric" />
          </label>
          <div className="field lead-wide">
            <span className="field-label">Your order</span>
            {cartItems.length ? (
              <ul className="lead-cart">
                {cartItems.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            ) : (
              <p className="lead-cart-empty">
                Add dishes above and they&apos;ll appear here — or just tell us what you&apos;d like below.
              </p>
            )}
          </div>
          <label className="field lead-wide">
            <span className="field-label">Anything else?</span>
            <textarea className="input" name="message" rows={3} placeholder="Extra dishes, pickup or DoorDash delivery…" />
          </label>
        </div>
      ) : kind === "catering" ? (
        <div className="lead-grid">
          <label className="field">
            <span className="field-label">Name *</span>
            <input className="input" name="name" required autoComplete="name" />
          </label>
          <label className="field">
            <span className="field-label">Email *</span>
            <input className="input" name="email" type="email" required autoComplete="email" />
          </label>
          <label className="field">
            <span className="field-label">Phone</span>
            <input className="input" name="phone" type="tel" autoComplete="tel" placeholder="(443) 555-0123" />
          </label>
          <label className="field">
            <span className="field-label">Event date</span>
            <input className="input" name="eventDate" type="date" min={today()} />
          </label>
          <label className="field">
            <span className="field-label">Guest count</span>
            <input className="input" name="guests" type="number" min={1} max={10000} inputMode="numeric" />
          </label>
          <label className="field">
            <span className="field-label">Event location</span>
            <input className="input" name="location" placeholder="City or ZIP" autoComplete="postal-code" />
          </label>
          <label className="field lead-wide">
            <span className="field-label">Tell us about it</span>
            <textarea className="input" name="message" rows={3} placeholder="Occasion, dishes you're interested in, pickup or delivery…" />
          </label>
        </div>
      ) : (
        <div className="lead-inline">
          {kind === "waitlist" && <input className="input" name="name" placeholder="First name" autoComplete="given-name" aria-label="First name" />}
          <input className="input" name="email" type="email" required placeholder="Email address" autoComplete="email" aria-label="Email address" />
        </div>
      )}

      {error && (
        <div className="notice error" role="alert">
          {error}{" "}
          <a href={fallback} style={{ textDecoration: "underline" }}>
            Email us instead
          </a>
        </div>
      )}

      <div className="lead-actions">
        <button className={`btn ${kind === "newsletter" ? "btn-gold" : "btn-primary"}`} type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : copy.button}
          {status !== "sending" && <Icon name="arrow" />}
        </button>
        {kind === "waitlist" || kind === "newsletter" ? (
          <p className="lead-fine">
            We&apos;ll only email about Sobajo. Unsubscribe anytime. <Link href="/privacy/">Privacy policy</Link>
          </p>
        ) : (
          <p className="lead-fine">
            No payment now — we&apos;ll confirm with you first. <Link href="/privacy/">Privacy policy</Link>
          </p>
        )}
      </div>
    </form>
  );
}
