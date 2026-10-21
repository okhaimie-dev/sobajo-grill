import Link from "next/link";
import { asset } from "@/lib/assets";
import { SITE } from "@/lib/site";
import { Icon } from "./icons";

const EXPLORE_LINKS = [
  { href: "/menu/", label: "Full menu" },
  { href: "/menu/#ndokoti", label: "Ndokoti platters" },
  { href: "/catering/", label: "Catering" },
  { href: "/#delivery", label: "Delivery" },
  { href: "/#shipping", label: "Nationwide shipping" },
  { href: "/#story", label: "Our story" },
  { href: "/#faq", label: "FAQ" },
];

export default function Footer() {
  const { address, socials } = SITE;
  return (
    <footer className="footer">
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
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
              {address.street}
              <br />
              {address.city}, {address.region} {address.postalCode}
            </a>
            <a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
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
            {SITE.doordashUrl && (
              <li>
                <a href={SITE.doordashUrl} target="_blank" rel="noopener noreferrer">
                  Order on DoorDash
                </a>
              </li>
            )}
            <li>
              <a href={SITE.cashAppUrl} target="_blank" rel="noopener noreferrer">
                Cash App $sobajogrillmd
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Sobajo Grill. All rights reserved.</span>
        <span>Sobajo means friend.</span>
      </div>
    </footer>
  );
}
