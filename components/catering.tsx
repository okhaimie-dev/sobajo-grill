import { asset } from "@/lib/assets";

export default function Catering() {
  return (
    <section className="feature" id="catering">
      <div className="container feature-grid">
        <div>
          <div className="eyebrow" style={{ color: "#fff1b0" }}>
            Catering &amp; Celebrations
          </div>
          <h2>Bring the Sobajo experience to your event.</h2>
          <p>
            Perfect for offices, churches, birthdays, graduations, weddings, watch
            parties, and community events.
          </p>
          <div className="actions">
            <a className="btn gold" href="#catering-menu">
              Order Catering
            </a>
          </div>
        </div>
        <img src={asset("/catering.jpg")} alt="Catering spread" />
      </div>
    </section>
  );
}
