import Link from "next/link";
import { asset } from "@/lib/assets";
import { getSite } from "@/lib/content";
import { Icon } from "./icons";
import LeadForm from "./lead-form";

const EXPLORE_LINKS = [
  { href: "/menu/", label: "Full menu" },
  { href: "/menu/#ndokoti", label: "Ndokoti platters" },
  { href: "/catering/", label: "Catering" },
  { href: "/#delivery", label: "Delivery" },
  { href: "/#shipping", label: "Nationwide shipping" },
  { href: "/#story", label: "Our story" },
  { href: "/#visit", label: "Hours & directions" },
  { href: "/#faq", label: "FAQ" },
];

export default async function Footer() {
  const site = await getSite();
  const { address, socials } = site;
  return (
    <footer className="footer">
      <div className="container newsletter">
        <div>
          <h2 className="newsletter-title">Join the Sobajo family.</h2>
          <p>Specials, new drops and first dibs on shipping — straight to your inbox.</p>
        </div>
        <LeadForm kind="newsletter" compact />
      </div>
      <div className="container footer-grid">
        <div>
          <img src={asset("/logo.png")} alt="Sobajo Grill" className="footer-logo" width={480} height={325} loading="lazy" />
          <p style={{ marginTop: 16, maxWidth: 320 }}>
            Baltimore suya and African barbecue rooted in friendship, heritage, flavor and
            community.
          </p>
          <div className="socials">
            <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${socials.instagram.handle}`}>
              <Icon name="instagram" />
            </a>
            <a href={socials.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label={`TikTok ${socials.tiktok.handle}`}>
              <Icon name="tiktok" />
            </a>
          </div>
        </div>
        <div>
          <h2>Visit</h2>
          <address>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
              {address.street}
              <br />
              {address.city}, {address.region} {address.postalCode}
            </a>
            <a href={`tel:${site.phoneE164}`}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            {EXPLORE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Follow</h2>
          <ul>
            <li>
              <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {socials.instagram.handle}
              </a>
            </li>
            <li>
              <a href={socials.tiktok.url} target="_blank" rel="noopener noreferrer">
                TikTok {socials.tiktok.handle}
              </a>
            </li>
            <li>
              <a href={site.cashAppUrl} target="_blank" rel="noopener noreferrer">
                Cash App $sobajogrillmd
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Sobajo Grill. All rights reserved.</span>
        <span>
          <Link href="/privacy/">Privacy policy</Link> · Sobajo means friend.
        </span>
      </div>
    </footer>
  );
}
