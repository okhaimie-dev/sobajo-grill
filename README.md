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

## Marketing & leads

- **Lead capture** — catering quote form (`/catering/#quote`), shipping
  waitlist, and footer newsletter all post to **`/api/leads`**
  (`app/api/leads/route.ts`): validation, honeypot, per-IP rate limit.
- **CRM** — leads go to **Twenty** (`lib/leads/twenty.ts`): the Person is
  found-or-created by email, a Note records the details + attribution, and
  catering requests also open an **Opportunity** in the pipeline.
- **Notifications** — `LEAD_WEBHOOK_URL` pings Slack/Discord/Zapier on every
  lead, and doubles as the fallback if the CRM write fails.
- **Attribution** — `lib/attribution.ts` stores first- and last-touch UTM
  tags, Google/Meta click IDs, referrer and landing page; every lead carries it.
- **Analytics** — GA4 + Meta Pixel load only when their IDs are set
  (`components/analytics.tsx`); `lib/analytics.ts → track()` sends
  `view_item`, `add_to_cart`, `begin_checkout`, `generate_lead`, `sign_up`.

- **Google** — live rating, reviews and hours (`lib/google-place.ts` →
  `/api/google-place`) and a Maps Embed map (`components/visit.tsx`). Google's
  terms forbid caching reviews/ratings/hours, so they're fetched per visit —
  but only when a visitor scrolls near the reviews/visit sections, once per
  page view, rate-limited per IP. Falls back to the built-in quotes and a
  directions link when keys are unset.

- **Reviews** — "What our guests say" shows live Google reviews when the
  Places API is enabled, otherwise the hand-picked reviews in
  `lib/reviews.ts`. Paste real Google reviews there (author, rating, link);
  only entries with a Google link are labeled "Google review".

- **Campaigns** — each entry in `lib/campaigns.ts` becomes a landing page at
  `/<slug>/` (own SEO title, share image `/<slug>/og.png`, sitemap entry,
  FAQ JSON-LD) plus a site-wide announcement bar during its banner window.
  Featured dishes are referenced by menu name (prices stay in sync; a typo
  fails the build). Pages carry a **pre-order request** form → `/api/leads`
  (kind `preorder`) → CRM Opportunity with the guest's cart. Pages
  re-render hourly, so the bar switches on/off by date without a deploy.
  Launch ads with tagged links, e.g.
  `/thanksgiving/?utm_source=instagram&utm_medium=paid_social&utm_campaign=thanksgiving-2026`.
- **Privacy policy** — `/privacy/`, linked from the footer and every form.
  Update it when a new tool is added; have the owner review it.

Configuration lives in environment variables — see `.env.example`. With no
CRM or webhook configured, production refuses lead submissions (503) and the
forms offer an email fallback rather than silently dropping leads.

## Structure

```
app/
  layout.tsx          # fonts, site-wide metadata + Restaurant JSON-LD, nav/footer/cart shell
  page.tsx            # home
  menu/page.tsx       # full menu
  catering/page.tsx   # catering landing page
  [campaign]/         # campaign landing pages + per-campaign og.png (from lib/campaigns.ts)
  privacy/page.tsx    # privacy policy
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
app/api/leads/route.ts   # lead intake → CRM + notification
app/api/google-place/route.ts # live Google rating/reviews/hours (never cached)
lib/
  leads/              # schema.ts (validation), twenty.ts (CRM), notify.ts (webhook)
  attribution.ts      # first/last-touch UTM + click-ID capture
  analytics.ts        # track() → GA4 + Meta Pixel
  site.ts             # business facts: name, address, phone, socials, hours, SITE_URL
  seo.ts              # pageMetadata() + shared OG image
  campaigns.ts        # marketing campaigns (Thanksgiving…)
  og.tsx              # share-card renderer
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
