"use client";

import { useRef } from "react";
import { SITE } from "@/lib/site";
import { Icon } from "./icons";
import { useGooglePlace } from "./use-google-place";

const EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

/** Maps Embed API (free, unlimited). Exact pin with a place ID, else a name + address search. */
function embedSrc(): string | null {
  if (!EMBED_KEY) return null;
  const { street, city, region, postalCode } = SITE.address;
  const q = PLACE_ID ? `place_id:${PLACE_ID}` : `${SITE.name}, ${street}, ${city}, ${region} ${postalCode}`;
  return `https://www.google.com/maps/embed/v1/place?key=${EMBED_KEY}&q=${encodeURIComponent(q)}`;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Visit() {
  const ref = useRef<HTMLElement>(null);
  const state = useGooglePlace(ref);
  const place = state.status === "ready" ? state.place : null;
  const src = embedSrc();
  const { address } = SITE;
  const today = DAY_ORDER[(new Date().getDay() + 6) % 7];

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
            <strong>{SITE.name}</strong>
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
            {place?.hours.length ? (
              <>
                <ul>
                  {place.hours.map((line) => {
                    const [day, ...rest] = line.split(": ");
                    return (
                      <li key={day} className={day === today ? "today" : undefined}>
                        <span>{day}</span>
                        <span>{rest.join(": ")}</span>
                      </li>
                    );
                  })}
                </ul>
                <small className="google-attribution">Hours from Google Maps</small>
              </>
            ) : (
              <p className="visit-muted">
                {state.status === "loading" ? "Loading hours…" : `Call ${SITE.phone} for today's hours.`}
              </p>
            )}
          </div>

          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={place?.directionsUri ?? SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="route" /> Get directions
            </a>
            <a className="btn btn-ghost" href={`tel:${SITE.phoneE164}`}>
              <Icon name="phone" /> {SITE.phone}
            </a>
          </div>
        </div>

        <div className="visit-map">
          {src ? (
            <iframe
              src={src}
              title={`Map showing ${SITE.name} at ${address.street}, ${address.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <a className="map-placeholder" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" />
              <strong>
                {address.street}, {address.city}
              </strong>
              <span>Open in Google Maps</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
