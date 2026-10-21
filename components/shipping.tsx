const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

const PRODUCTS = [
  {
    name: "Beef Brisket Suya Packs",
    text: "Vacuum-sealed packs prepared for safe nationwide delivery.",
    image: U("photo-1529042410759-befb1204b468"),
  },
  {
    name: "Sobajo Suya Spice",
    text: "Authentic Sobajo seasoning for grilling and cooking at home.",
    image: U("photo-1596040033229-a9821ebd058d"),
  },
  {
    name: "Sobajo Hot Sauce",
    text: "Our bold house heat bottled for customers nationwide.",
    image: U("photo-1585620385456-4759f9b5c7d9"),
  },
  {
    name: "Sobajo Gift Packages",
    text: "Curated boxes for birthdays, holidays, celebrations, and family surprises.",
    image: U("photo-1549465220-1a8b9238cd48"),
  },
];

export default function Shipping() {
  return (
    <section id="shipping" style={{ background: "#0d0d0d" }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Shipping Beyond Baltimore</div>
            <h2>Send the Sobajo experience nationwide.</h2>
          </div>
          <p>
            Share Sobajo with family and friends (Sobajo) across the country
            through carefully packaged products and trackable shipping.
          </p>
        </div>

        <div className="grid">
          {PRODUCTS.map((p) => (
            <article className="card" key={p.name}>
              <div className="card-img" style={{ backgroundImage: `url('${p.image}')` }} />
              <div className="card-body">
                <h4>{p.name}</h4>
                <p>{p.text}</p>
                <div className="card-row">
                  <span className="price">Coming Soon</span>
                  <a className="btn dark" href="#shipping-process">
                    Learn More
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="delivery-grid" id="shipping-process" style={{ marginTop: 28 }}>
          <div className="panel">
            <h3>How Shipping Will Work</h3>
            <div className="info-row">
              <span>1. Choose products</span>
              <strong>Select package size</strong>
            </div>
            <div className="info-row">
              <span>2. Enter address</span>
              <strong>Recipient and date</strong>
            </div>
            <div className="info-row">
              <span>3. Pay securely</span>
              <strong>Square checkout</strong>
            </div>
            <div className="info-row">
              <span>4. Track shipment</span>
              <strong>Shippo with USPS or UPS</strong>
            </div>
          </div>
          <div className="panel">
            <h3>Shipping Launch Plan</h3>
            <p>
              Shelf-stable products such as suya spice and bottled sauce can launch
              first. Perishable products will launch only after cold-chain
              packaging, labeling, and carrier requirements are confirmed.
            </p>
            <div className="notice" style={{ display: "block" }}>
              Nationwide shipping is shown as “Coming Soon” until the fulfillment
              process is fully approved and tested.
            </div>
            <div className="actions">
              <a
                className="btn red"
                href="mailto:info@sobajogrill.com?subject=Sobajo%20Shipping%20Waitlist"
              >
                Join the Shipping List
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
