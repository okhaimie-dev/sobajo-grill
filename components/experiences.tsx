import { asset } from "@/lib/assets";
import { Icon } from "./icons";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=75`;

const EXPERIENCES = [
  {
    title: "Chef's Recommendation",
    text: "A curated introduction to the flavors that best represent Sobajo Grill — selected by the chef for first-time guests.",
    badge: "Chef's Pick",
    href: "#bowls",
    cta: "Start with the signature",
    image: U("photo-1529193591184-b1d58069ecdd"),
    alt: "Sliced fire-grilled beef brisket",
  },
  {
    title: "Ndokoti Experience",
    text: "Named after Carrefour Ndokoti in Douala, Cameroon — the table as a crossroads for food, culture and friendship.",
    badge: "Classic → Royal",
    href: "#ndokoti",
    cta: "Compare the levels",
    image: asset("/story.jpg"),
    alt: "A shared spread of grilled meats and sides",
  },
  {
    title: "Game Night Pack",
    text: "Fire wings, grilled chicken and sides built for game nights, movie nights, friends and family sharing.",
    badge: "Built for Sharing",
    href: "#grill",
    cta: "Build your spread",
    image: U("photo-1562967914-608f82629710"),
    alt: "A platter of crispy wings with dipping sauce",
  },
  {
    title: "Friendship Feast",
    text: "Our celebration experience for family gatherings, birthdays and special occasions.",
    badge: "Celebrate Together",
    href: "#catering",
    cta: "Plan a feast",
    image: asset("/catering.jpg"),
    alt: "A catering buffet of trays and chafing dishes",
  },
];

export default function Experiences() {
  return (
    <section className="section" id="experiences" aria-labelledby="experiences-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Sobajo Signature Experiences</div>
            <h2 className="section-title" id="experiences-title">
              More than a meal. <em>Choose your experience.</em>
            </h2>
          </div>
          <p className="section-lede">
            Whether it&apos;s your first taste of suya or you&apos;re feeding the whole family,
            start here.
          </p>
        </div>
        <div className="exp-grid">
          {EXPERIENCES.map((x) => (
            <article className="exp-card" key={x.title}>
              <img src={x.image} alt={x.alt} loading="lazy" decoding="async" width={800} height={1000} />
              <span className="chip chip-solid">{x.badge}</span>
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <a className="text-link" href={x.href}>
                {x.cta} <Icon name="arrow" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
