# Evangelizae — Technical Skeleton, Architecture & AI Agent Operating Manual

> **Status:** Official Technical Blueprint & Project "From Zero" Initialization Guide  
> **Version:** 2.0 (AI-Agent Ready)  
> **Overall Architecture:** Decoupled Monorepo/Polyrepo (Next.js/React Frontend + Java/Spring Boot Backend + MongoDB)  
> **Language of this Document:** English (`en`)

---

## 1. Repository Topology & Strict Separation of Concerns (Frontend vs. Backend)

To ensure enterprise scalability, robust security, and independent deployment cycles, the **Evangelizae** ecosystem enforces a **strict architectural boundary between Frontend and Backend**. Whether structured as a Monorepo (`/frontend` and `/backend` under one root) or across separate repositories, the following boundary rules are **unbreakable**:

```mermaid
graph LR
    subgroup Client Side / Frontend
        Next[Next.js 15 App Router - Port 3000]
        Store[Zustand Local Store / localStorage]
    end
    
    subgroup Network Boundary
        CORS[CORS Gateway & JWT Bearer Header]
    end
    
    subgroup Server Side / Backend
        API[Spring Boot 4 / Java 25 - Port 8080]
        Security[Spring Security 6 Stateless Filter]
        Mongo[(MongoDB 7+ - Port 27017)]
        Atlas[(MongoDB Atlas Vector Search / OpenAI)]
    end
    
    Next <-->|HTTPS / REST / JSON| CORS
    CORS <--> API
    API --> Security
    API --> Mongo
    API --> Atlas
    
    classDef frontend fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef backend fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    class Next,Store frontend;
    class API,Security,Mongo,Atlas backend;
```

### 1.1 Architectural Isolation Rules
1. **Zero Direct Access:** The Frontend (`Next.js`) **must never** connect directly to the `MongoDB` database or to AI vector engines. All data flows, authentication requests, theological RAG checks, and document persistence **must** pass exclusively through the Backend REST endpoints (`Spring Boot`).
2. **REST/JSON Contract:** All communication across the network boundary must use HTTP requests with `Content-Type: application/json`.
3. **Stateless Authentication (CORS + Bearer Token):**
   * The Backend exposes restricted CORS headers allowing only the Frontend origin (`NEXT_PUBLIC_APP_URL`).
   * Upon successful registration/login (`POST /api/v1/auth/login`), the Backend issues a **JWT (JSON Web Token)** signed with an HS512/RS256 secret.
   * The Frontend stores this token securely in memory or an HTTP-Only cookie and attaches it to all authenticated API calls via header: `Authorization: Bearer <jwt_token>`.

### 1.2 "From Zero" Project Layout (Recommended Monorepo for AI Agents)

When initializing the repository from zero, the AI Agent must structure the codebase exactly as follows:

```
evangelizae-root/
├── compose.yaml                      # Docker Orchestration (MongoDB 7+, Mongo Express, Backend, Frontend)
├── docs/                             # Official Project Manifestos & Blueprints (PT/EN)
├── frontend/                         # Next.js 15 / React 19 / TypeScript Web App
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── messages/                     # i18n Dictionaries (pt.json, en.json)
│   ├── public/                       # Sacred icons, manifest.json, PWA assets
│   └── src/
│       ├── app/[locale]/             # Pages (Sanctuary, Guided Rosary, Liturgy, Intentions, AI, Profile)
│       ├── components/               # Cathedral Header, Sacred Banners, UI Primitives
│       ├── hooks/                    # Hydration Shields & React Query Mutators
│       ├── i18n/                     # next-intl Routing & Configuration
│       ├── services/                 # Strongly-typed Axios/Fetch clients targeting Spring API
│       ├── store/                    # Zustand Stores with Offline-First resilience
│       └── types/                    # DTO Contracts mirrored from Backend Records
└── backend/                          # Java 25 / Spring Boot 4 / MongoDB Application
    ├── pom.xml (or build.gradle)
    ├── src/main/java/com/evangelizae/backend/
    │   ├── EvangelizaeApplication.java
    │   ├── config/                   # Security, Mongo, Loom (Virtual Threads), CORS, Spring AI
    │   ├── domain/                   # Domain Entities (@Document, Records, Repositories, Services)
    │   ├── security/                 # JWT Filters & Token Providers
    │   └── web/                      # REST Controllers & Java Record DTOs
    └── src/main/resources/
        ├── application.yml           # Spring Boot General Config
        ├── application-dev.yml       # Development / Local Docker Profile
        └── application-prod.yml      # Cloud Production Profile
```

---

## 2. Sensitive Environment Variables & Configuration Guide (`.env`)

To allow any AI Agent or human engineer to onboard smoothly on day zero without leaking credentials, configuration must be strictly separated across architectural layers using `.env.example` templates.

### 2.1 Frontend Variables (`frontend/.env.example`)
The Frontend must only expose variables prefixed with `NEXT_PUBLIC_` to the browser client. Server-side secrets must never enter client bundles.
```env
# Spring Boot Java API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# App Identity & Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# Feature Flags (Phased feature rollouts for MVP)
NEXT_PUBLIC_FEATURE_CURSOR_GLOW=true
NEXT_PUBLIC_FEATURE_COMMUNITY_COMMENTS=false # Strictly disabled in MVP per theological/fraternal rules
```

### 2.2 Backend Variables (`backend/.env.example` / `application-dev.yml`)
The Backend centralizes **all** sensitive credentials, cryptographic secrets, database strings, and LLM API keys.
```env
# Core MongoDB Connection
SPRING_DATA_MONGODB_URI=mongodb://root:secret@localhost:27017/evangelizae_core?authSource=admin
SPRING_DATA_MONGODB_DATABASE=evangelizae_core

# JWT Security (Secret key HS512 with a minimum of 64 hexadecimal characters)
SECURITY_JWT_SECRET=8f9d2a1b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
SECURITY_JWT_EXPIRATION_MILLISECONDS=86400000 # 24 hours

# Spring AI & Catholic RAG (OpenAI / Atlas Vector Search)
SPRING_AI_OPENAI_API_KEY=sk-proj-................................................
SPRING_AI_OPENAI_CHAT_OPTIONS_MODEL=gpt-4o-mini
SPRING_AI_OPENAI_EMBEDDING_OPTIONS_MODEL=text-embedding-3-small

# CORS Configuration (Allowed Client Origins)
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,https://evangelizae.org
```

---

## 3. Mandatory AI Agent Operating Guidelines & Rules of Engagement

Whenever an AI Agent (such as Antigravity/Gemini or subagents) is invoked to create, refactor, or debug code across the **Evangelizae** codebase, it must check and adhere to these **6 Golden Rules**:

### 🛡️ Rule 1: Absolute Preservation of the Guided Rosary Engine
The interactive Guided Rosary engine (`guia-interativo`) and Day Mystery calculator (`misterios-do-dia`) represent the **spiritual heart of the platform**.
* **What the Agent MUST do:** When initializing from zero or refactoring, the Agent **must fully port/recreate `buildRosarySequence()` logic**, the visual `BeadMap` crown, and `localStorage: rosary-guide-session` resumption persistence so that users can pray seamlessly.
* **What the Agent MUST NEVER do:** Never simplify, truncate, or remove Rosary steps (Sign of the Cross, Montfort Offering, Apostles' Creed, Our Father, Hail Marys, Glory Be, Fatima Prayer, Salve Regina) under the pretext of "cleaning up code".

### 🌍 Rule 2: Zero Hardcoded Strings (Strict i18n Enforcement)
* Any text rendered to the user (button labels, headers, error messages, scripture reflections) **must never** be hardcoded directly into JSX/TSX components.
* All UI strings must be externalized and synchronized across `frontend/messages/pt.json` (Primary language) and `frontend/messages/en.json` (Secondary language).
* Use `next-intl` hooks (`useTranslations` for Client Components, `getTranslations` for Server Components).

### ⛪ Rule 3: Magisterial Guardrails in Catholic AI & RAG
When building `MagisteriumAiService.java` in Spring Boot:
* The AI **must be configured with an non-negotiable System Prompt** instructing it to ground all answers exclusively in the Catechism of the Catholic Church, Holy Scripture, Canon Law, Vatican documents, and Saints.
* **Anti-Hallucination Guardrail:** If vector retrieval in MongoDB Atlas Vector Search returns low similarity scores (`< 0.75`) or finds no official Magisterial source on the user's inquiry, the AI **must refuse theological speculation** and output:
  > *"I did not find a direct authoritative answer within our indexed Catholic Magisterium sources for this specific question. I recommend consulting a parish priest or the Catechism of the Catholic Church for safe spiritual and doctrinal guidance."*

### ⚡ Rule 4: Hydration Safety & Offline-First Resilience
In Frontend (`Next.js 15` with SSR):
* Reading `localStorage` for theme preferences (`rosario-theme`), JWT tokens, or Zustand daily streaks (`usePrayerStore`) **must never** occur during initial server-side component rendering.
* The Agent must wrap local storage access in `useIsMounted()` custom hooks or `useEffect` loops (`typeof window !== 'undefined'`) to prevent `Hydration failed because the initial UI does not match what was rendered on the server` errors.
* **Offline-First Synchronization:** The user must be able to pray the Rosary offline using cached Zustand state. Once internet connectivity is restored, React Query triggers `POST /api/v1/prayer/checkin` to persist the streak in MongoDB on the Backend.

### 🔒 Rule 5: Standardized API Error Handling & DTO Contracts
All Spring Boot REST controllers must intercept exceptions (`@ControllerAdvice`) and return a standardized JSON error payload so the Frontend can display clean, localized error notifications via `Toaster`:
```json
{
  "timestamp": "2026-07-12T23:35:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "You have already submitted a Rosary check-in today.",
  "path": "/api/v1/prayer/checkin"
}
```

---

## 4. Complete "From Zero" Docker Orchestration (`compose.yaml`)

To allow any AI Agent or developer to spin up the entire local environment with a single command (`docker compose up --build`), the root directory must include:

```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: evangelizae-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: secret
      MONGO_INITDB_DATABASE: evangelizae_core
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express:latest
    container_name: evangelizae-mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: secret
      ME_CONFIG_MONGODB_SERVER: mongodb
    depends_on:
      - mongodb

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: evangelizae-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://root:secret@mongodb:27017/evangelizae_core?authSource=admin
      SECURITY_JWT_SECRET: 8f9d2a1b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
      APP_CORS_ALLOWED_ORIGINS: http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: evangelizae-frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8080/api/v1
    depends_on:
      - backend

volumes:
  mongo_data:
```

---

## 5. Java Domain Skeleton (`com.evangelizae.backend`)

### 5.1 MongoDB Entity: `UserDocument.java`
```java
package com.evangelizae.backend.domain.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Set;

@Document(collection = "users")
public class UserDocument {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    
    private String passwordHash;
    private String fullName;
    private String preferredLocale; // "pt" or "en"
    private Set<String> roles;      // e.g., Set.of("ROLE_USER")
    
    private SpiritualPlan spiritualPlan;
    private UserStats stats;

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;

    // Constructors, Getters & Setters
}
```

### 5.2 DTO Record: `CheckInRequestDto.java` (Java 25 Record Pattern)
```java
package com.evangelizae.backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.util.List;

public record CheckInRequestDto(
    @NotBlank(message = "Mystery type (gozosos, luminosos, dolorosos, gloriosos) is required.")
    String mysteryType,

    @Min(value = 50, message = "The Rosary must have at least 50 Hail Marys prayed.")
    int prayedBeadsCount,

    List<String> intentions,
    String reflection
) {}
```

### 5.3 Prayer REST Controller: `PrayerController.java`
```java
package com.evangelizae.backend.web.controller;

import com.evangelizae.backend.domain.prayer.PrayerService;
import com.evangelizae.backend.web.dto.CheckInRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prayer")
public class PrayerController {

    private final PrayerService prayerService;

    public PrayerController(PrayerService prayerService) {
        this.prayerService = prayerService;
    }

    @PostMapping("/checkin")
    public ResponseEntity<Void> submitCheckIn(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CheckInRequestDto request) {
        prayerService.registerRosaryCheckIn(userDetails.getUsername(), request);
        return ResponseEntity.ok().build();
    }
}
```

By following this exact architectural layout, network separation, `.env` management, and AI operating guidelines, any autonomous AI agent or engineering team can build **Evangelizae from zero with absolute precision, enterprise security, and theological fidelity**.
