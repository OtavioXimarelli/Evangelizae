# Backend Launch Checklist — Beyond Beta to Full Evangelizae

> Companion to `BETA_LAUNCH_CHECKLIST.md` and `contracts/evangelizae-v1.openapi.yaml`.
> Source-of-truth order: `AGENTS.md` > `README.md` > this checklist > OpenAPI > code > mission/technical skeleton docs.
> Stack: Java 25 / Spring Boot 4 / MongoDB 7+ / Atlas Vector Search / Spring AI — see `EVANGELIZAE_TECHNICAL_SKELETON_PT.md:7`.

---

## 0. How to use

Each cycle is a **ship gate**. Do not start Cycle N+1 until N is green in production with pastoral/editorial sign-off. Every item must be `[x]` before go.

---

## Cycle 1 — Accounts & Sync (Next Cycle, `FRONTEND_FULL_REDESIGN_ROADMAP.md:17`)

This unlocks `/auth`, `/users/me`, `/prayer/*`, `/spiritual-plans`. No community/AI yet.

### 1. Architecture & Contract
- [ ] Spring repo scaffold per `TECHNICAL_SKELETON_PT.md:76` (`com.evangelizae.backend`, `compose.yaml:175`) with `application.yml` + `application-dev.yml` + `application-prod.yml`
- [ ] OpenAPI bumped to `1.0.0-cycle1` and published; `contracts/evangelizae-v1.openapi.yaml` is mirror (backend canonical)
- [ ] CORS restricted to `APP_CORS_ALLOWED_ORIGINS` exact (no `*`), reflects `NEXT_PUBLIC_APP_URL` without trailing slash
- [ ] Unified `ApiError` (`TECHNICAL_SKELETON_PT.md:160`) via `@ControllerAdvice` for all controllers: `{timestamp, status, error, code, message, path}`
- [ ] `GET /api/health` returns 200 in Docker (`README.md:97`) — add `/api/v1/health` alias for frontend

### 2. Auth & Users
- [ ] `POST /api/v1/auth/register` — `email` unique indexed, `password` bcrypt 12, `fullName`, `preferredLocale: pt-BR`. 201 + JWT pair. 409 `EMAIL_TAKEN`.
- [ ] `POST /api/v1/auth/login` — returns `accessToken` (15-60 min, HS512/RS256) + `refreshToken` (httpOnly Secure SameSite=Strict, 30d rotation). Rate limit 5/15min per IP+email.
- [ ] `POST /api/v1/auth/refresh` — rotates refresh, invalidates old. 401 `REFRESH_EXPIRED`.
- [ ] `POST /api/v1/auth/logout` — invalidates refresh (blocklist until expiry).
- [ ] `POST /api/v1/auth/forgot-password` + `POST /api/v1/auth/reset-password` — token 1h, single-use, email template pt-BR.
- [ ] `POST /api/v1/auth/verify-email` — magic link/code, 24h, idempotent.
- [ ] `GET /api/v1/users/me` (Bearer) + `PATCH /api/v1/users/me` — name, locale, preferences. Validate `pt-BR` only.
- [ ] `SECURITY_JWT_SECRET` >=64 bytes hex, not in `NEXT_PUBLIC_*`, not in repo/bundle/logs. Rotate procedure documented.
- [ ] `UserDocument` indexes: `email unique`, `createdAt`. Fields: `id, email, passwordHash, fullName, preferredLocale, roles [ROLE_USER], spiritualPlan, stats, preferences, createdAt, updatedAt`.
- [ ] Bean validation `@Valid` on all DTOs, i18n error `message` via `Accept-Language`.

### 3. Prayer Sync (Offline-First, Idempotent)
- [ ] `POST /api/v1/prayer/checkin` — body `CheckInRequestDto:281` `{mysteryType: gozosos|luminosos|dolorosos|gloriosos, prayedBeadsCount >=50, intentions?: string[<=5][<=140], reflection?: string[<=2000]}`. Validates `mysteryType` vs `getDailyMysteryType()` if needed. Creates one `PrayerCompletion` per `localDate` per user. 409 `ALREADY_CHECKED_IN_TODAY`.
- [ ] Idempotency: `Idempotency-Key: uuid` header required, stored 24h (`idempotency_keys` TTL). Replay returns same result.
- [ ] Time correctness: store `localDate: YYYY-MM-DD`, `completedAt: Instant`, `timeZone: America/Sao_Paulo` canonical. Streak computed server-side identical to `src/store/usePrayerStore.ts:55` (`getPrayerStats`): dedup by `localDate`, sort desc, gap ===1 day = consecutive.
- [ ] `GET /api/v1/prayer/history?from=&to=&limit=7&cursor=` — returns for WeekDots (`components/common/WeekDots.tsx`). 400 if range >90d.
- [ ] `GET /api/v1/prayer/stats` — `{consecutiveDays, totalRosariesPrayed, lastCompletionDate, completedToday}`.
- [ ] `prayer_completions` index `(userId, localDate) unique`, `userId+completedAt desc`.
- [ ] Zustand migration preserved: `evangelizae-prayer-session` version 2 shape (`src/store/usePrayerStore.ts:142`). Backend accepts legacy payload but stores normalized.
- [ ] `POST /api/v1/users/me/migrate` — payload = exported JSON from Settings export (`src/app/[locale]/settings/page.tsx`). `Idempotency-Key` required. Merges: dedup by `localDate`, union `intentions` (local-only, not sent to analytics). 200 with merged stats.
- [ ] `GET /api/v1/users/me/state` — pull for client reconciliation (preferences + stats + recent completions). ETag/Cache-Control.

### 4. Spiritual Plan (30-Day)
- [ ] `POST /api/v1/spiritual-plans` `{goal: HABIT_FORMATION|DEEPEN_FAITH, durationDays: 30}` — one active per user.
- [ ] `GET /api/v1/spiritual-plans/current` + `PATCH` progress (`daysCompleted[]` derived from completions, not writable directly).
- [ ] `spiritual_plans` collection `{id, userId @Indexed, goal, startDate, endDate, status: active|completed|abandoned, createdAt}`.

### 5. Privacy, LGPD & Data
- [ ] `GET /api/v1/users/me/export` — returns JSON with user + completions + plans + preferences (same shape as frontend export). No liturgy/prayer text truncated.
- [ ] `DELETE /api/v1/users/me` — hard delete user + completions + plans + push subscriptions + idempotency keys. 204. Document 30-day soft-delete if used. Also clears Atlas vectors if AI added.
- [ ] No prayer `intentions`/`reflection`/rosary text in logs, Sentry, or analytics. Sentry `beforeSend` filter tested.
- [ ] Update copy in `/pt/privacy` to describe server storage, retention (completions until deletion, idempotency 24h, logs 30d), and export/delete paths.
- [ ] `preferences` persisted server-side `{readerSize: normal|large|xl, theme, prayerWindow, reminderTime}` mirrors `usePreferencesStore.ts`.

### 6. Sync Verification (must pass)
- [ ] Fresh install → onboard → `POST /prayer/checkin` → close tab → `GET /prayer/stats` shows `completedToday: true`, `consecutiveDays: 1`
- [ ] Offline: block network → `POST /prayer/checkin` queued via React Query → restore → checkin appears exactly once (idempotency)
- [ ] Anonymous export → register → `POST /users/me/migrate` with same `Idempotency-Key` twice → second is 200 no duplicate
- [ ] Second checkin same `localDate` → 409 `ALREADY_CHECKED_IN_TODAY`
- [ ] `DELETE /users/me` → `GET /users/me` 401, Mongo shows zero docs for `userId`
- [ ] `GET /users/me/export` matches frontend `src/app/[locale]/settings/page.tsx` export shape (plus server ids)

### 7. Infra & Release Gate
- [ ] `compose.yaml` services `mongodb`, `backend`, `frontend` build + `docker compose up --build` green, `GET /api/health` 200 in published container.
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://api.evangelizae.org/api/v1` set without trailing slash, TLS, DNS, `SENTRY_ENVIRONMENT=production`.
- [ ] `pnpm check` + `pnpm test:e2e` vs `pnpm start` (production) green; `pnpm dev` SW-unregistered not mistaken for failure.
- [ ] Rate limits, validation, and CORS tested from real `https://evangelizae.org`.

**Go/No-Go:** Cycle 1 ships only when health, auth, idempotent checkin, migrate, export, delete, and `pnpm check` + `test:e2e` are green with `America/Sao_Paulo` date correctness proven.

---

## Cycle 2 — Communion (Prayer Wall)

Depends on Cycle 1 auth.

- [ ] `POST /api/v1/intentions` — auth, 3/day, `{text: 1..280, isAnonymous: bool}` → `pending`. 201.
- [ ] `GET /api/v1/intentions?status=approved&limit=20&cursor=` — public, approved only, explicit pagination (no infinite feed).
- [ ] `POST /api/v1/intentions/{id}/prayed` — idempotent per `userId` (one pray per user, unique `prayedBy`). Increments `prayedCount`.
- [ ] `DELETE /api/v1/intentions/{id}` — owner only.
- [ ] `POST /api/v1/intentions/{id}/report` — `{reason: spam|offensive|other, detail?}` → moderation queue.
- [ ] `GET /api/v1/moderation/intentions/queue` + `POST /api/v1/moderation/intentions/{id}/approve|reject` — `ROLE_MODERATOR`. Audit `moderatedAt, moderationReason`.
- [ ] `intentions` collection `{id, userId, text, isAnonymous, status: pending|approved|rejected|hidden, prayedCount, prayedBy: Set<userId>, createdAt, moderatedAt, reports[]}`. Index `status+createdAt desc`, `userId`.
- [ ] Auto-filter profanity/URL spam + human review before `approved`. No public comments endpoint exists by design (return 404 if attempted).
- [ ] `Testimonies` — `POST /api/v1/testimonies` `{graceText: 10..1000, intentionId?}` → `pending`, `GET /api/v1/testimonies?approved=true`, same moderation queue.
- [ ] Rate limit: 3 intentions/day, 20 prayed/day. Anti-abuse: block repeat text hash.
- [ ] Verify: publish → pending → moderator approve → appears in feed → second user `prayed` → count 1 → same user second `prayed` still 1 (idempotent) → report → hidden.

---

## Cycle 3 — Formation (Bible, Catechism, Saints, Live Liturgy)

### Liturgy — replace provisional bridge (`src/data/embeddedDailyLiturgy.ts`, `LITURGY_CONTENT_SOURCES.md:34`)
- [ ] `GET /api/v1/liturgy/today?timezone=America/Sao_Paulo&locale=pt-BR` already in contract — provider integration live (CNBB/licensed). Response shape `DailyLiturgy:36` unchanged.
- [ ] Freshness: `source.freshness: LIVE|CACHED`, `fetchedAt`. If provider down, serve same-date cache only. Otherwise `503 LITURGY_UNAVAILABLE` (`ApiError.code`). Never serve yesterday as today.
- [ ] `liturgy_days` `{date, locale, title, color, prayers, groups, source, fetchedAt, expiresAt TTL 60d}`. Index `date+locale unique`.
- [ ] `POST /api/v1/admin/liturgy/refresh` + `POST /api/v1/admin/liturgy/corrections` — `ROLE_ADMIN`, pastoral review audit log, notifies frontend to purge.
- [ ] Remove `embeddedDailyLiturgy.ts` + `embeddedNotice` i18n key only after provider proven for 7 consecutive days across `America/Sao_Paulo` midnight.
- [ ] Verify: provider down at 14:00 → `GET /liturgy/today` still 200 `CACHED` same date; provider down + no cache at 00:01 → 503 with `LITURGY_UNAVAILABLE`.

### Bible / Catechism / Saints / Search
- [ ] `bible_verses` `{book, chapter, verse, text_pt, text_la?}` — translation documented in `LITURGY_CONTENT_SOURCES.md` (Figueiredo 1866 or licensed CNBB). No unlicensed CNBB text.
- [ ] `catechism_paragraphs` `{number: 1..2865, text_pt, keywords}`. `saints` `{slug, name, feastDate, biography_pt, patronage}`.
- [ ] `GET /api/v1/bible/search?q=&book=&chapter=` + `GET /api/v1/bible/{book}/{chapter}`, `GET /api/v1/catechism/search?q=` + `GET /api/v1/catechism/{number}`, `GET /api/v1/saints/today`, `GET /api/v1/saints/{slug}`, `GET /api/v1/search/global?q=` (unified).
- [ ] Full-text indexes (`text`/`search`) on bible, catechism, saints. Limit `q >=3` chars, 20 results/page, highlight excerpts.

---

## Cycle 4 — Church (Parishes & Physical Bridge)

- [ ] `parishes` `{id, name, diocese, address, lat,lng 2dsphere, phone, verified}` + `mass_schedules` `{parishId, weekday 0-6, time, type: mass|confession|adoration, language}` + `parish_events` `{id, parishId, title, type: retreat|pastoral|event, startsAt, endsAt}`.
- [ ] `GET /api/v1/parishes/nearby?lat=&lng=&radius=10km` (max 20, distance sorted), `GET /api/v1/parishes/{id}`, `GET /api/v1/parishes/{id}/schedules`, `GET /api/v1/events?from=&to=&parishId=&type=`.
- [ ] Verification: parish `verified` via diocese manual; unverified hidden from `nearby` by default.
- [ ] Admin: `POST /api/v1/admin/parishes` + `PATCH /api/v1/admin/parishes/{id}/verify` — `ROLE_ADMIN`.

---

## Cycle 5 — Catholic AI RAG + Notifications + Mobile-Ready

### AI (`TECHNICAL_SKELETON_PT.md:148`, `MISSION_PT.md:34`)
- [ ] Corpus: Bible, CIC, Code of Canon Law, Vatican docs, CNBB, Saints/Doctors — each chunk `{source, citation, url, text}` with `embedding: number[1536]`.
- [ ] Atlas Vector Search index `vectorIndex: {numDimensions: 1536, similarity: cosine}`, Spring AI `text-embedding-3-small` + `gpt-4o-mini`.
- [ ] `POST /api/v1/ai/ask` `{question: 5..500, conversationId?}` → `{answer, citations: [{source, excerpt, url}], confidence: 0..1, refused: bool}`. If `confidence <0.75` or no chunk → refuse with canonical pt-BR: *“Não encontrei uma resposta direta nas fontes oficiais do Magistério católico indexadas para esta dúvida específica. Recomendo consultar um sacerdote de sua paróquia ou o Catecismo da Igreja Católica para uma orientação espiritual e doutrinal segura.”*
- [ ] `GET /api/v1/ai/conversations` + `GET /api/v1/ai/conversations/{id}` — history per user, paginated.
- [ ] Store every Q/A + citations + model version + confidence for theological audit. `ROLE_ADMIN` review queue `GET /api/v1/admin/ai/qa?refused=true`.
- [ ] Rate limit 20/day per user, 100/day per IP. No devotional text in model training. Stream via SSE optional.
- [ ] Verify: ask off-corpus question → `refused: true` + no hallucinated citation; ask on-corpus → `citations.length >=1` with valid `url`.

### Notifications (Gentle Only, `AGENTS.md:31` — no invasive pushes)
- [ ] `POST /api/v1/push/subscriptions` `{endpoint, keys: {p256dh, auth}}` + `DELETE`, `PATCH /api/v1/users/me/notification-preferences` `{prayerReminder: bool, intentionPrayed: bool, parishEvent: bool}`.
- [ ] Prayer reminder respects `preferences.reminderTime` window + quiet hours. Triggers only if `completedToday: false`.
- [ ] Verify: set reminder 08:00 → complete rosary 07:50 → no push 08:00; no completion → push 08:00 → unsubscribe → no push.

---

## Cross-Cycle Non-Negotiables

- [ ] **No ads, paywalls, premium, leaderboards, coins, infinite feed** — do not add those tables/fields (`AGENTS.md:28`).
- [ ] **Veritas:** any prayer/mystery/fruit/biblical ref change needs pastoral sign-off before prod (`AGENTS.md:33`). See `src/services/rosaryEngine.ts:73`.
- [ ] **Accessibility:** every new page passes axe + keyboard + VoiceOver/TalkBack + 320px/768px/desktop + light/dark/system.
- [ ] **Offline:** rosary remains usable after first load (`src/app/sw.ts`, `public/evangelizae-icon-v5.svg` preserved). New data is additive, never blocks prayer start.
- [ ] **Secrets:** `SECURITY_JWT_SECRET`, `SPRING_AI_OPENAI_API_KEY`, `SPRING_DATA_MONGODB_URI` never in `NEXT_PUBLIC_*`, bundle, logs, or screenshots.
- [ ] **Build:** `pnpm check` (lint+typecheck+unit+build) + `pnpm test:e2e` vs `pnpm start` green before any cycle tag.

---

## Definition of Done (per `AGENTS.md:86`)

A cycle is done only when: mission-aligned, in authorized scope, Catholic content pastorally reviewed, privacy/LGPD complete (export+delete), responsive/accessible/offline/failure states honest, tests + docs updated, verification green without hidden skips.

*Feedback channel:* GitHub `feedback` label (`BETA_LAUNCH_CHECKLIST.md:15`) stays open for all cycles.
