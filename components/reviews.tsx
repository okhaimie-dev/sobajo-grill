"use client";

import { useRef } from "react";
import type { GooglePlace, GoogleReview } from "@/lib/google-place";
import { CURATED_REVIEWS, CuratedReview } from "@/lib/reviews";
import { SITE } from "@/lib/site";
import { Icon, Stars } from "./icons";
import { useGooglePlace } from "./use-google-place";

/** Hand-picked review (lib/reviews.ts) — "Google review" only when it links to the original. */
function CuratedReviewCard({ r }: { r: CuratedReview }) {
  const source = r.url ? "Google review" : "Customer review";
  return (
    <figure className="review">
      {r.rating ? <Stars value={r.rating} /> : null}
      <blockquote className="review-text">“{r.text}”</blockquote>
      <figcaption className="review-author">
        {r.author && (
          <span className="avatar-fallback" aria-hidden="true">
            {r.author.charAt(0)}
          </span>
        )}
        <span>
          {r.author ?? source}
          <small>
            {[r.author ? source : null, r.date].filter(Boolean).join(" · ")}
            {r.url && (
              <>
                {r.author || r.date ? " · " : ""}
                <a href={r.url} target="_blank" rel="noopener noreferrer">
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
            <a className="rating-summary" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
              <strong>{SITE.googleRating.toFixed(1)}</strong>
              <div>
                <Stars value={SITE.googleRating} label={`Rated ${SITE.googleRating} out of 5 on Google`} />
                <span className="rating-count">
                  on <b>Google</b> · read our reviews
                </span>
              </div>
            </a>
          )}
        </div>

        <div className="review-grid" aria-busy={state.status === "loading"}>
          {place
            ? place.reviews.slice(0, 3).map((r) => <GoogleReviewCard key={r.author + r.publishTime} r={r} />)
            : CURATED_REVIEWS.map((r) => <CuratedReviewCard key={r.text} r={r} />)}
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
