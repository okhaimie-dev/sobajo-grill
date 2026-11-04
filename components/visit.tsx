"use client";

import { useRef } from "react";
import type { Site } from "@/lib/site";
import { useSite } from "./site-context";
import { Icon } from "./icons";
import { useGooglePlace } from "./use-google-place";

const EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

/**
 * Map iframe. With an Embed API key (needs a Google Cloud billing account,
 * though the API itself is free) we use the official Embed API. Without one
 * we use Google Maps' keyless embed — no account, no card — which still
 * shows the live business card (rating + review count) and directions.
 */
function embedSrc(site: Site): string {
  const { street, city, region, postalCode } = site.address;
  const query = `${site.name}, ${street}, ${city}, ${region} ${postalCode}`;
  if (!EMBED_KEY) return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const q = PLACE_ID ? `place_id:${PLACE_ID}` : query;
  return `https://www.google.com/maps/embed/v1/place?key=${EMBED_KEY}&q=${encodeURIComponent(q)}`;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const to12h = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/** Weekly lines ("Monday: 12:00 PM – 8:00 PM") from the hours entered in Sanity → Business info. */
function siteHours(site: Site): string[] {
  if (!site.hours.length) return [];
  return DAY_ORDER.map((day) => {
    const slots = site.hours.filter((h) => h.days.includes(day));
    return `${day}: ${slots.length ? slots.map((h) => `${to12h(h.opens)} – ${to12h(h.closes)}`).join(", ") : "Closed"}`;
  });
}

export default function Visit() {
  const site = useSite();
  const ref = useRef<HTMLElement>(null);
  const state = useGooglePlace(ref);
  const place = state.status === "ready" ? state.place : null;
  const src = embedSrc(site);
  const { address } = site;
  const today = DAY_ORDER[(new Date().getDay() + 6) % 7];
  // Live Google hours when the Places API is on; otherwise the hours entered in Sanity.
  const hours = place?.hours.length ? place.hours : siteHours(site);

  return (
    <section className="section" id="visit" aria-labelledby="visit-title" ref={ref}>
      <div className="container visit-grid">
        <div className="visit-info">
          <div className="eyebrow">
            <Icon name="pin" /> Visit us
          </div>
          <h2 className="section-title" id="visit-title">
            Find the <em>fire.</em>
          </h2>
          <address className="visit-address">
            <strong>{site.name}</strong>
            {address.street}
            <br />
            {address.city}, {address.region} {address.postalCode}
          </address>

          <div className="visit-hours">
            <div className="visit-hours-head">
              <span className="field-label" style={{ margin: 0 }}>
                Hours
              </span>
              {place?.openNow !== undefined && (
                <span className={`open-badge${place.openNow ? " is-open" : ""}`}>
                  {place.openNow ? "Open now" : "Closed now"}
                </span>
              )}
            </div>
            {hours.length ? (
              <>
                <ul>
                  {hours.map((line) => {
                    const [day, ...rest] = line.split(": ");
                    return (
                      <li key={day} className={day === today ? "today" : undefined}>
                        <span>{day}</span>
                        <span>{rest.join(": ")}</span>
                      </li>
                    );
                  })}
                </ul>
                {place?.hours.length ? <small className="google-attribution">Hours from Google Maps</small> : null}
              </>
            ) : (
              <p className="visit-muted">
                {state.status === "loading" ? "Loading hours…" : `Call ${site.phone} for today's hours.`}
              </p>
            )}
          </div>

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={place?.directionsUri ?? site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="route" /> Get directions
            </a>
            <a className="btn btn-ghost" href={`tel:${site.phoneE164}`}>
              <Icon name="phone" /> {site.phone}
            </a>
          </div>
        </div>

        <div className="visit-map">
          <iframe
            src={src}
            title={`Map showing ${site.name} at ${address.street}, ${address.city}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
