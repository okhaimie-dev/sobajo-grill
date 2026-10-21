const EXPLORE_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#delivery", label: "Delivery" },
  { href: "#catering", label: "Catering" },
  { href: "#shipping", label: "Shipping" },
  { href: "#experiences", label: "Signature Experiences" },
  { href: "#story", label: "Our Story" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/logo.png" alt="Sobajo Grill logo" className="footer-logo" />
          <p>Friendship • Heritage • Flavor • Community</p>
          <p>
            7108 Liberty Road
            <br />
            Baltimore, MD 21207
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          {EXPLORE_LINKS.map((l) => (
            <span key={l.href}>
              <a href={l.href}>{l.label}</a>
              <br />
            </span>
          ))}
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            (443) 772-6661
            <br />
            info@sobajogrill.com
            <br />
            Instagram @sobajo_grill
            <br />
            TikTok @sobajogrill
          </p>
        </div>
      </div>
    </footer>
  );
}
