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

## Content (Sanity CMS)

Menu, prices, sold-out status, photos, campaigns, FAQs and business info
(contact, hours, links, rating, SEO copy) are edited in **Sanity Studio** at
**`/studio`** (e.g. https://sobajo-grill.vercel.app/studio). Staff sign in
with their Sanity account; invite them at sanity.io/manage → project
`n4i8duqa` → Members (role **Editor**, or **Contributor** for draft-only).

- **How changes go live** — publishing fires a Sanity webhook →
  `/api/revalidate` → the cached content is expired and the next visit shows
  the change (seconds). Without the webhook, changes still appear within an
  hour.
- **Sold out / Coming soon** — set an item's *Status* (Available · Sold out
  · Coming soon); the *Sold out & coming soon* list in the Studio sidebar
  shows them all. Such items stay on the menu with that label, and checkout
  refuses them.
- **Prices** — checkout always reprices the cart on the server from the same
  Sanity menu the pages render. If Sanity can't be reached, checkout says
  "try again" rather than charging a stale price.
- **Code map** — schemas in `sanity/schemaTypes/`, sidebar in
  `sanity/structure.ts`, Studio config `sanity.config.ts`, loader
  `lib/content.ts` (one GROQ query, cache tag `sanity`). Section anchors
  `bowls`, `grill`, `ndokoti` and `catering-menu` are referenced by the home,
  catering and campaign pages — don't change those anchors in the Studio.
- **Seed / fallback** — the data in `lib/menu.ts`, `lib/campaigns.ts`,
  `lib/faq.ts`, `lib/site.ts` is what `npm run sanity:import` copied into
  Sanity, and what the site uses when `NEXT_PUBLIC_SANITY_PROJECT_ID` is
  unset. It is **not** kept in sync — Sanity is the source of truth.
  `npm run sanity:import` only creates missing documents; `-- --force`
  overwrites Sanity with the seed.

**One-time Sanity setup** (sanity.io/manage → project `n4i8duqa` → API):

1. **CORS origins** → add `http://localhost:3000`,
   `https://sobajo-grill.vercel.app` (and `https://sobajogrill.com` later),
   each with **Allow credentials** ticked — needed for the Studio to log in.
2. **Webhooks** → Create: URL `https://sobajo-grill.vercel.app/api/revalidate/`
   (keep the trailing slash — without it the site answers with a redirect),
   dataset `production`, trigger on Create/Update/Delete, filter empty,
   HTTP method POST, **Secret** = the value of `SANITY_REVALIDATE_SECRET`.
3. **Vercel** → Settings → Environment Variables: add
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
   `NEXT_PUBLIC_SANITY_API_VERSION` and `SANITY_REVALIDATE_SECRET`. Not the
   write token — the site only reads public content.

### Limited campaign items (Thanksgiving turkeys)

- **Order limit** on a menu item (e.g. 100) stops sales once that many are
  paid. Paid quantities are counted from Square orders since the campaign's
  banner start (`lib/stock.ts`); guests never see the number — only
  *Selling fast* (60%), *Almost gone* (90%), then *Sold out* with a
  **waitlist** form (→ CRM). Raise the limit in the Studio to reopen sales.
  Two guests paying at the same moment at the limit can land 1–2 over.
- **Customers pay online** on a campaign → guests add the dish to the cart,
  must pick one of the campaign's pickup days, and pay on Square. The
  campaign page shows "How it works" instead of a pre-order request form.
- **Square webhook** → `/api/square-webhook/` (subscription
  `payment.updated`, signature key in `SQUARE_WEBHOOK_SIGNATURE_KEY`): each
  completed payment for a campaign item refreshes the count and records a
  "<Campaign> order · PAID" opportunity in Twenty (customer, pickup day,
  items, Square order ref) — once per order, even when Square retries.

## What's included

- **Pages**
  - `/` — brand landing: hero, signature experiences, signature dishes
    (teaser → full menu), catering teaser, delivery, story, reviews, shipping,
    FAQ.
  - `/menu/` — full menu with a sticky scroll-synced category bar; each
    section picks a layout (`feature` · `cards` · `tiers` · `list`) in the
    Studio.
  - `/catering/` — campaign landing page: occasions, tray × pan-size pricing
    matrix, Ndokoti platters, how it works, catering FAQ, quote CTAs.
- **Ordering** — native `<dialog>` item customizer and cart sheet (pickup /
  in-house delivery — minimum, flat fee and area set in the Studio under
  Business info → Delivery, enforced again by checkout, the fee added as its
  own Square line — inline validation) → Square hosted
  checkout: `POST /api/checkout` reprices the cart from the Sanity menu and
  creates a one-time Square payment link (`lib/square.ts`). The
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

- **Campaigns** — each campaign in the Studio becomes a landing page at
  `/<slug>/` (own SEO title, share image `/<slug>/og.png`, sitemap entry,
  FAQ JSON-LD) plus a site-wide announcement bar during its banner window.
  Featured dishes are references to menu items, so prices stay in sync; a
  new campaign gets its page without a deploy. Pages carry a **pre-order request** form → `/api/leads`
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
  layout.tsx          # <html>, fonts, site-wide metadata (shared with /studio)
  (site)/layout.tsx   # Restaurant JSON-LD, nav/footer/cart shell, SiteProvider
  (site)/page.tsx     # home
  (site)/menu/        # full menu
  (site)/catering/    # catering landing page
  (site)/[campaign]/  # campaign landing pages + per-campaign og.png (from Sanity)
  (site)/privacy/     # privacy policy
  studio/[[...tool]]/ # Sanity Studio
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
app/api/revalidate/route.ts # Sanity publish webhook → cache refresh
sanity/               # schemaTypes/ (content model), structure.ts (Studio sidebar), env.ts
scripts/sanity-import.ts # one-time seed → Sanity import
app/api/google-place/route.ts # live Google rating/reviews/hours (never cached)
lib/
  content.ts          # Sanity → MenuItem/Campaign/Site/FAQ loader (cached, tag "sanity")
  sanity.ts           # Sanity client + image URLs
  leads/              # schema.ts (validation), twenty.ts (CRM), notify.ts (webhook)
  attribution.ts      # first/last-touch UTM + click-ID capture
  analytics.ts        # track() → GA4 + Meta Pixel
  site.ts             # Site type, fixed brand facts, SITE_URL (+ seed business info)
  seo.ts              # pageMetadata() + shared OG image
  campaigns.ts        # Campaign type + helpers (+ seed: Thanksgiving)
  og.tsx              # share-card renderer
  menu.ts             # MenuItem/MenuSection types, side choices (+ seed menu)
  faq.ts              # seed FAQ copy (live FAQs are in Sanity)
  structured-data.ts  # schema.org JSON-LD builders
```

## Before going live

- **Business info lives in the Studio** (`/studio` → Business info) — fill
  in opening hours (feeds Google's "Open now"); confirm phone, email and
  social links.
- **Custom domain** — point `sobajogrill.com` at Pages, then set
  `NEXT_PUBLIC_SITE_URL=https://sobajogrill.com` and drop
  `NEXT_PUBLIC_BASE_PATH` in the workflow. `robots.txt` is only honored at a
  domain root, and the canonical/OG URLs should be the brand domain.
- **Square** — set `SQUARE_ACCESS_TOKEN` / `SQUARE_LOCATION_ID` (see
  `.env.example`). Sandbox by default: pay with test card `4111 1111 1111 1111`,
  any future expiry, CVV `111`, any ZIP. Set `SQUARE_ENVIRONMENT=production`
  with production credentials to go live. Orders show up in the Square
  Dashboard with pickup/delivery details in the payment note.
- Menu card photos are Unsplash placeholders (imported into Sanity) — upload
  real Sobajo food photography per item in the Studio; the brisket suya
  (`hero.jpg`) is the only real dish photo today.
- Reviews in `components/reviews.tsx` are static — wire to Google reviews.
