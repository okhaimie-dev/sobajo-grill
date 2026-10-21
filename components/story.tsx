import { asset } from "@/lib/assets";

export default function Story() {
  return (
    <section id="story">
      <div className="container story-grid">
        <img src={asset("/story.jpg")} alt="Food gathering" />
        <div>
          <div className="eyebrow">Our Story</div>
          <h2
            style={{
              fontSize: "clamp(2.4rem,5vw,4rem)",
              lineHeight: 1,
              margin: "12px 0 18px",
            }}
          >
            Sobajo means friend.
          </h2>
          <p>
            Born in the U.S. and raised in Baltimore from the heritage of a
            Cameroonian father and a Nigerian mother, Sobajo Grill brings African
            flavor, American barbecue, and Baltimore character together over the
            fire. Sobajo means Friend—because our food is about the people who
            gather around it: family, customers, community, and friends.
          </p>
          <div className="quote">
            “Come as a customer. Leave as a friend (Sobajo).”
          </div>
        </div>
      </div>
    </section>
  );
}
