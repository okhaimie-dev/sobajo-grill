import { Stars } from "./icons";

// TODO: replace with live Google reviews (name, date, link) once the Places API is wired up.
const REVIEWS = [
  "The best suya spot in Baltimore — fresh, flavorful, and always cooked just right.",
  "Made with love. The smoky jollof and flavorful meat are 10/10 every time.",
  "So good we ship it to family in Texas. Beck is the suya king.",
];

export default function Reviews() {
  return (
    <section className="section section-alt" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Friends of Sobajo</div>
            <h2 className="section-title" id="reviews-title">
              What our guests say.
            </h2>
          </div>
          <p className="section-lede">
            Real words from the friends and families who keep coming back for the flavor.
          </p>
        </div>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <figure className="review" key={r}>
              <Stars />
              <blockquote>“{r}”</blockquote>
              <figcaption>Google review</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
