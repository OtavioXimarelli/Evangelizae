# Evangelizae - Product Requirements Document (PRD)

## 1. Project Overview & Architecture
Evangelizae is a high-performance, Offline-First/Local-First web application that blends personal prayer tracking with digital witness, community missions, and apostolic sharing. Transitioned from "HaveYouPrayedTheRosaryToday", it now functions as a comprehensive missionary hub.

### 1.1 Core Technological Stack
*   **Framework**: Next.js 14/15 (App Router).
*   **Styling**: Tailwind CSS + shadcn/ui (customized for "Modern Cathedral + Marian Light" aesthetics).
*   **Theming**: Exclusive Light (Vatican White) and Dark (Marian Midnight) themes. No mechanical inversion; distinct palettes optimized for reverence and readability.
*   **Animations**: GSAP (ScrollTrigger for narrative flow) + Framer Motion (Layout transitions).
*   **Internationalization (i18n)**: Dual locale (PT/EN) handling via `next-intl`.

## 2. Technical Specifications by Module

### 2.1 Brand Identity & Design System
*   **Pillars**: *Veritas* (Truth/Learn), *Communio* (Community/Connect), *Missio* (Evangelization/Mission).
*   **Typography**: Cinzel (Headings), Manrope (Body).
*   **Glassmorphism**: "Stained Glass" effect implemented via custom `.glass` and `.glass-card` utilities.

### 2.2 Core Application Tools

#### Narrative Landing Page (`/`)
*   **Hero**: High-impact "Be a Light" mission statement.
*   **Testimonium Section**: Social proof feed focusing on **Conversion Stories** and miracles with glassmorphic cards and GSAP reveal animations.
*   **Communio Section**: Interactive mission blocks showing collective progress and active missionary circles.
*   **Missio Section**: Entry point for the Apostolic Toolkit.

#### Veritas (Learn) Hub (`/ensinamentos` -> `/veritas`)
*   **Apologetics Tracts**: Highly visual, bite-sized guides for core dogmas (Eucharist, Papacy) to answer secular/Protestant objections.
*   **Daily Gospel & Reflection**: Integration of daily Mass readings with short orthodox reflections.
*   **MDX Articles**: Beautifully rendered Church teachings and Saints' lives.

#### Communio (Connect) Features
*   **Faith Circles (Círculos)**: Small user-created groups for localized intentions and collective Novenas.
*   **Mentorship (Padrinhos)**: Pairing devout Catholics with seekers or catechumens for guidance.
*   **Global Intentions Wall**: Masonry layout for global prayer requests.

#### Missio (Mission) Toolkit
*   **Apostolic Card Generator**: Customizable design tool for exporting Saint/Scripture quotes with the "Modern Cathedral" aesthetic for social sharing.
*   **Quick Apologetics Tool**: Searchable database of Catholic answers to common faith questions, optimized for mobile defense of the faith.
*   **Evangelization Challenges**: Monthly gamified missions (e.g., "Invite a friend to Mass").

#### Dashboard Overview (`/dashboard`)
... (rest of the file)
*   **Sacred Space**: Stat-driven environment using glassmorphism and SVG-based progress rings (Papal Gold).
*   **Hydration safety**: Strict usage of `useEffect` or dynamic imports for `localStorage` reads.

#### Interactive Guide (`/ferramentas/guia-interativo`)
*   **Modern Cathedral UI**: Theme-aware prayer cards and deterministic 59-node bead sequence.
*   **Hardware APIs**: WakeLock (Screen) and Haptic (Vibration) integration.

#### Intentions Wall (`/ferramentas/mural-intencoes`)
*   **Masonry Grid**: Pure CSS multi-column layout for "Sacred" intent presentation.
*   **Interaction**: Optimistic UI updates for prayer increments.

## 3. Strict Development Constraints

*   **PWA Compliance**: Service Worker caching for core assets and offline fallback.
*   **Animations**: Restriction against `transition: all`. Targeted CSS property transitions only.
*   **Themes**: Adhere to the Papal Gold, Marian Blue, Vatican White, and Marian Midnight hierarchy.
*   **i18n**: All keys must exist in both `messages/en.json` and `messages/pt.json`.

## 4. Mobile Native Excellence

*   **Bottom Sheets**: Mandatory for mobile overlays (Language, More menu).
*   **Gestures**: Swipe-to-dismiss and native haptic patterns (Light Tap, Success Double).
*   **Performance**: `overscroll-behavior-y: contain` on fixed containers to prevent iOS bounce.
