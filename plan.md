# Evangelizae Enhancement Plan (Screen + Function Oriented)

## Progress update (2026-07-15)
- ✅ Branch created: `feature/landing-visual-enhancements`
- ✅ Phase 1 started on Landing:
  - Locale-aware pillar navigation (removed hardcoded `/pt/...` redirects)
  - Landing i18n expansion (`manifestoBadge` + pillar action labels in `pt/en`)
  - Visual pass with new hero/card animations and micro-interactions
- ✅ Hydration hotfix in shared shell:
  - Header locale switcher now uses `useLocale()` (removed `window.location` render-time branch)
- 🔜 Next:
  - Continue Landing accessibility/interaction polish
  - Move into Phase 2 shared shell cleanup (remaining hardcoded shell copy and locale consistency)

## Context captured
- Source docs reviewed:
  - `EVANGELIZAE_TECHNICAL_SKELETON_EN.md`
  - `EVANGELIZAE_MISSION_AND_GOALS_EN.md`
- Current app map reviewed (Next.js App Router):
  - `src/app/[locale]/page.tsx` (Landing)
  - `src/app/[locale]/sanctuary/page.tsx`
  - `src/app/[locale]/rosary/page.tsx`
  - `src/app/[locale]/liturgy/page.tsx`
  - `src/app/[locale]/intentions/page.tsx`
  - `src/app/[locale]/ai/page.tsx`
  - `src/app/[locale]/profile/page.tsx`
  - `src/app/[locale]/about/page.tsx`
  - Shared layout/header/footer + `usePrayerStore` + `rosaryEngine`

## Product constraints to preserve in every screen
1. Strict i18n (no hardcoded UI copy in components).
2. Preserve guided Rosary engine integrity (`buildRosarySequence` + bead map + persisted session).
3. Hydration-safe browser APIs (`localStorage`, `window`, `navigator`).
4. Progressive backend integration (replace mocks with API contracts without breaking UX).
5. No addictive mechanics, no rankings, no noisy social patterns.

---

## Phase 1 (Start here): Landing Page (`/[locale]`)

### A. UX + Conversion functions
1. **Navigation correctness by locale**
   - Replace locale-forced redirects (`/pt/...`) with locale-aware links.
   - Ensure all CTA/pillar cards use router-aware navigation, not `window.location.href`.
2. **Mission-first hero optimization**
   - Keep mission clarity, shorten CTA friction, improve visual hierarchy for first action.
3. **Pillars interaction consistency**
   - Make all 4 pillar cards keyboard-accessible, semantic, and consistent in behavior.

### B. Content + i18n functions
1. **Remove hardcoded Portuguese snippets in component**
   - Move pillar card action labels and manifesto labels to `messages/pt.json` + `messages/en.json`.
2. **Copy alignment to manifesto**
   - Ensure all landing claims match mission/goals wording (free forever, no paywall, ecclesial fidelity).

### C. Technical quality functions
1. **Accessibility pass**
   - Focus states, semantic interactive elements, aria labels where needed.
2. **Performance and maintainability**
   - Reduce inline logic for navigation; keep content keys centralized in dictionaries.

### D. Acceptance for Landing
- All landing text i18n-driven.
- No hardcoded locale path regressions.
- CTA and pillar navigation works identically in `pt` and `en`.
- Mission fidelity preserved.

---

## Phase 2: Shared App Shell (Header, Footer, Locale Layout)

### Functions
1. **Header locale detection hardening**
   - Replace direct `window.location.pathname` checks with routing-aware locale state.
2. **Navigation IA refinement**
   - Align drawer sections with 4 pillars and roadmap priorities.
3. **Footer link integrity**
   - Ensure all links map to real routes and localized labels.
4. **Prototype modal governance**
   - Keep modal behavior consistent and non-intrusive.

### Acceptance
- Locale switch is stable across all routes.
- Header/footer labels are fully localized and consistent.

---

## Phase 3: Sanctuary Screen (`/sanctuary`)

### Functions
1. **Data realism upgrade**
   - Move hardcoded progress values (e.g., 23%) to computed/store or API-backed values.
2. **Cross-screen continuity**
   - Rosary completion state reflected clearly from store check-in.
3. **i18n completion**
   - Externalize remaining hardcoded PT strings.
4. **API-ready widgets**
   - Define service boundaries for saint of day, gospel snippet, plan progress, intentions preview.

### Acceptance
- Sanctuary reflects user state from real source of truth (store/API), not static placeholders.

---

## Phase 4: Rosary Screen (`/rosary`) — Crown Jewel Preservation

### Functions
1. **Engine integrity tests/guards**
   - Protect complete sequence generation and step transitions.
2. **Locale-aware rendering**
   - Render `titlePt/titleEn`, `prayerTextPt/prayerTextEn` based on active locale.
3. **Check-in pipeline**
   - Keep offline queue; wire reliable sync path to backend endpoint.
4. **Hardcoded copy cleanup**
   - Move remaining static labels to translations.
5. **Error and completion UX**
   - Explicit feedback on sync success/failure and retry behavior.

### Acceptance
- Full Rosary sequence preserved.
- Offline-to-online sync behavior is deterministic.

---

## Phase 5: Liturgy Screen (`/liturgy`)

### Functions
1. **Data-source abstraction**
   - Replace hardcoded readings with service layer contract.
2. **Typography controls persistence**
   - Persist font preference safely on client.
3. **Tab/state improvements**
   - Preserve selected reading when navigating back.
4. **Localization completion**
   - Externalize remaining literals.

### Acceptance
- Liturgy content is service-driven and locale-consistent.

---

## Phase 6: Intentions Screen (`/intentions`)

### Functions
1. **Backend-ready intention model**
   - Replace in-file mock list with fetch/create endpoints.
2. **Intercession action correctness**
   - Debounce/guard “I prayed for you” to avoid accidental double count.
3. **Submission validation**
   - Robust form validation and user feedback.
4. **Moderation-safe MVP behavior**
   - Preserve no-comment/no-debate rule.

### Acceptance
- Intentions wall supports real create/list/intercede flow.

---

## Phase 7: AI Assistant Screen (`/ai`)

### Functions
1. **Service abstraction for AI responses**
   - Replace simulated matching logic with backend chat endpoint.
2. **Guardrail enforcement**
   - Keep refusal path for low-confidence/non-magisterial queries.
3. **Citation UX**
   - Standardize source rendering and empty-source fallback.
4. **Conversation state quality**
   - Stabilize loading, retry, and message ordering.

### Acceptance
- Responses are backend-driven and guardrail-compliant.

---

## Phase 8: Profile Screen (`/profile`)

### Functions
1. **Theme management unification**
   - Reuse single theme logic across header/profile.
2. **Parish profile persistence**
   - Replace `alert` save with persistent setting flow.
3. **Progress model accuracy**
   - Use real streak/plan progression data source.
4. **Localization completion**
   - Externalize hardcoded strings.

### Acceptance
- Profile settings persist and reflect across app shell/screens.

---

## Phase 9: About Screen (`/about`)

### Functions
1. **Mission consistency pass**
   - Ensure exact message consistency with Manifesto/Mission docs.
2. **Link and CTA review**
   - Ensure CTAs direct to first spiritual action correctly by locale.
3. **Translation parity**
   - Maintain equivalent meaning in PT and EN.

### Acceptance
- About page is faithful, localized, and navigationally correct.

---

## Cross-cutting technical backlog (executed alongside phases)
1. **Service layer foundation**
   - Add typed clients for prayer check-in, liturgy, intentions, profile, AI chat.
2. **Error contract alignment**
   - Prepare frontend handling for standardized backend error payload.
3. **State strategy**
   - Keep Zustand for local/offline UX; move authoritative data to backend APIs.
4. **Testing priorities**
   - Rosary engine sequencing, locale navigation, check-in sync, critical CTA flows.

---

## Suggested implementation order
1. Landing (Phase 1)
2. Shared shell (Phase 2)
3. Sanctuary + Rosary (Phases 3–4)
4. Liturgy + Intentions (Phases 5–6)
5. AI + Profile + About (Phases 7–9)
