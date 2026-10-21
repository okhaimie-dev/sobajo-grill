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

## Deploying

Production runs on **Vercel** (https://sobajo-grill.vercel.app), wired to this
GitHub repo: every push to `main` deploys to production, and every other
branch gets its own preview URL.

- Canonical/OG/sitemap URLs resolve from `NEXT_PUBLIC_SITE_URL`, falling back
  to Vercel's production domain (`lib/site.ts`). When `sobajogrill.com` is
  attached in Vercel, set `NEXT_PUBLIC_SITE_URL=https://sobajogrill.com`.
- `NEXT_PUBLIC_BASE_PATH` is still honored for sub-path hosts but is unset on
  Vercel. (The old GitHub Pages workflow has been retired.)

## What's included

- **Pages**
  - `/` — brand landing: hero, signature experiences, signature dishes
    (teaser → full menu), catering teaser, delivery, story, reviews, shipping,
    FAQ.
  - `/menu/` — full menu with a sticky scroll-synced category bar; each
    section picks a layout (`feature` · `cards` · `tiers` · `list`) in
    `lib/menu.ts`.
  - `/catering/` — campaign landing page: occasions, tray × pan-size pricing
    matrix, Ndokoti platters, how it works, catering FAQ, quote CTAs.
- **Ordering** — native `<dialog>` item customizer and cart sheet (pickup /
  delivery, $100 minimum progress, inline validation) → Square checkout. The
  cart lives in the root layout, so it follows the guest across pages, and
  persists in `localStorage`.
- **SEO** — per-page title/description/canonical/Open Graph via
  `lib/seo.ts → pageMetadata`; shared `/og.png` share card; `sitemap.xml`
  (all pages), `robots.txt`, manifest. JSON-LD: `Restaurant` + `WebSite`
  site-wide, `FAQPage` on home, `Menu` on /menu/, `Service` + `FAQPage` on
  /catering/, `BreadcrumbList` on sub-pages.

> Internal links must use `next/link` (`<Link href="/menu/">`) — it adds the
> GitHub Pages base path; a plain `<a href="/menu/">` would 404 there.

## Structure

```
app/
  layout.tsx          # fonts, site-wide metadata + Restaurant JSON-LD, nav/footer/cart shell
  page.tsx            # home
  menu/page.tsx       # full menu
  catering/page.tsx   # catering landing page
  globals.css         # design tokens + all component styles
  og.png/route.tsx    # 1200×630 social share card (build-time ImageResponse)
  sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
components/
  cart-context.tsx    # cart state, pricing rules, checkout validation (client)
  menu-items.tsx      # DishCard, FeatureDish, Tiers, ListRows (shared)
  menu-sections.tsx   # /menu/ body + scroll-spy tabs
  menu-highlights.tsx # home-page menu teaser
  catering-trays.tsx  # tray pricing matrix
  page-hero.tsx       # sub-page hero + breadcrumbs
  faq.tsx json-ld.tsx use-dialog.ts icons.tsx
  nav hero marquee experiences catering delivery story reviews shipping
  cta footer item-modal cart-modal cart-fab
lib/
  site.ts             # business facts: name, address, phone, socials, hours, SITE_URL
  seo.ts              # pageMetadata() + shared OG image
  menu.ts             # items, variations, prices, delivery rules
  faq.ts              # home + catering FAQ copy (rendered + JSON-LD)
  structured-data.ts  # schema.org JSON-LD builders
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
