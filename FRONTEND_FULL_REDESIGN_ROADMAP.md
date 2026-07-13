# Frontend Full Redesign Roadmap (UI/UX + Motion + Component System)

## 1. Objective and Product Constraints

This roadmap defines a full frontend redesign to deliver:

- cleaner visual consistency across **all pages**
- simpler and more intuitive user paths
- better accessibility, performance, and maintainability
- stronger separation between:
  - **public content experience** (mission, prayer learning, references)
  - **product/dashboard experience** (tracking, interactive tools, personalization)

Non-negotiables:

1. Preserve spiritual focus and Catholic identity (avoid generic SaaS tone).
2. Keep `/ensinamentos` as canonical content hub.
3. Preserve locale behavior (`pt` and `en`) and route compatibility.
4. Prioritize behavior-safe migration (no dead links, no broken auth paths).

---

## 2. Current Architecture Baseline

### 2.1 Frontend stack

- Next.js App Router
- `next-intl` for localization
- Tailwind + custom design tokens/classes
- shadcn/ui primitives
- Zustand for client state
- MDX-based teachings content pipeline

### 2.2 Existing UX structure

- Public pages and dashboard flows already separated at route level.
- Teachings/blog structure already partially migrated.
- Visual system still mixed (legacy styles + newer editorial cards).
- Motion is present but not centrally governed (different hover/transition rhythms).

---

## 3. Redesign Principles (Design System Level)

1. **Hierarchy first**: each page must answer “where am I / what can I do next?” within 3 seconds.
2. **Single primary action per section**: avoid equal-weight CTAs in the same visual block.
3. **Consistent spacing rhythm**: use shared section/container scales (4/6/8/12).
4. **Token-first visual language**: color, radius, shadow, and typography controlled by shared tokens.
5. **Accessible by default**: keyboard-first interactions, semantic structure, readable contrast.
6. **Motion with purpose**: transitions should support orientation, not decoration.

---

## 4. Execution Phases

## Phase 0 — Foundation Audit and Freeze

### Scope

- Inventory all pages/components and classify by:
  - public content
  - dashboard/product
  - shared shell (header, footer, navigation, cards, buttons, modals)
- Freeze net-new UI patterns until systemized.

### Deliverables

- Route/component audit matrix (owner, status, redesign priority).
- “Allowed patterns” list (buttons, cards, section wrappers, navigation items).
- Visual debt backlog with severity tags.

### Exit Criteria

- No new page-level custom patterns introduced outside approved set.

---

## Phase 1 — Design Tokens and Layout Primitives

### Scope

- Standardize:
  - typography scale (`display`, `h1-h4`, `body`, `caption`)
  - spacing scale
  - radius/shadow/elevation
  - color roles (primary, accent, surface, muted, critical, success)
- Introduce reusable layout primitives:
  - `PageContainer`
  - `SectionHeader`
  - `EditorialCard`
  - `ActionStrip`

### Deliverables

- Token map in code (Tailwind/theme + utility classes).
- Base components replacing ad-hoc wrappers.
- visual regression snapshots for key breakpoints.

### Exit Criteria

- 80%+ pages using shared primitives for top-level layout.

---

## Phase 2 — Global Navigation and Footer System

### Scope

- Finalize two navigation systems:
  - Public IA (prayer, teachings, references, about, dashboard bridge)
  - Product IA (tools, progress, routines)
- Create unified footer variants:
  - Public footer (mission-centered, centered structure, low cognitive load)
  - Product footer (minimal utility/footer links if needed)

### Deliverables

- Route-aware shell rules documented in code.
- Reusable `PublicFooter` component replacing page-local footers.
- Mobile/desktop parity in labels and destinations.

### Exit Criteria

- No route shows the wrong navigation shell.
- Footer style and structure consistent on all public pages.

---

## Phase 3 — Public Experience Redesign (All Public Pages)

### Scope

- Redesign all non-auth-required pages for consistency:
  - home
  - about
  - history
  - how-to-pray
  - daily mysteries
  - traditional prayers
  - resources
  - teachings hub/category/article/path pages

### Technical Workstreams

1. **Content hierarchy**
   - one strong hero + concise supporting sections
   - clearer “continue journey” section at end of each page
2. **Scanning UX**
   - normalize badges, metadata rows, card density, CTA locations
3. **Semantic refinement**
   - heading order, landmark regions, button/link semantics

### Exit Criteria

- Public pages pass a consistent UX checklist and accessibility baseline.

---

## Phase 4 — Dashboard/Product UI Consolidation

### Scope

- Align dashboard pages with same token system but distinct product personality.
- Reduce duplicated interaction patterns in tools pages.

### Deliverables

- Unified card/toolbar/filter patterns for tools.
- Consistent “progress + next step” modules.

### Exit Criteria

- Dashboard feels cohesive but clearly distinct from content/blog layer.

---

## Phase 5 — Motion/Animation Refinement Program

### Motion Principles

1. 120–220ms for micro-interactions, 220–320ms for view transitions.
2. Prefer transform/opacity animations; avoid layout thrashing properties.
3. Motion must communicate state change, not distract from prayer content.

### Technical Plan

- Build a motion preset map:
  - `motion.hoverLift`
  - `motion.fadeSlideIn`
  - `motion.focusPulse`
  - `motion.pageEnter`
- Standardize easing curves and durations.
- Add reduced-motion handling globally:
  - respect `prefers-reduced-motion`
  - disable non-essential animation chains

### Candidate Improvements

- smoother route section entrances for editorial pages
- consistent CTA hover/focus animation
- subtle stagger on list reveals (articles, lessons, resources)

### Exit Criteria

- Motion tokens used in shared components.
- Reduced-motion mode verified across all major pages.

---

## Phase 6 — React Bits Feasibility and Controlled Adoption

## Research Findings (initial)

- React Bits is an open-source animated component library (110+ components, customizable, MIT+Commons Clause).
- Offers TS/Tailwind-compatible variants and shadcn-oriented installation flow.
- Strong candidate for selective motion enhancement, not full UI replacement.

### Evaluation Matrix

For each candidate component:

1. **Aesthetic fit** (sacred/minimal vs flashy)
2. **Accessibility impact** (focus states, semantics, reduced motion)
3. **Performance cost** (bundle weight, runtime animation cost)
4. **Theming compatibility** (dark/light + token consistency)
5. **Maintainability** (copy/paste ownership, upgrade strategy)

### Proposed Adoption Policy

- Allowed:
  - subtle text reveal animations for hero headings
  - low-distraction background accents
  - progressive section reveal wrappers
- Avoid:
  - high-frequency particle effects on core reading/prayer screens
  - animation-heavy components in dense content pages

### Pilot Plan

1. Pilot in one public page section and one dashboard card zone.
2. Measure:
   - CLS/LCP impact
   - interaction smoothness
   - user readability feedback
3. Keep behind feature flag (`NEXT_PUBLIC_ENABLE_EXPERIMENTAL_MOTION`).

### Exit Criteria

- Decision memo: adopt selected React Bits patterns or reject.

---

## Phase 7 — Accessibility and UX Quality Gate

### Scope

- Enforce WCAG-oriented checks:
  - contrast ratios
  - keyboard navigation
  - visible focus states
  - semantic roles/labels
- Validate language/localization consistency for both locales.

### Deliverables

- accessibility checklist report by route group.
- fixes for headings, aria labels, and interactive semantics.

### Exit Criteria

- No critical accessibility issues on primary user paths.

---

## Phase 8 — Performance and Stability Gate

### Scope

- Optimize image payloads, font usage, and animation CPU cost.
- Verify no regressions in bundle size and route-level render costs.

### Deliverables

- per-route performance budget table.
- deferred/non-critical animation strategy.

### Exit Criteria

- Performance stays within agreed thresholds on mobile and desktop.

---

## Phase 9 — Rollout Strategy

### Scope

- Deploy redesign in scoped increments:
  1. public shell + homepage
  2. teachings + learning paths
  3. remaining public pages
  4. dashboard/tools
- Keep compatibility redirects active during transition.

### Deliverables

- rollout checklist and rollback points per scope.
- release notes for UI behavior changes.

### Exit Criteria

- Full redesign live with stable metrics and no major UX regressions.

---

## 5. Engineering Backlog Structure

Create implementation tickets grouped as:

1. `design-system/*` (tokens, primitives, shared components)
2. `public-redesign/*` (route-specific UX updates)
3. `product-redesign/*` (dashboard/tools consistency)
4. `motion/*` (animation tokens + reduced motion + pilots)
5. `a11y/*` (semantic/focus/contrast)
6. `perf/*` (budget and optimization)
7. `migration/*` (redirects, compatibility, cleanup)

Each ticket should include:

- target routes/components
- UX acceptance criteria
- accessibility constraints
- performance constraints
- rollback notes

---

## 6. Completion Definition

The redesign is complete when:

1. All pages use the shared design system and shell patterns.
2. Public and dashboard journeys are clear and consistent.
3. Accessibility baseline is met for all primary flows.
4. Motion system is unified, optional enhancements are controlled, and reduced-motion behavior is reliable.
5. React Bits adoption decision is documented and implemented only where it improves UX without distraction.

