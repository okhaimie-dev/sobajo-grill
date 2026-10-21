import { asset } from "@/lib/assets";
import { Icon, IconName } from "./icons";

const VALUES: { label: string; icon: IconName }[] = [
  { label: "Friendship", icon: "heart" },
  { label: "Heritage", icon: "globe" },
  { label: "Flavor", icon: "flame" },
  { label: "Community", icon: "users" },
];

export default function Story() {
  return (
    <section className="section" id="story" aria-labelledby="story-title">
      <div className="container story-grid">
        <div className="story-media">
          <img
            src={asset("/story.jpg")}
            alt="Friends sharing grilled meats and sides around the table"
            loading="lazy"
            decoding="async"
            width={1200}
            height={800}
          />
        </div>
        <div className="story-copy">
          <div className="eyebrow">Our Story</div>
          <h2 id="story-title">Sobajo means friend.</h2>
          <p>
            Born in the U.S. and raised in Baltimore from the heritage of a Cameroonian father and a
            Nigerian mother, Sobajo Grill brings African flavor, American barbecue and Baltimore
            character together over the fire.
          </p>
          <p>
            Our food is about the people who gather around it — family, customers, community and
            friends.
          </p>
          <blockquote className="quote">“Come as a customer. Leave as a friend.”</blockquote>
          <ul className="values">
            {VALUES.map((v) => (
              <li key={v.label}>
                <Icon name={v.icon} />
                {v.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
