import type { ReactNode } from "react";
import { FAQS } from "@/lib/faq";
import { SITE } from "@/lib/site";
import { Icon } from "./icons";

export default function Faq({
  faqs = FAQS,
  title = (
    <>
      Questions, <em>answered.</em>
    </>
  ),
  intro = "Planning an event or a big order? Reach out — we're happy to help.",
}: {
  faqs?: { q: string; a: string }[];
  title?: ReactNode;
  intro?: string;
}) {
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
            <a href={`tel:${SITE.phoneE164}`}>
              <Icon name="phone" /> {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`}>
              <Icon name="mail" /> {SITE.email}
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" /> {SITE.address.street}, {SITE.address.city}, {SITE.address.region}
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
