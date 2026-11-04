import type { ReactNode } from "react";
import { getSite } from "@/lib/content";
import { Icon } from "./icons";

export default async function Faq({
  faqs,
  title = (
    <>
      Questions, <em>answered.</em>
    </>
  ),
  intro = "Planning an event or a big order? Reach out — we're happy to help.",
}: {
  faqs: { q: string; a: string }[];
  title?: ReactNode;
  intro?: string;
}) {
  const site = await getSite();
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="faq-aside">
          <div className="eyebrow">Good to know</div>
          <h2 className="section-title" id="faq-title">
            {title}
          </h2>
          <p>{intro}</p>
          <div className="contact-list">
            <a href={`tel:${site.phoneE164}`}>
              <Icon name="phone" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`}>
              <Icon name="mail" /> {site.email}
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" /> {site.address.street}, {site.address.city}, {site.address.region}
            </a>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item" key={f.q} open={i === 0}>
              <summary>
                {f.q}
                <Icon name="plus" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
