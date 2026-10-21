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

## What's included

Same look & behavior as the demo HTML, rebuilt with React components:

- **Sections** — Hero, Signature Experiences, Full Menu, Catering, Delivery,
  Shipping (nationwide "coming soon"), Our Story, Reviews, CTA, Footer.
- **Full menu data** — all 29 demo items (bowls, fire-grilled collection,
  Ndokoti experience, catering trays, sides, drinks) in `lib/menu.ts`.
- **Ordering demo** — cart with item customization modal (variation, spice
  level, side, quantity, notes), pickup/delivery with $100 minimum + $20 fee,
  and "Continue to Square Checkout".
- **Brand assets** — the flame logo (extracted from the demo page) and the hero
  photo live in `public/`.

## Structure

```
app/
  layout.tsx         # metadata + CartProvider
  page.tsx           # section assembly
  globals.css        # demo styling ported verbatim
  icon.png           # favicon
components/
  cart-context.tsx   # cart state, pricing rules, checkout validation (client)
  nav.tsx hero.tsx experiences.tsx menu-sections.tsx catering.tsx
  delivery.tsx shipping.tsx story.tsx reviews.tsx cta.tsx footer.tsx
  item-modal.tsx cart-modal.tsx cart-fab.tsx
lib/
  menu.ts            # items, variations, prices, delivery rules
```

## Before going live

- Replace the placeholder Square link in **`lib/menu.ts` → `SQUARE_CHECKOUT_URL`**
  (also the Cash App "Start Order" link in `components/cta.tsx`).
- Menu card imagery is hot-linked from Unsplash URLs in `lib/menu.ts` — swap in
  real food photography when available.
- Delivery rules ($100 minimum, $20 fee) are constants in `lib/menu.ts`.
