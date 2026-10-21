"use client";

import { useRef } from "react";
import type { GooglePlace, GoogleReview } from "@/lib/google-place";
import { SITE } from "@/lib/site";
import { Icon, Stars } from "./icons";
import { useGooglePlace } from "./use-google-place";

// Shown until live Google reviews load, and whenever the Places API isn't configured.
const FALLBACK = [
  "The best suya spot in Baltimore — fresh, flavorful, and always cooked just right.",
  "Made with love. The smoky jollof and flavorful meat are 10/10 every time.",
  "So good we ship it to family in Texas. Beck is the suya king.",
];

function GoogleReviewCard({ r }: { r: GoogleReview }) {
  return (
    <figure className="review">
      <Stars value={r.rating} label={`${r.rating} out of 5 stars`} />
      <blockquote className="review-text">“{r.text}”</blockquote>
      <figcaption className="review-author">
        {r.authorPhoto ? (
          <img src={r.authorPhoto} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="avatar-fallback" aria-hidden="true">
            {r.author.charAt(0)}
          </span>
        )}
        <span>
          {r.authorUri ? (
            <a href={r.authorUri} target="_blank" rel="noopener noreferrer">
              {r.author}
            </a>
          ) : (
            r.author
          )}
          <small>
            {r.relativeTime}
            {r.translated && " · Translated by Google"}
            {r.reviewUri && (
              <>
                {" · "}
                <a href={r.reviewUri} target="_blank" rel="noopener noreferrer">
                  View on Google Maps
                </a>
              </>
            )}
          </small>
        </span>
      </figcaption>
    </figure>
  );
}

function RatingSummary({ place }: { place: GooglePlace }) {
  if (!place.rating) return null;
  return (
    <div className="rating-summary">
      <strong>{place.rating.toFixed(1)}</strong>
      <div>
        <Stars value={place.rating} label={`Rated ${place.rating.toFixed(1)} out of 5 on Google`} />
        <span className="rating-count">
          {place.ratingCount?.toLocaleString("en-US")} reviews on <b>Google Maps</b>
        </span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const state = useGooglePlace(ref);
  const place = state.status === "ready" && state.place.reviews.length ? state.place : null;

  return (
    <section className="section section-alt" id="reviews" aria-labelledby="reviews-title" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Friends of Sobajo</div>
            <h2 className="section-title" id="reviews-title">
              What our guests say.
            </h2>
          </div>
          {place ? (
            <RatingSummary place={place} />
          ) : (
            <p className="section-lede">
              Real words from the friends and families who keep coming back for the flavor.
            </p>
          )}
        </div>

        <div className="review-grid" aria-busy={state.status === "loading"}>
          {place
            ? place.reviews.slice(0, 3).map((r) => <GoogleReviewCard key={r.author + r.publishTime} r={r} />)
            : FALLBACK.map((r) => (
                <figure className="review" key={r}>
                  <Stars />
                  <blockquote>“{r}”</blockquote>
                  <figcaption>Google review</figcaption>
                </figure>
              ))}
        </div>

        {place && (
          <div className="reviews-foot">
            <p className="google-attribution">
              Reviews from <b>Google Maps</b>, sorted by relevance by Google.
            </p>
            <div className="hero-actions" style={{ marginTop: 0 }}>
              {place.reviewsUri && (
                <a className="btn btn-ghost btn-sm" href={place.reviewsUri} target="_blank" rel="noopener noreferrer">
                  See all reviews <Icon name="arrow" />
                </a>
              )}
              {place.writeReviewUri && (
                <a className="btn btn-gold btn-sm" href={place.writeReviewUri} target="_blank" rel="noopener noreferrer">
                  <Icon name="star" /> Write a review
                </a>
              )}
            </div>
          </div>
        )}
        {!place && (
          <div className="reviews-foot">
            <p className="google-attribution">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
                Read more reviews on Google Maps
              </a>
            </p>
            {SITE.googleReviewUrl && (
              <a className="btn btn-gold btn-sm" href={SITE.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="star" /> Leave us a review
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
