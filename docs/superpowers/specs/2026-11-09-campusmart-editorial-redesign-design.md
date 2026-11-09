# CampusMart "Editorial Premium" Redesign — Design

**Date:** 2026-11-09
**Status:** Approved by user
**Scope:** Customer-facing pages + admin panel (shared design tokens)

## Intent

The current UI relies on two competing strong colors (emerald + orange), large
radii, and a weak title/price/CTA hierarchy. The goal is a catalog-editorial
language: cream canvas, ink text, one terracotta accent, serif display headings,
and a more generous layout. Target impression: a curated store, not a student
template.

## Goals

- Replace the palette and typography through tokens in one place (`src/index.css`).
- Fix hierarchy: title → price → CTA → metadata.
- Consistent, roomier layout (container, spacing, grid).
- Light and dark modes both mature; admin shares the same language as the storefront.

## Non-goals

- No new features, backend, or dependencies.
- No route, state (`StoreContext`), or data-shape (`catalog.ts`) changes.
- Do not delete unused legacy page files (`Home.tsx`, `Cart.tsx`, `Users.tsx`,
  `AdminDashboard.tsx`, etc.); only flag them.

## Anti-goals (failure conditions)

- Multicolor gradients, more than one accent color.
- Flattening every corner to 4px so the UI feels rigid.
- Admin looking like a generic dashboard template.

## Constraints

React 19 + Vite + Tailwind v4 (tokens via `@theme`), lucide-react, no shadcn.
Fonts from Google Fonts as today. `prefers-reduced-motion` and visible focus rings
must be preserved.

## Approach Chosen

Editorial Premium (option 2), over Neutral Elegant (safer) and Dark Luxury (risky
for e-commerce readability). Consequence: images must keep a consistent ratio, and
color must come from a single accent source.

## Color Tokens

| Token       | Light     | Dark      |
| ----------- | --------- | --------- |
| canvas      | `#F5F1EA` | `#141210` |
| surface     | `#FFFDF9` | `#1C1916` |
| surface-2   | `#EFE9DE` | `#241F1A` |
| ink         | `#191714` | `#F3EDE3` |
| ink-muted   | `#6E6659` | `#A79C8C` |
| line        | `#DED5C6` | `#332C25` |
| accent      | `#B4552D` | `#D97757` |
| accent-strong | `#8F3F1F` | `#E89378` |
| success     | `#2F6B4F` | `#5FA37F` |
| warning     | `#B77A1F` | `#D9A552` |
| danger      | `#A33A2A` | `#D97757` |

Terracotta is used only for the primary CTA, sale price, active links, and
badges — never as a large section background. Order statuses use semantic colors.

## Typography

- Display: `Instrument Serif` 400 for h1/h2/hero only, tracking `-0.02em`,
  line-height `1.05`.
- UI/body: `Inter` 400/500/600.
- Scale: 12 (uppercase caption, tracking `.08em`), 14, 16, 18 (lead), 22 (h3),
  28 (h2), 40 (h1), 56 (hero desktop).
- Prices use `font-variant-numeric: tabular-nums`; body copy max `65ch`.

## Spacing, Radius, Shadow, Motion

- Spacing multiples of 4; gutters 20/32/48; sections 64px mobile → 96px desktop.
- Container `max-width: 1200px`.
- Radius: 4 (small inputs), 6 (cards/buttons), 999 (filter pills).
- Shadow only for overlays/dropdowns: `0 12px 32px rgb(25 23 20 / .12)`.
- Transitions 150–200ms ease-out; card hover `translateY(-2px)`; image hover
  `scale(1.03)`.

## Base Components

Defined in `src/index.css`: `.surface` (surface + 1px border, no shadow),
`.field` (radius 6, line border, terracotta focus ring), `.btn-primary`
(terracotta solid), `.btn-secondary` (ink outline), `.card-media` (4:5 ratio),
`.eyebrow` (12px uppercase label), `.badge` (semantic status), `.divider`,
`.table` (border-b rows, no zebra), `.empty`.

## Page Layouts

- **Header** 72px, canvas background with 1px bottom border. Serif wordmark,
  left nav, right icons (search, theme, favorites, cart, account). Search is an
  icon that opens a field. Mobile: right-side drawer.
- **Footer** three thin columns (brand, links, contact) plus a copyright row.
- **Home** asymmetric 7/5 editorial hero (serif headline, 4:5 image, 01/03
  marker), category strip with hairline divider, "PILIHAN EDITOR" 3–4 column
  grid gap 24, thin terracotta promo band, trust row.
- **Catalog** sticky left filter rail on desktop (category, price, rating);
  sort row above a 3-column desktop / 2-column mobile grid. Card: 4:5 image,
  category eyebrow, 2-line name, tabular price, add button on hover (always
  visible on mobile).
- **Product detail** large 4:5 image with vertical thumbnails; serif 40 title;
  large price; square variant pills; full-width CTA; trust row; 65ch
  description; 4-column related products.
- **Cart** line items with 1px dividers, square qty stepper; sticky right summary
  with subtotal/shipping/total and full-width CTA.
- **Checkout** numbered 3-step stepper; bordered sections (not floating cards);
  sticky summary.
- **Account/Orders/Wishlist** left nav with terracotta active bar; bordered
  content; orders as rows with status badges.
- **Auth** split screen: editorial photo panel left on desktop, form right
  max 420px, labels above fields.
- **Promo** ticket-shaped voucher cards with notch, cream + terracotta, wide
  letter-spaced code.
- **Stores** two-column list with large initial letter and dividers.
- **Admin** same tokens. 240px sidebar with terracotta active bar; topbar with
  breadcrumb + search; flat metric cards with large serif numerals; hairline
  tables without zebra; charts use the palette.

## Files Touched

- `src/index.css` — tokens, fonts, component utilities.
- `src/components/AppShell.tsx` — header, drawer, footer.
- `src/pages/CustomerPages.tsx` — 10 customer views.
- `src/pages/AdminPages.tsx` — admin shell + 7 views.
- `index.html` — `lang="id"`, title `CampusMart — Marketplace Kampus`, meta
  description.

Both page files are currently compressed to one long line per view; they will be
rewritten as multi-line code with identical logic, props, and routes. Behavior
changes: zero.

## Verification

`npm run build` and `npm run lint` pass; all 16 routes clickable; check 375 /
768 / 1280px; check light and dark mode; text contrast ≥ AA; focus rings visible
on every control.

## Self-review (builder check)

Checked as a builder would: the spec fixes tokens, type scale, spacing, radius,
component class names, and per-page layout, so no structural decision is left
implicit. Remaining calls (exact class ordering, minor copy) are safe for the
implementer. No subagent review was dispatched because the repository has no
test harness and the spec is self-contained.
