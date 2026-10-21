# Sobajo Grill — Next.js Site

A Next.js (App Router, TypeScript) port of the **"Branded Full Menu & Ordering Demo"**
page for Sobajo Grill — the Baltimore barbecue & suya brand
("Fire. Flavor. Friendship." / *Sobajo means friend*).

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start   # production
```

## Deploying to GitHub Pages

The site exports fully statically (`output: "export"`) and deploys from
`main` via `.github/workflows/deploy.yml`:

https://okhaimie-dev.github.io/sobajo-grill/

- CI bakes asset links under the repo sub-path with
  `NEXT_PUBLIC_BASE_PATH=/sobajo-grill` (see `next.config.ts` and
  `lib/assets.ts`). Any other sub-path host can reuse the same env var.
- Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
  is selected automatically by this workflow's first run.

## What's included

- **Sections** — Hero, Signature Experiences, Full Menu (sticky scroll-synced
  category bar), Catering, Delivery, Our Story, Reviews, Shipping ("coming
  soon" + waitlist), FAQ, CTA, Footer.
- **Menu data** — all 29 items in `lib/menu.ts`; each section picks a layout
  (`feature` · `cards` · `tiers` · `list`).
- **Ordering** — native `<dialog>` item customizer (size/spice/side chips,
  quantity stepper, live price) and cart sheet (pickup/delivery toggle, $100
  delivery minimum with progress, inline validation) → Square checkout. Cart
  persists in `localStorage`.
- **SEO** — page metadata, canonical, Open Graph/Twitter card (`/og.png`,
  generated at build), `sitemap.xml`, `robots.txt`, web manifest, and
  schema.org JSON-LD (`Restaurant` + full `Menu` with prices, `WebSite`,
  `FAQPage`).

## Structure

```
app/
  layout.tsx          # fonts, metadata, viewport, JSON-LD
  page.tsx            # section assembly
  globals.css         # design tokens + all component styles
  og.png/route.tsx    # 1200×630 social share card (build-time ImageResponse)
  sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
components/
  cart-context.tsx    # cart state, pricing rules, checkout validation (client)
  use-dialog.ts       # React state ↔ native <dialog>
  icons.tsx           # inline SVG icon set
  nav hero marquee experiences menu-sections catering delivery story
  reviews shipping faq cta footer item-modal cart-modal cart-fab
lib/
  site.ts             # business facts: name, address, phone, socials, hours, SITE_URL
  menu.ts             # items, variations, prices, delivery rules
  faq.ts              # FAQ copy (rendered + FAQPage JSON-LD)
  structured-data.ts  # schema.org JSON-LD builder
```

## Before going live

- **Business facts live in `lib/site.ts`** — fill in `hours` (feeds Google's
  "Open now"); confirm phone, email and social URLs.
- **Custom domain** — point `sobajogrill.com` at Pages, then set
  `NEXT_PUBLIC_SITE_URL=https://sobajogrill.com` and drop
  `NEXT_PUBLIC_BASE_PATH` in the workflow. `robots.txt` is only honored at a
  domain root, and the canonical/OG URLs should be the brand domain.
- Replace the placeholder Square link in **`lib/menu.ts` → `SQUARE_CHECKOUT_URL`**.
- Menu card photos are Unsplash placeholders (`lib/menu.ts`) — swap in real
  Sobajo food photography; `public/hero.jpg` is the only real dish photo today.
- Reviews in `components/reviews.tsx` are static — wire to Google reviews.
