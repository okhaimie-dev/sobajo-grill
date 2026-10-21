import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import JsonLd from "./json-ld";

/** Compact hero for sub-pages: breadcrumb trail (visible + BreadcrumbList JSON-LD), h1, lede, actions. */
export default function PageHero({
  crumb,
  path,
  eyebrow,
  title,
  lede,
  image,
  children,
}: {
  crumb: string;
  path: string;
  eyebrow: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  image?: { src: string; alt: string };
  children?: ReactNode;
}) {
  return (
    <section className={`page-hero${image ? " has-media" : ""}`} aria-labelledby="page-title">
      {image && <img className="page-hero-media" src={image.src} alt={image.alt} width={1200} height={800} fetchPriority="high" />}
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: crumb, path }])} />
      <div className="container page-hero-content">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <div className="eyebrow">{eyebrow}</div>
        <h1 id="page-title">{title}</h1>
        <p className="hero-lede">{lede}</p>
        {children}
      </div>
    </section>
  );
}
