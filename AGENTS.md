# Evangelizae agent guide

This file is the canonical operating guide for coding agents working in this repository.

## Mission and product north star

Evangelizae is a free, open-source Catholic companion for everyday prayer. The current product helps people pray the Rosary, read the daily liturgy, and build a quiet personal rhythm that leads them back to concrete Christian life: family, parish, charity, the sacraments, and the Church.

The application is a means, not the destination. It must not replace the Church, priests, spiritual direction, sacramental life, or parish community. Before proposing or implementing a feature, ask:

> How does this help someone pray with greater fidelity, encounter Christ, and return to life in the Church?

If the answer is unclear, the feature does not belong in Evangelizae.

The three identity words are **Veritas • Communio • Missio**:

- **Veritas:** fidelity to Scripture, Tradition, and the Magisterium; clear sources; no invented devotional content.
- **Communio:** prayer should lead toward fraternity and ecclesial life, never isolation or spiritual comparison.
- **Missio:** the digital experience should send the person back into ordinary life and Christian witness.

## Source-of-truth order

When project documents disagree, use this order:

1. This `AGENTS.md` for agent behavior.
2. `README.md` for the implemented product and current beta scope.
3. `BETA_LAUNCH_CHECKLIST.md` for release gates.
4. `contracts/evangelizae-v1.openapi.yaml` for the frontend/backend contract.
5. The current code and tests for actual behavior.
6. `EVANGELIZAE_MISSION_AND_GOALS_*.md` for long-term mission and vision.
7. `docs/archive/EVANGELIZAE_TECHNICAL_SKELETON_*.md`, roadmap, and redesign documents as historical or aspirational context only.

Do not treat a roadmap item or historical blueprint as authorization to expand the beta.

## Current public-beta boundary

The beta is deliberately small. Its supported core is:

- a Portuguese public introduction and mission;
- optional local onboarding without an account;
- a personal daily sanctuary;
- the complete 73-step guided Rosary, including persistence and resume;
- daily liturgy supplied by the separate Java/Spring API;
- local weekly history, reading preferences, theme, data export, and total local-data deletion;
- an installable PWA with a previously loaded Rosary available offline;
- privacy, recovery, feedback, and institutional pages.

Unless a user explicitly changes scope, the following remain outside the beta: authentication, cloud synchronization, public intentions or community feeds, theological AI, parishes, spiritual plans, native mobile apps, comments, and social metrics. Existing placeholder routes must explain the roadmap honestly; never simulate a working feature or fabricate data.

## Non-negotiable product guardrails

- Never add advertising, paywalls, premium tiers, spiritual leaderboards, competitive streaks, coins, rewards, infinite feeds, engagement traps, or invasive notifications.
- Do not optimize for time-on-screen, compulsive return, vanity metrics, or artificial urgency. The product should become quiet once prayer begins.
- Never present stale, cached, sample, or inferred content as today's liturgy. Show source, date, update state, and failure state honestly.
- Never manufacture prayers, biblical quotations, saint quotations, liturgical texts, doctrinal explanations, or ecclesial approval.
- Changes to prayers, mysteries, fruits, biblical references, or theological copy require authoritative sourcing and human pastoral/editorial review before release.
- Do not present Evangelizae as a replacement for Mass, Confession, pastoral care, medical care, or urgent human support.

## Protect the Rosary

The guided Rosary is the spiritual and technical heart of the beta.

- Preserve the complete sequence and its 73-step semantics. Do not remove prayers or steps to simplify implementation.
- Preserve day-specific mystery calculation, session resume, completion behavior, history, and offline access.
- Treat persisted state and storage keys as a public data contract. Any schema or key change needs an explicit migration and tests.
- Do not let visual refactors interrupt focus, reset progress, cover controls, or introduce accidental navigation during prayer.
- Add or update tests whenever sequence construction, navigation, completion, persistence, or mystery selection changes.

## Catholic content integrity

Use primary and authoritative sources: Scripture with a documented translation/license, the Catechism, official Holy See documents, canon law when relevant, episcopal conference publications, and clearly attributed saints or Doctors of the Church.

- Distinguish doctrine, discipline, devotion, pastoral advice, and private revelation.
- Prefer precise attribution over unattributed inspirational copy.
- If a reliable source is unavailable, state the limitation instead of filling the gap.
- Any future theological AI must use an approved, auditable corpus, cite sources, refuse unsupported claims, and pass theological evaluation before user exposure. A generic chatbot is not acceptable.

## Voice, language, and design

- The exposed beta language is Brazilian Portuguese (`pt-BR`). User-facing copy should be natural, concise, reverent, welcoming, and grammatically correct.
- Put reusable interface copy in `src/messages/pt.json` and use `next-intl`. Metadata and framework recovery boundaries may use local strings when the framework makes that clearer.
- Avoid guilt, fear, triumphalism, sentimentality, corporate growth language, and exaggerated promises.
- Use ecclesial terms consistently. Prefer clarity for ordinary Catholics without flattening Catholic meaning.
- The visual language is a quiet editorial “modern chapel”: deep chapel green, warm ivory, oxblood, restrained antique gold, serif display type, generous space, and subtle sacred ornament.
- Preserve the final doorway-and-decade Rosary icon in `public/evangelizae-icon-v5.svg` and its generated PWA variants unless the user explicitly requests a new identity iteration.
- Avoid generic dashboard styling, glossy religious clip art, visual noise, excessive cards, gratuitous gradients, and decorative motion during prayer.
- Every page must remain coherent in light, dark, and system themes and at 320px mobile, modern phone, 768px tablet, and desktop widths.
- Accessibility is part of the mission: semantic structure, keyboard access, visible focus, sufficient contrast, reduced-motion respect, useful labels, and no serious axe violations.

## Privacy and safety

The beta is local-first and account-free.

- Names, prayer intentions, preferences, Rosary sessions, and history stay on the device unless the user explicitly exports them.
- Do not transmit devotional content or personal prayer behavior to analytics, logs, Sentry, or third parties.
- Sentry is optional and privacy-filtered: no replay, PII, prayer text, intentions, profile data, or local-storage payloads.
- Preserve working JSON export and complete deletion of all Evangelizae browser data.
- Never add a remote write, account dependency, identifier, tracking technology, or new permission without explicit scope and corresponding privacy-copy changes.

## Architecture and implementation rules

### Next.js runtime rule

<!-- BEGIN:nextjs-agent-rules -->
This is not the Next.js you know from training data. The installed version may contain breaking API, convention, and file-structure changes. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed its deprecation notices.
<!-- END:nextjs-agent-rules -->

- This repository is the Next.js/React frontend. The Java/Spring backend lives in a separate repository.
- Never connect the browser directly to a database, vector store, or secret-bearing service. Use the documented HTTPS REST/JSON API.
- Keep the API base URL behind `NEXT_PUBLIC_API_BASE_URL` and update `contracts/evangelizae-v1.openapi.yaml` when the agreed contract changes.
- Use strict TypeScript, App Router conventions for the installed Next.js version, and Server Components by default. Add `'use client'` only when browser state or interaction requires it.
- Avoid reading browser-only state during server render. Access local storage after mount and preserve hydration stability.
- Use Zustand migrations for persisted state changes.
- Service-worker registration is production-only by design; development unregisters workers and clears caches.
- The liturgical day must follow `America/Sao_Paulo` semantics unless the product explicitly introduces user time zones.
- Use pnpm only. `package.json`, `pnpm-lock.yaml`, and `.mise.toml` define the supported toolchain; do not add another lockfile.
- Keep secrets out of `NEXT_PUBLIC_*`, the repository, browser bundles, logs, screenshots, and test artifacts.

## Working method

Before editing:

1. Read `README.md`, the relevant source files and tests, and any directly applicable canonical document.
2. Inspect the working tree and preserve unrelated user changes.
3. Confirm whether the request affects beta scope, Catholic content, persisted data, privacy, accessibility, or the API contract.
4. Read the installed Next.js documentation before changing framework APIs or conventions.

While editing:

- Prefer the smallest complete change that serves the mission.
- Reuse existing tokens, components, copy patterns, and state models.
- Keep loading, empty, offline, stale-data, error, and recovery states honest and usable.
- Do not silently broaden scope or add speculative infrastructure.
- Keep documentation and tests aligned with behavior.

## Verification and release discipline

Run checks proportional to the change. Before a beta release or broad UI/state change, run:

```bash
pnpm check
pnpm test:e2e
```

`pnpm check` covers lint, TypeScript, unit tests, and the production build.

Offline E2E tests must run against `pnpm start` and the production build. Do not interpret service-worker failures from `pnpm dev` as production results, because development intentionally unregisters the service worker. Ensure port 3000 is not occupied by the development server before the production E2E suite.

For relevant changes, also verify:

- direct navigation and recovery routes;
- onboarding, Rosary start/resume/completion, history, export, and deletion;
- production offline reopening after first load;
- light/dark/system themes and responsive breakpoints;
- keyboard and screen-reader basics plus automated accessibility;
- liturgy date, source, freshness, and failure behavior;
- manifest, icons, installability, and social metadata.

Do not call the public beta “ready” solely because local tests pass. Follow `BETA_LAUNCH_CHECKLIST.md`; production API/CORS, liturgy correctness, pastoral review, licensing, DNS/TLS, feedback, real-device PWA smoke tests, and published health checks remain launch gates.

## Definition of done

A change is done only when it:

- advances or safely supports the mission;
- stays inside the authorized product scope;
- preserves Catholic content integrity and user privacy;
- handles relevant responsive, accessible, offline, and failure states;
- includes appropriate tests and documentation;
- passes the required verification without hiding skips or known limitations.
