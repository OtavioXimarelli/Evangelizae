# Evangelizae Development Checkpoint

**Date:** 2026-09-23
**Status:** Two UX passes complete (committed). External daily-liturgy API integration and E2E regression fixes are implemented and verified; changes remain uncommitted.
**Branch:** `dev` — 11 commits ahead of `a7c41d9`, **nothing pushed**.

---

## ⚠️ Read this first

**The first UX pass was reported green on `pnpm check` alone, and that was wrong.**
`pnpm check` (lint + typecheck + unit + build) cannot catch E2E failures. The complete
production E2E suite has now been rerun successfully after the regression fixes.

**Lesson for future passes: AGENTS.md requires `pnpm check` AND `pnpm test:e2e` before
calling a broad UI/state change done. Both, every time.**

---

## Committed work (11 commits, `a7c41d9..7354362`)

### Environment fix (uncommitted, separate)

| File | State |
|---|---|
| `next.config.ts` | **Modified, uncommitted.** Added `turbopack: { root: __dirname }`. |

**Why it matters:** without this pin, Turbopack infers the workspace root as `$HOME`
(there is a stray `pnpm-workspace.yaml` + `package.json` in `/home/otavio`) and hangs
compiling at ~874% CPU with zero-byte responses. Symptom chain: first request never
returns → stale `.next` chunks bake in thrown `Cannot find module 'next-intl'` stubs →
every route 500s. Fix for that symptom: `rm -rf .next && pnpm dev`.

**Decide whether to commit this.** Recommend yes.

### Pass 1 — UX/layout review (6 commits)

| Commit | Change |
|---|---|
| `48dae06` | Mobile `.site-main` padding reserves bottom-nav height; sanctuary CTA no longer clipped behind the tab bar |
| `a8b2b91` | BetaNotice persisted-dismiss via `usePreferencesStore` (persist v1→v2 with migration, legacy `localStorage` key honored); moved below `<main>` so the hero is the first glance |
| `3efc787` | Mobile-only: prayer-invitation CTA ordered before week-strip; masthead title shrunk to `clamp(2.2rem, 8vw, 3.2rem)` |
| `a357027` | Mystery gate gained a primary CTA `Rezar os mistérios de hoje` + i18n key + new TDD test |
| `36907ed` | Prayer room: removed the redundant `%` chip (3 progress signals → 2) |
| `744fe76` | **Build fix:** extracted `MysteryGate` to `src/components/rosary/MysteryGate.tsx` — a named export from a Next.js page file breaks `next build` |

### Pass 2 — Standards-based audit (5 commits, plan at `.hermes/plans/2026-09-23_015500-ux-standards-audit-design-improvements.md`)

| Commit | Change |
|---|---|
| `3a18b37` | Christmas season accent `#9a7420` → `#7a5c12` (3.75:1 → **5.45:1**, WCAG AA). Added `src/app/tokens.contrast.test.ts` which **parses real hex values out of `globals.css`**, so palette regressions fail the suite |
| `44046fc` | Decade beads: 44×44 CSS px pointer target via `::after` overlay; visual bead unchanged (24×24) |
| `c5d68ed` → reverted in `e0d899d` | Mobile drawer utility links — **rejected**, see below |
| `7354362` | Settings now links **A missão** (`/about`) and **Código aberto** (GitHub), reusing existing `Navigation` i18n keys. Zero new copy |

**Why the drawer change was reverted:** on product pages the mobile header is
deliberately hidden (`globals.css:1100`, from `afd5dd8`), so the drawer cannot be opened
there — the links were unreachable exactly where needed, and "A missão" appeared twice on
public pages. Decision: keep the header hidden, put those links in Ajustes instead.

### Task skipped on evidence

**Dark-mode season accent lift** — measured on the live dark hero (`rgb(16,21,19)`):
gold eyebrow `#d7b169` = **9.12:1**, lede = **12.48:1**. Far above AA. No change made, per
the plan's own "do not change colors for taste."

---

## External liturgy and E2E regression fixes (UNCOMMITTED)

The mobile beta notice now anchors its close control at the top-right and remains above the
fixed tab bar when reached. The E2E placement assertion now matches the intended normal-flow
position after `<main>`; the Rosary CTA selector is exact.

`pnpm test:e2e` → **54 passed, 11 skipped, 0 failed** across desktop, dark, mobile, narrow,
and tablet projects.

The daily-liturgy client now calls the external API for dates outside the temporary local
bridge, validates the São Paulo date and response shape, caches only same-day data, and marks
fallback data as `CACHED`.

---

## Verification status

| Gate | Result |
|---|---|
| `pnpm run lint` | 0 errors, 1 **pre-existing** warning (`scripts/prepare-standalone.mjs` unused `resolve`) |
| `pnpm run typecheck` | clean |
| `pnpm run test` | **8 files / 36 tests pass** |
| `pnpm run check` | passes (includes production build) |
| `pnpm run test:e2e` | **54 passed, 11 skipped, 0 failed** |

Manual verification already performed (live browser):
- 320 / 390 / 1280px sanctuary and Rosary: hero first, CTA reachable, 5 beads on one line
  (`scrollWidth == clientWidth`), no horizontal overflow
- Dark-mode hero legibility measured numerically (9.12:1 / 12.48:1)
- Rosary keyboard nav: ArrowRight advances a step
- Settings: new links navigate (`/pt/about`) and open GitHub in a new tab

---

## Known issues not yet addressed

1. **Install sheet overlaps the reminder line on desktop** — measured **380×69px** overlap
   at 1280px; the sheet covers the right portion of "Este é o horário que você reservou para
   rezar." Not fixed: it is a dismissible floating toast, so overlap is inherent to that
   pattern and a fix is a product/design decision, not a clear bug fix.
2. **Two lint warnings** (above) — pre-existing, untouched.
3. **`/about` is not linked from Ajustes on desktop footer parity** — it is linked in the
   Settings aside, which is reachable from the tab bar. Verified working.

---

## Open decisions for the owner

1. **Commit `next.config.ts`?** Recommend yes — it is the fix for a machine-wide Turbopack
   hang. Alternatively delete the stray `/home/otavio/pnpm-workspace.yaml` and
   `/home/otavio/package.json`.
2. **Pastoral/editorial review** of the new copy `Rezar os mistérios de hoje` before release
   (AGENTS.md content-integrity gate; I judged it a neutral navigational label, but the
   rule is yours to apply).
3. **Push or open a PR?** Nothing has been pushed; 11 commits are local-only on `dev`.
4. **Install-sheet overlap** — fix, relocate, or accept?

---

## Reference

- Pass 1 plan: `.hermes/plans/2026-09-23_010321-ux-layout-review-sanctuary-rosary.md`
- Pass 2 plan: `.hermes/plans/2026-09-23_015500-ux-standards-audit-design-improvements.md`
- Next.js: pinned via `.mise.toml` (node 24.19.0, pnpm 11.22.0). Use pnpm only.
- E2E requires the **production** server: `pnpm build && pnpm start`, then `pnpm run
  test:e2e`. Dev intentionally unregisters the service worker, so service-worker assertions
  fail under `pnpm dev` by design.
- `.hermes/plans/*.md` are untracked planning artifacts; `next.config.ts` is modified but
  intentionally uncommitted.
