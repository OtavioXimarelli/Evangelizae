# Evangelizae Backend Requirements (Java 25 + Spring Boot 4)

## Architecture Overview
This document outlines the technical requirements for the future **Evangelizae** backend. The goal is to replace the current frontend mock data layer with a robust, scalable, and secure API built with **Java 25** and **Spring Boot 4**.

## Core Technologies
*   **Java 25**: Leveraging the latest language features (e.g., Virtual Threads for high concurrency, Pattern Matching, Records).
*   **Spring Boot 4**: The foundational framework for REST APIs, Security, and Data Access.
*   **Spring Security (JWT/OAuth2)**: For robust stateless authentication.
*   **Spring Data MongoDB**: The primary database choice to match the document-driven nature of our current data structures (JSON articles, user stats, intentions).

---

## Pillar 1: Veritas (Learn/Teachings)

### 1. Daily Liturgy API
Currently mocked via `src/services/liturgyService.ts`.
*   **Endpoint**: `GET /api/v1/liturgy/daily`
*   **Requirements**:
    *   Return the First Reading, Psalm, Gospel, and an Orthodox Catholic Reflection based on the current liturgical calendar day.
    *   **I18n**: Support `?locale=pt` and `?locale=en`.
    *   **Caching**: Implement Spring `@Cacheable` (e.g., Redis or Caffeine) since daily liturgy changes only once every 24 hours.

### 2. Apologetics API
Currently mocked via `src/data/apologetics.ts`.
*   **Endpoints**:
    *   `GET /api/v1/apologetics` (List all categories/tracts)
    *   `GET /api/v1/apologetics/{id}` (Get specific tract details)
*   **Requirements**:
    *   Store structured data: Objections, Catholic Answers, Scripture References, and Church Father quotes.

---

## Pillar 2: Communio (Connect)

### 1. Faith Circles (Círculos)
*   **Endpoints**:
    *   `POST /api/v1/circles` (Create a circle)
    *   `GET /api/v1/circles/{id}` (View circle details & members)
    *   `POST /api/v1/circles/{id}/join` (Join a circle)
*   **Requirements**:
    *   Users belong to one or more circles.
    *   Circles have localized/private Intention Walls.

### 2. Mentorship (Padrinhos)
*   **Endpoints**:
    *   `POST /api/v1/mentorship/apply` (Apply as mentor or seeker)
    *   `GET /api/v1/mentorship/matches` (Algorithmically suggest pairings)
*   **Security**: Strict role-based access control (`ROLE_MENTOR`, `ROLE_SEEKER`).

---

## Pillar 3: Missio (Mission)

### 1. Evangelization Challenges
*   **Endpoints**:
    *   `GET /api/v1/missions/current` (Get the active monthly challenge)
    *   `POST /api/v1/missions/{id}/checkin` (User confirms they completed the challenge)

---

## User Data & Progress Tracking
Currently handled via `localStorage` (Zustand stores).
*   **Endpoints**:
    *   `POST /api/v1/users/sync` (Sync local offline stats to backend)
    *   `GET /api/v1/users/stats` (Retrieve user streak, total prayers, etc.)

## Implementation Strategy (Spring Boot 4 specifics)
1.  **Virtual Threads (`spring.threads.virtual.enabled=true`)**: Enable Project Loom features natively in Spring Boot 4 to handle thousands of concurrent users checking in or fetching daily liturgy without blocking OS threads.
2.  **DTOs as Records**: Utilize Java Records extensively for API requests/responses (e.g., `public record LiturgyResponse(...)`).
3.  **AOT Compilation**: Consider Spring Native / GraalVM AOT compilation to ensure the backend starts instantly, minimizing cold-start times if deployed in a serverless/containerized environment.
