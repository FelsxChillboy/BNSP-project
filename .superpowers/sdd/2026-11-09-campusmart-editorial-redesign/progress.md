# SDD ledger — plan: docs/superpowers/plans/2026-11-09-campusmart-editorial-redesign.md

Pre-flight: Task 1 produces utility/color classes consumed by Tasks 2–11 — `page`, `surface`, `field`, `btn-primary`, `btn-secondary`, `eyebrow`, `card-media`, `badge`, `divider`, `table`, `empty`, `display`, `skeleton`; `bg-canvas|surface|surface-2`, `text-ink|muted`, `border-line`, `accent|accent-strong|success|warning|danger`. Names match across tasks. No conflicts.

Ruling: No git worktree — the working tree already holds the user's uncommitted work (untracked `CustomerPages.tsx`, `AdminPages.tsx`, `AppShell.tsx`, `StoreContext.tsx`, `catalog.ts`), which a worktree cut from HEAD would lose. Implement in place and do not commit. Cost if wrong: the user may have preferred isolation; the change can be moved later.

Ruling: TDD not applied — changes are CSS/markup only with identical behavior, and the repo has no test harness (`package.json` has no test script); adding one would add dependencies against the plan's constraints. Verification = `npm run build` + `npm run lint` + manual route checks. Cost if wrong: a visual regression only a test would catch could slip; manual route checks and the final review mitigate.

Task 1: complete (build 0, lint 0 with 3 pre-existing warnings in StoreContext.tsx / legacy Checkout.tsx)
Task 2: complete (AppShell header/drawer/footer; build 0, lint 0, no new warnings)

Task 3–9: Ruling: implemented Home, Catalog, ProductDetail, Cart, Checkout, Login, SimpleAuth, Account, Promo, Stores in one rewrite of CustomerPages.tsx instead of seven sequential edits — the file is compressed to one line per view, so exact-match edits on 2–3 KB single lines are fragile; one behavior-preserving rewrite is safer. Cost if wrong: a larger single diff to review; mitigated by build+lint and identical store calls/routes.
Task 3: complete (Home)
Task 4: complete (Catalog + ProductCard)
Task 5: complete (ProductDetail)
Task 6: complete (Cart + Checkout)
Task 7: complete (Account; removed now-unused `toggleFavorite` binding since ProductCard owns the toggle — behavior preserved)
Task 8: complete (Login + SimpleAuth)
Task 9: complete (Promo + Stores)
Tasks 3–9 verification: `npm run build` 0, `npm run lint` 0 (only the 3 pre-existing warnings).

Task 10–11: Ruling: Admin shell, Dashboard, and all six management views rewritten in one pass of `AdminPages.tsx` for the same one-line-per-view reason. `Status` now maps known labels to semantic tones with a neutral fallback (stock counts stay neutral). Cost if wrong: larger single diff; mitigated by identical store calls, routes, and form payloads.
Task 10: complete (AdminShell + Dashboard)
Task 11: complete (Products, Orders, Customers, Promos, Categories, Settings)
Tasks 10–11 verification: `npm run build` 0, `npm run lint` 0 (only the 3 pre-existing warnings).

Task 12: complete (index.html lang=id, title, meta description; build 0, lint 0).
