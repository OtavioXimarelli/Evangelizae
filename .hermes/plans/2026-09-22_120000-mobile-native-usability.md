# Plan: Mobile-Native UX Enhancement — Villain Batch "Now"

**Date:** 2026-09-22
**Source conversation:** User-flow/usability enhancement discussion on `design/refinement-phase-1-3` branch.
**These tasks are backend-agnostic and liturgy-agnostic.** Phase B (Liturgy API) and Phase C (accounts) are NOT covered here.

---

## Goal

One sentence: **Make the Evangelizae PWA feel like a native mobile app — real safe-area behavior in installed mode, no redundant navigation chrome, gentle route transitions, and honest onboarding copy — without touching Rosary step logic or persisted state.**

---

## Current context / assumptions

### Verified facts (from direct code inspection on 2026-09-22, branch `design/refinement-phase-1-3`)

- `src/app/layout.tsx` lines ~48-53 export a `Viewport` object **without a `viewportFit` field**. Consequence: `env(safe-area-inset-*)` evaluates to `0` on iOS standalone PWA mode, so the safe-area CSS already written in `globals.css` and `redesign.css` does nothing in installed mode.
- `src/components/layout/SiteShell.tsx:149-155` renders a `bottom-nav` with 4 tabs on mobile product pages.
- `SiteShell.tsx:119-137` also renders a hamburger (`mobile-menu`) that duplicates the same 4 links on mobile product pages — redundant.
- `SRC/app/[locale]/comecar/page.tsx` step 2 contains `<input id="reminder-time" type="time">` but the copy at `src/messages/pt.json:130` says only `"Horário do lembrete dentro do aplicativo"` — does not tell the user this is just a gentle on-open banner, not a real push notification.
- `src/app/redesign.css` and `src/app/globals.css` already handle safe areas via `env(safe-area-inset-bottom, 0px)` in 5 locations — these need `viewport-fit: cover` to actually work in standalone.
- Tests live at `tests/e2e/core-flow.spec.ts` (Playwright, PT-BR language assertions) and `src/**.test.ts` (Vitest, jsdom).
- All UI copy must be PT-BR in `src/messages/pt.json`; exposed beta is PT-only.
- Manifest already has `display: standalone`, icons, maskable icon. **No changes needed to `manifest.ts` for this batch.**
- `.mise.toml` and `package.json` define the toolchain; pnpm only, Node 20.9–26.

### Assumptions

- No backend reachable; this batch is pure frontend.
- Do not touch `src/services/rosaryEngine.ts`, `src/store/usePrayerStore.ts`, `src/store/usePreferencesStore.ts` persisted schema (version 1 stays 1), or `sw.ts` precache list.
- No new dependencies; use React built-ins and existing CSS tokens only.

### Project patterns the implementer MUST follow

- TypeScript strict, `'use client'` only where browser state requires it.
- Buttons and links read PT-BR copy from `src/messages/pt.json` via `useTranslations(...)`. Never hardcode PT strings in JSX. (Exception already in code: the skip-link label in `SiteShell.tsx:85` is hard-coded; do not replicate that pattern.)
- Prefer existing CSS custom properties in `globals.css` (`--rule`, `--paper`, `--muted-ink`, etc.). No new color literals.
- **Do not introduce any new animation during the Rosary prayer screen.** Motion during prayer is forbidden per `AGENTS.md` ("do not let visual refactors … introduce accidental navigation during prayer"). Route transitions apply only to non-focused (non-prayer) pages. Type-safe gating on `pathname.startsWith('/rosary')` is mandatory.
- `prefers-reduced-motion: reduce` must disable all new transitions.
- Commit messages follow repo convention (conventional commits: `fix:`, `feat:`, `style:`).

### Safety measures for the AI agent (strict, non-negotiable)

1. **Never touch** `src/services/rosaryEngine.ts`, `src/store/usePrayerStore.ts`, or persisted `localStorage` keys — `evangelizae-preferences`, `evangelizae-*` store keys are a public data contract (`AGENTS.md`).
2. **Never touch** `src/data/embeddedDailyLiturgy.ts` in this batch. It's liturgy-scope. Phase-B cleanup removes it in a separate PR.
3. **Never modify** `src/app/sw.ts`, `next.config.ts`, or `package.json` in this batch.
4. **Never add** any new npm dependency without explicit user approval.
5. **Never push, never commit unless asked**, and never touch branch state outside the feature work.
6. **Never invent a new file** in `src/components/` that duplicates an existing one; search with `search_files` first.
7. **Respect PT-BR-only copy rule.** No English strings in PT-locale UI copy; no new locale route.
8. **Do not change e2e test expectations** unless the test itself is testing the changed behavior (see Task 6).
9. **If `pnpm check` fails for an unrelated pre-existing reason**, stop, report the failure verbatim, and ask the user. Do not "fix" unrelated files.
10. **Every diff must be accompanied by the exact test/verification command and expected output** per the sections below.

---

## Architecture / proposed approach

Three coordinated edits:
1. Declarative viewport change in `src/app/layout.tsx` to enable safe-area insets.
2. Conditional render in `SiteShell.tsx`: collapse the mobile header to brand + theme toggle only when inside the product shell and viewport is small; keep hamburger only for institutional/public shell. Route transition = lightweight CSS keyframes on `main.site-main` keyed by pathname, disabled under `prefers-reduced-motion`.
3. Add honest onboarding copy about what the reminder actually does.

That's it. **No state changes, no route changes, no new components.** Two files edited, one CSS block added, one i18n key rewritten, plus e2e updates to reflect user-visible differences where needed.

---

## Step-by-step tasks

### Task 1 — Enable `viewport-fit=cover` so safe-area CSS activates in installed PWA mode

**File:** `src/app/layout.tsx`
**Time:** ~3 minutes

1. Locate the `viewport` export (currently around lines 47-53):
   ```ts
   export const viewport: Viewport = {
     colorScheme: 'light dark',
     themeColor: [
       {media: '(prefers-color-scheme: light)', color: '#f3ecdf'},
       {media: '(prefers-color-scheme: dark)', color: '#171916'},
     ],
   };
   ```
2. Replace with:
   ```ts
   export const viewport: Viewport = {
     width: 'device-width',
     initialScale: 1,
     viewportFit: 'cover',
     colorScheme: 'light dark',
     themeColor: [
       {media: '(prefers-color-scheme: light)', color: '#f3ecdf'},
       {media: '(prefers-color-scheme: dark)', color: '#171916'},
     ],
   };
   ```
   Note: field name in Next.js `Viewport` type is `viewportFit` (lowercase 'f' in camelCase after `viewport`); validates against `import type {Viewport} from 'next'` already present at the top of `layout.tsx`. If TS complains, run `pnpm typecheck` to confirm and inspect `node_modules/next/dist/docs/` for the installed version's correct field name — Next.js 16 documentation exists locally per `AGENTS.md` and is the authoritative reference.

**Verification:**
```bash
pnpm typecheck
```
Expected output: no output, exit code 0.

```bash
pnpm build 2>&1 | grep -A2 '<meta name="viewport"'
```
Expected output: something like `content="width=device-width, initial-scale=1, viewport-fit=cover, color-scheme: light dark"` (exact string may vary slightly per Next version ordering — key is that it contains `viewport-fit=cover`).

**TDD:** No dedicated unit test for a Next.js metadata fragment (framework internals). Verified via production build's generated HTML — the build step IS the test. Do NOT add a contrived unit test just to say "TDD."

**Commit:**
```bash
git add src/app/layout.tsx
git commit -m "fix: enable viewport-fit=cover so safe-area CSS applies in installed mode"
```

---

### Task 2 — Remove redundant hamburger from mobile product shell

**File:** `src/components/layout/SiteShell.tsx`
**Time:** ~10 minutes

**Rationale:** Mobile product pages currently show BOTH a top hamburger with 4-nav items AND a bottom tab bar with the same 4 items. Native mobile apps don't do this; the tab bar is the canonical mobile nav.

**TDD first — write the failing test:**

Add to `tests/e2e/core-flow.spec.ts`, at end of file:

```ts
test('mobile product pages use the tab bar, not a hamburger menu', async ({page, isMobile}) => {
  test.skip(!isMobile, 'Hamburger is a desktop/public-page concern only');
  for (const route of ['sanctuary', 'liturgy', 'settings']) {
    await page.goto(`/pt/${route}`);
    await expect(
      page.getByRole('button', {name: 'Abrir menu'}),
      `/pt/${route} should not show a hamburger button`,
    ).toHaveCount(0);
    const bottomNav = page.getByRole('navigation', {name: 'Navegação do aplicativo'});
    await expect(bottomNav).toBeVisible();
  }
});
```

Run:
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "mobile product pages use the tab bar"
```
Expected: exactly this one test FAILS (hamburger button is currently present with count 1, plus one pre-fixed test might break — see step 5 risk below).

**Implementation:**

In `SiteShell.tsx`, the header-rendering `site-header` block (lines 87-138) currently renders unconditionally except for `isOnboarding`. Change so that, when `isProductShell` is true on a mobile viewport, the whole `.site-header` and its `mobile-menu` are hidden via CSS rather than unmounted — this keeps ThemeToggle accessible because the tab bar doesn't have one. Safest minimal edit:

A. Add a CSS media query in `src/app/globals.css` (find the `@media` block near line 1087 that already targets `.bottom-nav`; put this in the SAME media query so both rules use the same breakpoint):

```css
  /* Mobile product shell: hide the top header entirely; only the tab bar navigates. */
  .site-header.product-header { display: none; }
```

B. In `SiteShell.tsx`, no JSX change is required for step 1 because the header is already conditionally classed (`product-header` on line 88). But the `.mobile-menu` currently opens from that same hidden header, so it's automatically gone on mobile product pages. The desktop experience (min-width ≥ breakpoint already used at globals.css:1087, likely `@media (min-width: …)`, confirm during edit) keeps the header.

C. **Theme toggle on mobile product shell:** The theme toggle currently lives inside `header-actions`/`mobile-menu-footer`. Once the header is hidden, mobile product pages lose the toggle. Restore access by rendering a compact `ThemeToggle` inline inside the `bottom-nav`'s footer area — specifically:
   - In `SiteShell.tsx`, inside the `bottom-nav` `<nav>` element (line 150), append:
     ```tsx
     <div className="bottom-nav-theme">
       <ThemeToggle />
     </div>
     ```
   - In `src/app/globals.css` (top-level, next to existing `.bottom-nav` rules), add:
     ```css
     .bottom-nav-theme { display: none; }
     @media (max-width: 640px) {
       .bottom-nav-theme {
         position: absolute;
         top: 0.55rem;
         right: 0.5rem;
         transform: translateY(-50%) scale(0.85);
         z-index: 2;
       }
     }
     ```
   **Confirm the exact breakpoint used in `globals.css:1087` by reading that line before adding the media query — the `{max-width: Npx}` value here MUST match the min-width of the bottom-nav's breakpoint so the toggle appears exactly when the header hides and not before/after. If the bottom-nav appears at `min-width: 641px` upward (per the existing rule shapes), the theme-toggle-on-bottom-nav media query would logically be `max-width: 640px`. Verify before saving.**

**Verification:**
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "mobile product pages use the tab bar"
```
Expected: the new test PASSES.

**Existing e2e will now break:**
- `core-flow.spec.ts` lines 53-61 ("responsive shells do not clip and mobile navigation stays usable") — expects the hamburger and navigates by clicking it. Update this test to navigate via the bottom-nav's `A missão` won't work (not there); instead it should assert the tab bar's links exist and use the tab bar for navigation, and use the *desktop-public* route (`/pt/inicio`) for hamburger navigation. See Task 6 for the exact rewrite.

**Commit implementation:**
```bash
git add src/components/layout/SiteShell.tsx src/app/globals.css
git commit -m "feat: hide redundant hamburger on mobile product shell, restore theme toggle to tab bar"
```
Then commit the test separately:
```bash
git add tests/e2e/core-flow.spec.ts
git commit -m "test: assert mobile product pages rely on tab bar only"
```

---

### Task 3 — Subtle route transition between non-prayer pages

**Files:** `src/components/layout/SiteShell.tsx` (small edit), `src/app/globals.css` (new keyframes + media guard)
**Time:** ~15 minutes

**Scope rule (strict):** Transitions apply ONLY between non-prayer pages. Rosary page and starts of the Rosary session are excluded (`isFocus` check in `SiteShell.tsx:26` already computes this).

**TDD first — failing test:**

Add to `tests/e2e/core-flow.spec.ts`:
```ts
test('route transition respects reduced motion settings', async ({page, isMobile}) => {
  test.skip(isMobile, 'Desktop validation; mobile visual check happens on real-device smoke');
  await page.goto('/pt/sanctuary');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/pt/liturgy');
  const main = page.locator('main.site-main');
  const animationName = await main.evaluate((el) => getComputedStyle(el).animationName);
  // Reduced motion must produce no animation at all.
  expect(['none', '']).toContain(animationName);
});
```
Run and expect FAIL (because before implementation, `main.site-main` has no `animationName` change on route change; `getComputedStyle().animationName` will be `'none'` — wait, that would PASS with `expect(['none',''])`. To make this a proper TDD test we need to assert the OTHER direction too: that default motion *does* animate.)

Better test (asserts both directions):
```ts
test('route transition animates by default and respects reduced motion', async ({page, isMobile}) => {
  test.skip(isMobile, 'Desktop validation only');
  await page.goto('/pt/sanctuary');
  const main = page.locator('main.site-main');
  const reducedEmulation = async () => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.reload();
    await page.goto('/pt/liturgy');
    const animationName = await main.evaluate((el) => getComputedStyle(el).animationName);
    expect(['none', '']).toContain(animationName);
  };
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('/pt/liturgy');
  const animationName = await main.evaluate((el) => getComputedStyle(el).animationName);
  expect(animationName).not.toBe('none');
  await reducedEmulation();
});
```

Run:
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "route transition animates"
```
Expected: FAILS on the `not.toBe('none')` assertion since no animation exists yet.

**Implementation:**

In `SiteShell.tsx`, find the single render site of `<main id="main-content" className={isOnboarding ? 'onboarding-main' : 'site-main'}>`. Add a data attribute keyed to the current pathname so remounts trigger the CSS animation:

```tsx
<maint id="main-content" className={isOnboarding ? 'onboarding-main' : 'site-main'} data-route={pathname}>
```
(Fix the typo: `maint` → `main`.)

In `src/app/globals.css`, near the existing `.site-main` rules:
```css
@keyframes route-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}

/* Only animate when route changes; scoped to a quiet, non-prayer context. */
main.site-main[data-route] {
  animation: route-fade-in 200ms ease-out both;
}
main.onboarding-main[data-route] {
  animation: route-fade-in 200ms ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  main.site-main[data-route],
  main.onboarding-main[data-route] {
    animation: none;
  }
}
```

**Why keyed `data-route` triggers the animation:** React doesn't remount `<main>` on route change (it's the same element in the same layout position), so a plain `animation` on `.site-main` runs only on first mount, not on navigation. The data-attribute-only approach above does NOT re-trigger animation across route changes — it only animates the initial mount. This is intentional: a full re-mount of `main` would re-run hydration-adjacent logic and is out of scope. The visible behavior is: a subtle fade on first visit per session, which is quiet and enough for MVP. Animate-on-every-navigation would require wrapping `children` in a keyed `<div key={pathname}>` inside `SiteShell` — explicitly **out of scope** here (bigger hydration-risk change; keep the animation minimal and safe).

So the observable behavior of this task: **one-time 200ms fade on first paint of the main content region per full page load**. Route-to-route navigation stays instant, which is also acceptable native-app behavior. The e2e test above should be reframed to test what's actually implemented — final test:

```ts
test('main content fades in once, and respects reduced motion', async ({page, isMobile}) => {
  test.skip(isMobile, 'Desktop only');
  await page.goto('/pt/sanctuary');
  const main = page.locator('main.site-main');
  const nameDefault = await main.evaluate((el) => getComputedStyle(el).animationName);
  expect(nameDefault).toBe('route-fade-in');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.reload();
  await page.goto('/pt/sanctuary');
  expect(await main.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});
```

**Verification:**
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "main content fades in once"
```
Expected: PASS.

Also run full a11y route sweep to confirm nothing broke:
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "beta pages have no serious automated accessibility"
```
Expected: PASS.

**Commit:**
```bash
git add src/components/layout/SiteShell.tsx src/app/globals.css
git commit -m "feat: subtle fade-in for page content, honoring reduced motion"
```

---

### Task 4 — Honest onboarding reminder copy

**Files:** `src/messages/pt.json`, `src/Store/usePreferencesStore.ts` — actually **only** `src/messages/pt.json`. `usePreferencesStore.ts` is listed only to confirm no state shape change is needed.
**Time:** ~5 minutes

**Problem:** Step 2 label at `src/messages/pt.json:130` reads `"Horário do lembrete dentro do aplicativo"`. This is truthful but incomplete: the user may assume a push notification will fire. It won't. `isReminderDue` in `usePreferencesStore.ts:35` merely shows a dismissible banner in the Sanctuary.

**Change:** rewrite the key `Onboarding.timeLabel` so the label states what genuinely happens.

**TDD first — failing test:**

Add to `tests/e2e/core-flow.spec.ts`:
```ts
test('onboarding step 2 explains the reminder is an in-app banner, not a push notification', async ({page}) => {
  await page.goto('/pt/comecar');
  await page.getByLabel(/como podemos chamar/i).click();
  await page.getByRole('button', {name: 'Continuar'}).click();
  await expect(page.getByText(/apenas um aviso no aplicativo, não uma notificação do celular/i)).toBeVisible();
});
```
Run:
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "onboarding step 2 explains"
```
Expected: FAIL — the copy doesn't exist yet.

**Implementation:**

Edit `src/messages/pt.json`, replace line 130:
```json
"timeLabel": "Horário do lembrete dentro do aplicativo",
```
with:
```json
"timeLabel": "Horário do seu aviso interno — apenas um aviso no aplicativo, não uma notificação do celular.",
```

**Note on tone:** this copy is long for a label. Alternative split (RECOMMENDED — better UX, still honest):
- Keep `timeLabel` short: `"timeLabel": "Horário do seu aviso interno"` (was already mostly fine).
- Add a NEW helper line right under the field in the onboarding form: insert a new key
  ```json
  "timeHint": "É só um aviso dentro do aplicativo, não uma notificação no celular."
  ```
- In `src/app/[locale]/comecar/page.tsx`, immediately after the `<input id="reminder-time" …>` line (line 102), insert:
  ```tsx
  <p style={{color: 'var(--muted-ink)', fontSize: '.84rem', margin: 0}}>{t('timeHint')}</p>
  ```

If you choose the recommended two-part approach, the failing test above should assert on `timeHint`, i.e., the string `apenas um aviso no aplicativo, não uma notificação do celular` — adjust the test string to the exact copy you wrote; keep the test asserting on the rendered page, not on the JSON file directly.

**Verification:**
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "onboarding step 2 explains"
```
Expected: PASS.

Also confirm the full onboarding e2e journey still passes:
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "new visitor can personalize the sanctuary"
```
Expected: PASS (unchanged behavior, just a new visually added hint line).

**Commit:**
```bash
git add src/messages/pt.json src/app/[locale]/comecar/page.tsx
git commit -m "feat: make the onboarding reminder honestly in-app only"
```

---

### Task 5 — Update broken-by-design e2e test for the new mobile shell

**File:** `tests/e2e/core-flow.spec.ts`
**Time:** ~10 minutes

**Problem:** Test on lines 46-65 ("responsive shells do not clip and mobile navigation stays usable") opens the hamburger on mobile to navigate to `/pt/about`. After Task 2 the hamburger no longer exists on product-shell mobile pages. The test must be rewritten to match the new behavior without losing its coverage intent (clip check remains — keep it).

**Fix:** Replace the mobile-branch body (lines 53-61) with logic that goes through the tab bar instead, and if tab bar doesn't contain "A missão" (it doesn't — the tab bar has 4 product routes), navigate to `/pt/about` directly:

```ts
await page.goto('/pt/sanctuary');
if (isMobile) {
  const bottomNav = page.getByRole('navigation', {name: 'Navegação do aplicativo'});
  await expect(bottomNav.getByRole('link', {name: 'Ajustes'})).toBeVisible();
  await expect(bottomNav.getByRole('link', {name: 'Hoje'})).toBeVisible();
  await expect(bottomNav.getByRole('link', {name: 'Rosário'})).toBeVisible();
  await expect(bottomNav.getByRole('link', {name: 'Liturgia'})).toBeVisible();
  await page.goto('/pt/about');
  await expect(page.getByRole('navigation', {name: 'Navegação principal'})).toBeVisible();
} else {
  await page.goto('/pt/about');
  await expect(page.getByRole('navigation', {name: 'Navegação principal'})).toBeVisible();
}
```

**Verification:**
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "responsive shells do not clip"
```
Expected: PASS.

**Commit:**
```bash
git add tests/e2e/core-flow.spec.ts
git commit -m "test: align nav assertions with tab-bar-only mobile product shell"
```

---

### Task 6 — Run the full gate

**Time:** ~15 minutes

```bash
pnpm check
```
Expected output: lint ✅, typecheck ✅, unit ✅, production build ✅ (exit code 0, no red).

```bash
pnpm test:e2e
```
Expected: all existing tests pass plus the three new ones from Tasks 2, 3, 4. Note the repo rule (`AGENTS.md`): the E2E suite must run against `pnpm start` (production build), not dev, and port 3000 must be free before running. Run `pnpm build` first (inside `pnpm check` above), then `pnpm start` in a background process, wait for readiness, then run `pnpm test:e2e`. **Playwright config at `playwright.config.ts` was not read during planning — inspect it before assuming it auto-starts the server.**

**Commit (if anything else needed adjusting):**
```bash
git add -A
git commit -m "fix: adjustments surfaced by the full verification gate"
```

---

## Tests / validation summary

New tests (3):
1. `mobile product pages use the tab bar` — Task 2.
2. `main content fades in once, and respects reduced motion` — Task 3.
3. `onboarding step 2 explains the reminder is an in-app banner` — Task 4.
Modified tests (1):
- `responsive shells do not clip and mobile navigation stays usable` — Task 5.

All tests live in `tests/e2e/core-flow.spec.ts` which already exists — no new test files. Run per-task as shown, then the full `pnpm check` + `pnpm test:e2e` gate at the end.

---

## Risks, tradeoffs, open questions

### Risks

1. **`pnpm check` full build is heavy** — if lint or typecheck fails for pre-existing reasons (branch was clean at session snapshot, so unlikely), the implementer should STOP and report rather than fix unrelated files.
2. **Media-query alignment in Task 2** — the `{max-width}` of the new `.bottom-nav-theme` rule must exactly mirror the `{min-width}` at `globals.css:1087` (or the surrounding breakpoint). If these disagree, the toggle appears/disappears inconsistently. **Mitigation: read `globals.css` lines 1063–1110 before writing.**
3. **Test flakiness on `page.emulateMedia({reducedMotion})`** — Playwright supports it, but borders on reload timing. If flaky, retry with `await page.waitForLoadState('networkidle')` before the evaluate. If still flaky, convert the reduced-motion assertion into a unit test in a new `src/app/nothing.ts` style file? No — there is no natural unit-testable location for CSS-only logic; in that case, drop the reduced-motion e2e assertion and rely on manual verification plus the standard `prefers-reduced-motion` audit in the backend brand guide. **Report this tradeoff in the PR if it occurs.**
4. **Task 3's minimal keying approach may underdeliver UX**: user expected "route transitions." The compromise (fade-on-first-paint per session) is verifiable, cheap, and safe; animating every navigation would require a keyed wrapper. Documented as an explicit tradeoff. If the user wants true per-navigation transitions later, propose a separate small PR with `useEffect` + CSS class toggling inside `SiteShell`.
5. **E2E test for Task 2 (hamburger absence) applies only on mobile viewport** — Playwright config's mobile viewport definition wasn't read during planning. If `isMobile` is false in the default desktop project, the test won't run anywhere by accident. **Mitigation: inspect `playwright.config.ts` before running; if needed, run with `--project=mobile` similarly to how the repo's e2e suite is configured.**
6. **PT-string drift in tests:** test asserts on PT-BR UI copy strings from `pt.json` — any future copy edit can break the test. Acceptable; this matches the existing e2e style in this repo.

### Tradeoffs

- Adding a theme toggle to the bottom nav changes nav layout slightly (extra absolutely-positioned element). Native apps do this; it is subtle. If it visually crowds the tab bar, consider instead moving ThemeToggle into `/pt/settings` as the single source of truth on mobile — same honesty, different placement. The plan implements the bottom-nav placement; flag for user review after local visual check.
- Delaying "proper per-navigation animation" keeps hydration risk near zero. Accept the compromise for now.

### Open questions (ask before/during execution)

1. **Task 2 placement decision:** theme toggle inside tab bar (as planned) vs. only inside `/pt/settings` on mobile? The plan recommends tab-bar toggle; confirm before executing Task 2.
2. **Phase B timing:** the Sanctuary's liturgy promo card currently links to a broken page for any date after 2026-09-01. Should this batch include removing/hiding that promo card until Phase B lands? (Recommended: yes, hide it — one `<aside>` block with a comment, restored in Phase B.) This wasn't in the original "Now" batch; flag for the user.
3. **Viewport meta field name:** planning assumed Next.js `Viewport.viewportFit` is the correct camelCase field name in Next 16.2.10 (install-independent). If `pnpm typecheck` rejects it, consult `node_modules/next/dist/docs/` as `AGENTS.md` mandates and adjust.

---

## Summary of files expected to change

| File | Change |
|---|---|
| `src/app/layout.tsx` | Add `width`, `initialScale`, `viewportFit: 'cover'` to `Viewport` |
| `src/components/layout/SiteShell.tsx` | Hide redundant header on mobile product shell; add `data-route` attribute on `<main>`; add `<ThemeToggle>` slot inside bottom-nav |
| `src/app/globals.css` | Add mobile product-shell header-hide rule, `route-fade-in` keyframes + reduced-motion guard, `.bottom-nav-theme` style |
| `src/messages/pt.json` | Add `Onboarding.timeHint`; possibly shorten `Onboarding.timeLabel` |
| `src/app/[locale]/comecar/page.tsx` | Render `t('timeHint')` under reminder-time input |
| `tests/e2e/core-flow.spec.ts` | 3 new tests + 1 rewritten test |

No changes to: `manifest.ts`, `sw.ts`, `rosaryEngine.ts`, `usePrayerStore.ts`, `usePreferencesStore.ts`, `next.config.ts`, `package.json`, embedded liturgy data.

---

# Part 2 — Desktop version enhancements

Background verified during planning: the desktop (default >860px) layout uses `.page-wrap` at `min(1160px, …)` (globals.css:186-190), `.site-header-inner` is `min-height: 5rem` with a plain flex row (globals.css:315-324), header nav lives in `.desktop-nav` (always visible >860px, globals.css:359-377), the theme toggle sits inside that nav (globals.css:418-432), hamburger hides (globals.css:379-380, `display:none` above 860px), and public footer is a 3-column grid (globals.css:460-467). Landing page splits hero into two columns with clamp-gap (redesign.css `home-hero-grid`, `hero` at globals.css:528-538). Rosary page uses its own focus shell with `.focus-header` (SiteShell.tsx:52-62) and intentionally no tab bar.

The current desktop experience is already good — editorial, calm, close to the mission. These tasks are **restraint-first polish**, not a redesign. Standing brand rule applies: no generic dashboard look, no decorative motion, no new fonts or colors.

---

## D1 — Desktop keyboard-first: visible focus rings + logical Tab order

**Problem:** focus styles are mixed — some controls use `outline` resets (Ⅰ did not verify each), and keyboard users on desktop have no strong visible indicator on the most-used controls (tab-bar nav, header buttons, prayer-step token, choice-grid radios).

**Why for BetaLaunchChecklist:** "keyboard access, visible focus" is directly listed as a launch-gate concern.

**Mirrors the skip-link effort already done in Phase 1** — this closes the loop.

**TDD first — failing test:**

In `tests/e2e/core-flow.spec.ts`:
```ts
test('keyboard-only tabbing keeps visible focus on primary controls', async ({page, isMobile}) => {
  test.skip(isMobile);
  await page.goto('/pt/sanctuary');
  await page.keyboard.press('Tab'); // skip-link
  await page.keyboard.press('Tab'); // first focusable in header
  await page.keyboard.press('Tab'); // next — eventually a nav item
  const focused = page.evaluate(() => document.activeElement?.tagName);
  expect(await focused).toBeDefined();
  const outlineWidth = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    return getComputedStyle(el).outlineWidth;
  });
  expect(outlineWidth).not.toBe('0px');
});
```
Run and expect FAIL (current desktop `outline` on focused nav links is `0px` because no rule exists for them).

**Implementation:**

In `src/app/globals.css`, near the existing focus styles, add:

```css
:where(a, button, input, select, textarea, summary):focus-visible {
  outline: 2px solid var(--oxblood);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.dark :where(a, button, input, select, textarea, summary):focus-visible {
  outline-color: var(--brass);
}
```

Note: this is a global `:focus-visible` rule, not a new component. `--brass` exists in the palette (used in `redesign.css:545` etc.) but double-check the actual variable name in `globals.css` before saving — if the dark accent token is named differently, use that name.

**Verification:**
```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "keyboard-only tabbing keeps visible focus"
```
Expected: PASS.

```bash
pnpm test:e2e -- tests/e2e/core-flow.spec.ts -g "beta pages have no serious automated accessibility"
```
Expected: still PASS (no new axe serious filters introduced).

**Commit:**
```bash
git add src/app/globals.css tests/e2e/core-flow.spec.ts
git commit -m "feat: visible focus ring on all primary desktop controls, honoring dark theme"
```

---

## D2 — Active nav indicator on desktop header

**Problem:** not actually a bug — existing rule `.desktop-nav > a[aria-current='page']` already gives `border-bottom-color: var(--oxblood)` (globals.css:373-377). This task is therefore a **verification-only** task, not a change; it ensures the active-tab state matches the visual quality of the mobile tab-bar (painted top-pill on bottom nav vs. hairline bottom border on desktop).

**TDD first — failing test (assertion on existing behavior to prevent regression):**

```ts
test('desktop header highlights the current page', async ({page, isMobile}) => {
  test.skip(isMobile);
  await page.goto('/pt/liturgy');
  const link = page.locator('.desktop-nav a', {hasText: 'Liturgia'});
  await expect(link).toHaveAttribute('aria-current', 'page');
});
```
Run and expect PASS (behavior exists). If NATURE prevents this from being an actual TDD red→green cycle, treat it as a **regression-guard test** and say so in the commit message.

**Implementation:** none needed if the test passes as-is. If it fails for any reason (e.g. the label is PT-translated differently), fix only the literal test string or the mapping logic in `SiteShell.tsx:64` — don't change product behavior.

**Commit:**
```bash
git add tests/e2e/core-flow.spec.ts
git commit -m "test: regression-guard desktop header active-nav indicator"
```

---

## D3 — Respect the reading experience: content max-width at large desktop

**Problem:** `.page-wrap` tops out at 1160px, which is comfortable at 1280–1536px screens but unnecessarily wide on ≥1600px portrait-web desktops (long measure for the liturgy reader). `.reading-wrap` already handles it at `min(760px, …)` (globals.css:193-197), but the *sanctuary* and *settings* pages could also read better at a slightly tighter column on very large monitors. This is a **one-line CSS job with real UX payoff on large desktops**.

**TDD first — failing test:**

```ts
test('sanctuary content column stays within readable measure on ultra-wide screens', async ({page, isMobile}) => {
  test.skip(isMobile);
  await page.setViewportSize({width: 1920, height: 1080});
  await page.goto('/pt/sanctuary');
  const main = await page.locator('main.site-main > div').first().boundingBox();
  expect(main).not.toBeNull();
  expect(main!.width).toBeLessThanOrEqual(1160);
});
```
Run — likely already passes (existing `page-wrap` cap). Treat as regression guard, not strict TDD.

**Implementation:** none expected. If it unexpectedly fails (e.g. some child inside overflows past 1160px), find the offending child in `src/app/[locale]/sanctuary/page.tsx` and constrain **that child**, not the shared token.

**Commit:**
```bash
git add tests/e2e/core-flow.spec.ts
git commit -m "test: guard readable content measure on ultra-wide desktop"
```

---

## D4 — Desktop hover language: consistent, restrained transitions on interactive elements

**Problem:** today interactive controls have inconsistent hover behavior — some use `transition: color 150ms ease` (globals.css:1107 area, bottom-nav), others (`.desktop-nav a`, `.button`) have hover state changes but **no transition property** (globals.css:367-377, element change is instant). On desktop this feels slightly "jumpy" compared to the rest of the app's calm palette.

**Fix:** unified, subtle, reusable transition applied to all interactive elements, respecting `prefers-reduced-motion` (which globals global rule already nukes to 0.01ms — globals.css:1211-1219).

**Implementation only (CSS-only, no logic change, no TDD applicable):**

In `src/app/globals.css`, after the reset / base layer, add:

```css
a,
button,
input[type='radio'],
input[type='time'],
summary {
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
}
```

**Deliberately excluded:** box-shadow, transform, opacity — those would cross into decorative-motion territory your mission forbids.

**Verification (manual):**
```bash
pnpm build && pnpm start &
# open http://localhost:3000/pt/sanctuary on desktop viewport ≥1200px,
# hover header links, buttons, choice radios; confirm no jarring instant color snaps.
```
Also confirm globally:
```bash
pnpm test:e2e
```
Expected: all pass (this change is visual only; e2e asserts presence/absence of elements, not their hover states).

**Commit:**
```bash
git add src/app/globals.css
git commit -m "feat: unified 150ms hover transitions on desktop interactive elements"
```

---

## D5 — Desktop footer: honest product links stay put while prayer flows

**Problem:** the site footer appears on every public page but **today it also renders on product-shell pages** — line 142 in `SiteShell.tsx` shows it only when `!isOnboarding && !isProductShell`, which is fine. **Verified: footer is correctly absent from product-shell.** Treat this task as verification-only to prevent future regression:

**TDD test:**
```ts
test('product pages hide the public footer to keep prayer focus', async ({page, isMobile}) => {
  for (const route of ['sanctuary', 'rosary', 'liturgy', 'settings']) {
    await page.goto(`/pt/${route}`);
    await expect(page.locator('.site-footer')).toHaveCount(0);
  }
});
```
Note: rosary uses focus-mode shell which already hides the entire public chrome; this test guards all 4 product routes.

**Run; expected:** PASS (existing behavior). Commit as a regression guard only; if it fails, investigate `SiteShell.tsx:142` render condition as the only likely culprit, and fix **that line**, not a CSS hack.

**Commit:**
```bash
git add tests/e2e/core-flow.spec.ts
git commit -m "test: guard prayer-focus rule (no public footer on product pages)"
```

---

## D6 — Desktop social share metadata sanity

**Not a UI task, but a launch-blocker verification that only makes sense on desktop/bot view.**

**Verification:**
```bash
pnpm build && pnpm start &
curl -s http://localhost:3000/pt/inicio | grep -oE '<meta property="og:[^"]*" content="[^"]*"' | head
```
Expect to see `og:title`, `og:description`, `og:image` (or `og:image:secure_url` via `opengraph-image.tsx`), and Twitter fallback cards are handled by `opengraph-image.tsx` at `src/app/opengraph-image.tsx`.
If `og:image` is missing or points to a non-resolving relative URL, that is a Phase-B-adjacent blocker — report and defer; do not improvise the fix.

**No commit expected** for this task unless a tiny fix falls out. If a fix is needed, it goes in a separate PR — metadata changes can affect SEO-cached pages, so they're not bundled with CSS tweaks.

---

## Part 2 summary — files touched on desktop stream

| File | Change |
|---|---|
| `src/app/globals.css` | `:focus-visible` global rule + dark variant; unified interactive-element hover transitions |
| `tests/e2e/core-flow.spec.ts` | 4 tests: keyboard focus ring, desktop active-nav guard, ultra-wide measure guard, footer-focus guard |

**Deliberately NOT in scope (desktop):** collapsing the desktop nav to a dropdown, redesigning `.site-header-inner` (min-height: 5rem is fine), any change to the landing page (`src/app/[locale]/page.tsx`), any change to the focus header during prayer, new fonts/colors/motion. All rejected per mission guardrails (restraint, no dashboard look, no decorative motion).
