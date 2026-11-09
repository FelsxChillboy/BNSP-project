# CampusMart Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the CampusMart storefront and admin with the approved "Editorial Premium" design system (cream canvas, ink text, one terracotta accent, serif display headings) without changing behavior.

**Architecture:** All visual decisions live in Tailwind v4 tokens and utility classes in `src/index.css`. Two shells (`src/components/AppShell.tsx`, admin shell inside `src/pages/AdminPages.tsx`) and two page modules (`CustomerPages.tsx`, `AdminPages.tsx`) consume them. Logic, props, state, and routes stay byte-for-byte equivalent.

**Tech Stack:** React 19, React Router 7, Vite, Tailwind CSS v4, lucide-react, TypeScript.

**Spec:** `docs/superpowers/specs/2026-11-09-campusmart-editorial-redesign-design.md`

## Global Constraints

- Exact palette: canvas `#F5F1EA`/`#141210`, surface `#FFFDF9`/`#1C1916`, surface-2 `#EFE9DE`/`#241F1A`, ink `#191714`/`#F3EDE3`, muted `#6E6659`/`#A79C8C`, line `#DED5C6`/`#332C25`, accent `#B4552D`/`#D97757`, accent-strong `#8F3F1F`/`#E89378`, success `#2F6B4F`/`#5FA37F`, warning `#B77A1F`/`#D9A552`, danger `#A33A2A`/`#D97757`.
- Fonts: `Instrument Serif` 400 (display), `Inter` 400/500/600 (UI).
- Container max `1200px`; heights/gutters in multiples of 4; radius `4/6/999`; shadow only on overlays `0 12px 32px rgb(25 23 20 / .12)`.
- Terracotta is accent-only: primary CTA, sale price, active link/nav marker, badges. Never a large section fill.
- No new dependencies. No route, state (`StoreContext`), or data-shape changes. No deleting legacy unused page files.
- Do not commit: the working tree already contains the user's uncommitted work; every task is verified with build + lint instead.
- Preserve `prefers-reduced-motion` handling and visible `:focus-visible` rings.
- All UI copy stays in Indonesian.

## Review Focus

- Dark mode must stay readable on cream-derived surfaces; each task checks its views in `.dark`.
- At 375px: sticky filter rail, checkout summary, and admin tables must not overflow or overlap; tables scroll horizontally.
- Long product names clamp to two lines without changing card height.
- Empty states (empty cart, no search results, no orders/wishlist) stay styled, not raw text.
- Header drawer and every control remain keyboard-reachable with a visible focus ring.

---

### Task 1: Design tokens and component utilities

**Files:**
- Modify (replace): `src/index.css`

**Interfaces:**
- Produces utility class names used by every later task: `page`, `surface`, `field`, `btn-primary`, `btn-secondary`, `eyebrow`, `card-media`, `badge`, `divider`, `table`, `empty`, `display`, `skeleton`.
- Produces color utilities: `bg-canvas`, `bg-surface`, `bg-surface-2`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-accent`, `border-accent`, `bg-success`, `bg-warning`, `bg-danger` (and `text-*` variants), all remapped under `.dark`.

- [ ] **Step 1: Replace `src/index.css` with the token layer**

Import `Instrument Serif` and `Inter` from Google Fonts, then define `@theme` with `--font-sans`, `--font-display`, and the light values of every palette token above as `--color-<name>`. Redefine the same `--color-*` variables inside `.dark { }` with the dark column values. Base rules: `color-scheme`, `box-sizing`, smooth scroll, body canvas/ink/font, `button,input,select,textarea { font: inherit }`, pointer cursors, and a 2px `accent` `:focus-visible` outline with 2px offset.

- [ ] **Step 2: Add the component utility classes**

`@apply`-based classes with the semantics from the spec: `.surface` (border 1px line + surface bg, no shadow), `.field` (radius 6, line border, focus accent ring), `.btn-primary` (accent bg, white text, radius 6), `.btn-secondary` (transparent, ink border, hover `bg-ink/5`), `.eyebrow` (12px uppercase, tracking `.08em`, muted), `.card-media` (`aspect-[4/5] object-cover`), `.badge` (pill, 1px border, 12px semibold), `.divider` (`border-t border-line`), `.table`/`.table th`/`.table td` (bottom hairline, uppercase th), `.empty` (surface + border + p-10 centered), `.page` (`max-w-[1200px]` + responsive gutters 20/32/48 + py-10), `.display` (display font, normal weight, tracking `-.02em`), `.skeleton` (surface-2 pulse). Keep the `prefers-reduced-motion` block.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: exits 0.

Run: `npm run lint`
Expected: exits 0 (warnings acceptable only if pre-existing).

- [ ] **Step 4: Visual check**

Run: `npm run dev`, open `/`, toggle theme.
Expected: page background is cream (`#F5F1EA`) in light mode and warm charcoal (`#141210`) in dark; text is ink; existing emerald classes still compile (interim state).

---

### Task 2: Customer shell (header, drawer, footer)

**Files:**
- Modify: `src/components/AppShell.tsx`

**Interfaces:**
- Consumes: `page`, `btn-primary`, color utilities from Task 1.
- Produces: unchanged export `CustomerShell({children})` and `Empty({title, action})`.

- [ ] **Step 1: Rebuild the header**

72px bar, `bg-canvas/95 backdrop-blur`, bottom `border-line`. Wordmark `CampusMart` in `.display` with `Mart` in `text-accent`. Nav links 14px semibold: active = `text-ink` + 2px `bg-accent` underline offset; inactive = `text-muted hover:text-ink`. Right cluster: search icon toggling an inline `field` (focus it when opened), theme toggle, favorites, cart with accent count badge, `Masuk` primary button/greeting. Mobile: `Menu` opens a right-side drawer (`fixed inset-0` overlay `bg-ink/30`, panel `w-80 bg-surface p-6`, close button, stacked links, account link, drawer closes on navigation).

- [ ] **Step 2: Rebuild the footer**

`border-t border-line bg-surface`, three columns on desktop (`CampusMart` wordmark + one-line description; nav links; contact/help text), then a separated small copyright row with muted 12px text.

- [ ] **Step 3: Verify**

Run: `npm run build` then `npm run lint` → both exit 0.
Manual: `/` at 375px and 1280px; drawer opens/closes; theme toggle; cart badge count renders; Tab shows accent focus rings.

---

### Task 3: Home page

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (only the `Home` export and the file-local `ProductCard` if reused)

**Interfaces:**
- Consumes: `.display`, `.page`, `.eyebrow`, `.card-media`, `.surface`, `.btn-primary`, `.btn-secondary`.
- Produces: unchanged export `Home()`. `ProductCard` stays file-local with signature `({p}:{p:Product})`.

- [ ] **Step 1: Implement the editorial hero**

Two-column `lg:grid-cols-[7fr_5fr]` on canvas, no dark section fill. Left: `.eyebrow` label, serif 56px/48px headline (2 lines), 18px muted lead (max 60ch), `Belanja sekarang` primary + `Jelajahi toko` secondary, then two inline stats separated by a hairline. Right: image `aspect-[4/5] object-cover` radius 6 with a small `01 / 03` caption underneath.

- [ ] **Step 2: Implement category strip, product grid, promo band, trust row**

Category strip: `border-y border-line`, horizontal list of category links with arrow affordance and `Lihat semua` at the right. Product grid: `.eyebrow` section label `PILIHAN EDITOR`, 3 columns desktop / 2 mobile, gap 24, cards = `.surface` with `card-media`, category label, 2-line clamped name, tabular price, accent add button on hover (always visible on mobile). Promo band: thin `bg-accent` strip with dark-on-accent text and one inline link. Trust row: three columns with lucide icon + label + muted line.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/` light+dark at 375/768/1280; product cards show 2-line names; hover reveals add button.

---

### Task 4: Catalog and product card

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (`Catalog` export + `ProductCard`)

**Interfaces:**
- Consumes: Task 1 utilities; `useStore().products`, `addCart`, `favorites`, `toggleFavorite`.
- Produces: unchanged export `Catalog()`.

- [ ] **Step 1: Implement the filter rail and toolbar**

Desktop `lg:grid lg:grid-cols-[240px_1fr] gap-10`. Left rail `sticky top-24 self-start`: search field, category radio list (use `categories`), price range select, rating select, `Reset` text button. Mobile: a `Filter` button toggles the same controls in a bordered panel above the grid. Toolbar row: result count in muted text + sort select styled as `.field` with a fixed width.

- [ ] **Step 2: Restyle the grid and card**

3 columns desktop / 2 mobile, gap 24. Card: `.surface` with hairline border, `card-media`, category `.eyebrow`, favorite heart top-right over the image, name `line-clamp-2 min-h-[3rem]` semibold, star rating in muted/amber, footer row with tabular price and a 36px accent add button. Empty result: `.empty` block with title and a reset link.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/catalog` at 375/1280; filter + sort + search still filter; empty state shows when query matches nothing; dark mode readable.

---

### Task 5: Product detail

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (`ProductDetail` export)

**Interfaces:**
- Consumes: `useStore().products/addCart/favorites/toggleFavorite`, `rupiah`.
- Produces: unchanged export `ProductDetail()`.

- [ ] **Step 1: Implement the gallery and buy column**

Back link `Kembali ke katalog` with `ChevronLeft`. Grid `lg:grid-cols-[1.1fr_1fr] gap-12`. Gallery: vertical thumbnail rail (`hidden lg:flex flex-col gap-3`) beside a 4:5 main image with radius 6; mobile shows a horizontal thumbnail row. Buy column: store name `.eyebrow`, serif 40px title, rating row, 28px price, 65ch description, variant pills (radius 6, selected = ink fill), stock line using semantic color when `< 6`, full-width primary CTA + secondary favorite button, then a 3-item trust row.

- [ ] **Step 2: Related products and not-found state**

Related: same-store or same-category products excluding current, 4-column grid with `ProductCard`; hide the section when empty. Not-found: `.empty` block with a back link instead of a bare sentence.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/product/1` light+dark at 375/1280; thumbnails switch image; variant selection persists; unknown id shows styled empty state.

---

### Task 6: Cart and checkout

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (`Cart`, `Checkout` exports)

**Interfaces:**
- Consumes: `useStore().cart/products/changeQty/addresses/checkout`, `rupiah`.
- Produces: unchanged exports `Cart()`, `Checkout()`.

- [ ] **Step 1: Implement cart**

Page heading in `.display` + item count. Layout `lg:grid-cols-[1fr_360px] gap-10`: items list inside `.surface` with `divide-y divide-line`; each row = 80px image radius 4, name, variant in muted, unit price, right column with delete icon and a square qty stepper bordered by `line`. Summary aside `sticky top-24 h-fit border border-line bg-surface p-6`: rows subtotal/shipping/total with tabular numerals, `total` in `.display`, full-width primary CTA, and one muted note. Empty cart: `.empty` with message + `Mulai belanja` primary link.

- [ ] **Step 2: Implement checkout**

Numbered 3-step stepper (active = accent filled circle, completed/next = line outline). Layout `lg:grid-cols-[1fr_360px] gap-10`. Sections `border border-line bg-surface p-6`: address select, payment radio list (selected row `border-accent bg-accent/5`), then order summary aside sticky with item lines + totals + `Buat pesanan` CTA. Empty cart keeps a styled empty block.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/cart` and `/checkout` at 375/1280 in both themes; qty +/- updates totals; checkout still creates an order and navigates.

---

### Task 7: Account (profile, orders, wishlist)

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (`Account` export)

**Interfaces:**
- Consumes: `useStore().user/orders/products/favorites/addresses/saveAddress/toggleFavorite`.
- Produces: unchanged export `Account({tab})`.

- [ ] **Step 1: Implement the account layout**

Header block with `.eyebrow` `AKUN SAYA`, serif name, muted email. Grid `lg:grid-cols-[220px_1fr] gap-10`. Sidebar list: active item `border-l-2 border-accent pl-3 text-ink font-semibold`, inactive `pl-3 text-muted hover:text-ink`. Content sections `border border-line bg-surface p-6` with hairline dividers between inner blocks.

- [ ] **Step 2: Style each tab**

Profile: label-above-field grid for name/email, `Simpan perubahan` primary, address list as bordered rows with recipient/phone/detail and `Tambah alamat` secondary. Orders: rows with order id (mono/tabular), date, item count, total, and `.badge` status using success/warning/danger tokens; empty = `.empty`. Wishlist: `ProductCard` grid; empty = `.empty` with catalog link.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/account`, `/orders`, `/wishlist` at 375/1280 both themes; add address works; status badges differ per status.

---

### Task 8: Authentication pages

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (`Login`, `SimpleAuth` exports)

**Interfaces:**
- Produces: unchanged exports `Login()`, `SimpleAuth({type})`.

- [ ] **Step 1: Implement the split layout**

`min-h-[80vh] grid lg:grid-cols-2`: left editorial image panel (`aspect-[4/5] lg:aspect-auto lg:h-full`, hidden below `lg`) with serif quote overlay in ink-on-image scrim; right centered form `w-full max-w-[420px]`, labels above fields, `.field` inputs, full-width primary CTA, muted footer links separated by `·`.

- [ ] **Step 2: Keep role demo behavior**

`Login` keeps the role select (`buyer/staff/admin`) and identical `login(role)` + `nav()` call. `SimpleAuth` keeps the conditional register name field and `/login` link.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/login` (all three roles route correctly), `/register`, `/forgot` at 375/1280 both themes.

---

### Task 9: Promo and stores

**Files:**
- Modify: `src/pages/CustomerPages.tsx` (`Promo`, `Stores` exports)

**Interfaces:**
- Consumes: `useStore().vouchers/products`.
- Produces: unchanged exports `Promo()`, `Stores()`.

- [ ] **Step 1: Implement voucher tickets**

Two-column grid. Ticket card: `bg-surface border border-line` radius 6, left body with `.eyebrow` scope, code in `.display` with `tracking-[.12em]`, discount line, and a dashed `border-l border-dashed border-line` perforation before a right stub holding the `Gunakan voucher` button. Active-only filter unchanged.

- [ ] **Step 2: Implement the store list**

Two-column list separated by `divide-y divide-line`, each row = 48px square initial mark (`bg-surface-2` + `.display`), name, `n produk · Mitra terverifikasi` muted, right arrow link. No stacked floating cards.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/promo`, `/stores` at 375/1280 both themes.

---

### Task 10: Admin shell and dashboard

**Files:**
- Modify: `src/pages/AdminPages.tsx` (shell + `Dashboard` export)

**Interfaces:**
- Consumes: Task 1 utilities; `useStore()` data used today.
- Produces: unchanged `AdminShell` and `Dashboard` exports.

- [ ] **Step 1: Implement the admin shell**

`lg:grid lg:grid-cols-[240px_1fr] min-h-screen`. Sidebar `bg-surface border-r border-line`: wordmark top, nav items 14px with lucide icons, active = `border-l-2 border-accent bg-surface-2 pl-3 text-ink`, inactive muted; user + `Keluar` at the bottom. Mobile: top bar with menu button and slide-over sidebar. Topbar on content: breadcrumb (muted `/` separators) left, search `.field` right, 56–64px tall, bottom hairline.

- [ ] **Step 2: Implement the dashboard**

`p-6 lg:p-10` content. Date-range filter row. Four metric cards `border border-line bg-surface p-5`: uppercase label, serif 32px numeral, delta in success/danger with arrow. Chart panel `border border-line bg-surface p-6` using palette colors (accent, success, muted) — keep the existing chart implementation, only restyle. Two panels side by side: recent orders as `.table` rows with `.badge` status; low-stock list with warning accent and thin progress bar.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/admin` at 375/1280 both themes; sidebar active marker; date filter still changes data; numbers use tabular figures.

---

### Task 11: Admin management views

**Files:**
- Modify: `src/pages/AdminPages.tsx` (`ProductsAdmin`, `OrdersAdmin`, `CustomersAdmin`, `PromosAdmin`, `CategoriesAdmin`, `SettingsAdmin`)

**Interfaces:**
- Produces: unchanged exports and unchanged store mutations.

- [ ] **Step 1: Restyle products and categories**

Page header pattern: `.eyebrow` + serif h1 + primary action on the right. Products: search field + table (`overflow-x-auto` wrapper) with image thumb, name, category, tabular price, stock with warning color when low, and row actions; existing add/edit form moves into a bordered panel that matches `.field`, `.btn-primary`, `.btn-secondary`. Categories: bordered list rows with product count and a compact add form.

- [ ] **Step 2: Restyle orders, customers, promos, settings**

Orders: filter select + table with id, customer, date, total, `.badge` status, and an inline status select; expanded detail block on `border border-line bg-surface-2`. Customers: table with role badge and blocked state; Promos: ticket-style rows or table with active toggle styled as a pill switch; Settings: two-column bordered form blocks with labels above fields and a single primary save button.

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint` → exit 0.
Manual: `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/promos`, `/admin/categories`, `/admin/settings` at 1280 and 375 (tables scroll horizontally, no page overflow); existing create/update actions still work; both themes.

---

### Task 12: Document metadata and final QA

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update metadata**

`<html lang="id">`, `<title>CampusMart — Marketplace Kampus</title>`, add `<meta name="description" content="Marketplace kebutuhan mahasiswa dan kampus: buku, elektronik, perlengkapan kuliah, dan lainnya dari mitra terverifikasi." />`, keep the viewport meta and icon link.

- [ ] **Step 2: Full verification**

Run: `npm run build` → exit 0.
Run: `npm run lint` → exit 0.
Run: `npm run preview` and click through all 16 routes: `/`, `/catalog`, `/product/1`, `/cart`, `/checkout`, `/promo`, `/stores`, `/account`, `/orders`, `/wishlist`, `/login`, `/register`, `/forgot`, `/admin`, `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/promos`, `/admin/categories`, `/admin/settings`.
Expected: no console errors, no horizontal scroll at 375px, light and dark both readable, focus rings visible.

- [ ] **Step 3: Report**

List the files changed and any legacy unused page files found (`src/pages/Home.tsx`, `Cart.tsx`, `Checkout.tsx`, `Category.tsx`, `Favorites.tsx`, `Users.tsx`, `Stores.tsx`, `ProductDetail.tsx`, `StoresDetail.tsx`, `AdminDashboard.tsx`, `CustomerPages.tsx` peers). Do not delete them.
