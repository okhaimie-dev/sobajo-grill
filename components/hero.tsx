import Link from "next/link";
import { asset } from "@/lib/assets";
import { SITE } from "@/lib/site";
import { Icon, Stars } from "./icons";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* Real <img> (not a CSS background) so it can be the prioritized LCP element. */}
      <img
        className="hero-media"
        src={asset("/hero.jpg")}
        srcSet={`${asset("/hero-960.jpg")} 960w, ${asset("/hero.jpg")} 1920w`}
        sizes="100vw"
        alt="Sobajo beef brisket suya cooking over an open flame grill"
        width={1920}
        height={1280}
        fetchPriority="high"
      />
      <div className="container hero-content">
        <div className="eyebrow">
          <Icon name="flame" /> Baltimore Suya &amp; African Grill
        </div>
        <h1 id="hero-title">
          Fire. Flavor. <span className="accent">Friendship.</span>
        </h1>
        <p className="hero-lede">
          Fire-grilled beef brisket suya, Obasanjo Fire Chicken, smoky jollof and sweet
          plantains — West African heritage meets American barbecue, right here in Baltimore.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/menu/">
            Start your order <Icon name="arrow" />
          </Link>
          <Link className="btn btn-ghost" href="/catering/">
            Book catering
          </Link>
        </div>
        <div className="hero-meta">
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Stars value={SITE.googleRating} label={`Rated ${SITE.googleRating} out of 5 on Google`} />
            <strong>{SITE.googleRating}</strong> on Google
          </a>
          <span>
            <Icon name="truck" /> Pickup · Delivery · Catering
          </span>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" /> {SITE.address.street}, {SITE.address.city}
          </a>
        </div>
      </div>
    </section>
  );
}
