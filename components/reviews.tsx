const REVIEWS = [
  "“The best suya spot in Baltimore—fresh, flavorful, and always cooked just right.”",
  "“Made with love. The smoky jollof and flavorful meat are 10/10 every time.”",
  "“So good we ship it to family in Texas. Beck is the suya king.”",
];

export default function Reviews() {
  return (
    <section id="reviews">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Friends of Sobajo</div>
            <h2>What our guests say.</h2>
          </div>
          <p>
            Real words from the friends and families who keep coming back for the
            flavor.
          </p>
        </div>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <div className="review" key={r}>
              <div className="stars">★★★★★</div>
              <p>{r}</p>
              <small>Google Review</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
