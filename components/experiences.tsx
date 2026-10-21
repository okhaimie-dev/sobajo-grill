const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

const EXPERIENCES = [
  {
    title: "Chef's Recommendation",
    text: "A curated introduction to the flavors that best represent Sobajo Grill—selected by the chef for guests who want to experience our signature style.",
    badge: "Chef's Pick",
    href: "#menu",
    cta: "Explore Menu",
    ctaClass: "btn red",
    image: U("photo-1504674900247-0877df9cc836"),
  },
  {
    title: "Ndokoti Experience",
    text: "Named after Carrefour Ndokoti in Douala, Cameroon—a crossroads where roads, journeys, people, and communities meet. At Sobajo, Ndokoti represents the table as a meeting place for food, culture, friendship, and community.",
    badge: "Classic • Deluxe • Supreme • Royal",
    href: "#ndokoti",
    cta: "View Levels",
    ctaClass: "btn gold",
    image: U("photo-1555244162-803834f70033"),
  },
  {
    title: "Game Night Pack",
    text: "Built for game nights, movie nights, friends, and family sharing.",
    badge: "Built for Sharing",
    href: "#menu",
    cta: "Explore Menu",
    ctaClass: "btn red",
    image: U("photo-1552566626-52f8b828add9"),
  },
  {
    title: "Friendship Feast",
    text: "Our celebration experience for family gatherings and special occasions.",
    badge: "Celebrate Together",
    href: "#catering",
    cta: "Plan a Feast",
    ctaClass: "btn red",
    image: U("photo-1515003197210-e0cd71810b5f"),
  },
];

export default function Experiences() {
  return (
    <section id="experiences" style={{ background: "#0b0b0b" }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Sobajo Signature Experiences</div>
            <h2>More than a meal. Choose your experience.</h2>
          </div>
          <p>Built for first-time guests, sharing, game nights, and celebrations.</p>
        </div>
        <div className="grid">
          {EXPERIENCES.map((x) => (
            <article className="card" key={x.title}>
              <div
                className="card-img"
                style={{ backgroundImage: `url('${x.image}')` }}
              />
              <div className="card-body">
                <h4>{x.title}</h4>
                <p>{x.text}</p>
                <div className="card-row">
                  <span className="price">{x.badge}</span>
                  <a className={x.ctaClass} href={x.href}>
                    {x.cta}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
