# Evangelizae Rebranding & Missionary Hub Design

**Date:** 2026-05-28
**Status:** Draft / Pending Review
**Project:** Evangelizae (formerly HaveYouPrayedTheRosaryToday)

## 1. Vision & Mission
"Evangelizae" is a complete rebranding and strategic evolution of the platform. It transitions from a personal prayer tracker to a comprehensive Catholic formation and missionary hub. The core mission is to help Catholics deepen their spiritual life through prayer and study, then radiate that faith outward through digital witness.

## 2. Strategic Shift
- **Primary Focus:** Broad Missionary Platform (elevating Teachings and Community to equal footing with the Rosary).
- **Core Value:** Visible Impact. The app serves as a "Lighthouse" for digital evangelization.

## 3. Core Features

### 3.1 Public Witness Feed (*Testimonium*)
- **Purpose:** A global, public stream of faith in action.
- **Content:** Answered prayers, daily scripture insights, and personal testimonies.
- **Visibility:** Accessible to non-logged-in users as the primary "social proof" and attraction point.

### 3.2 Mission Power-ups (*Communio*)
- **Purpose:** Group collaboration to support specific intentions.
- **Mechanism:** Users join "Circles" (groups) that adopt intentions from the Public Feed.
- **Integration:** Daily prayers (Rosary, etc.) and studies logged by members contribute to a collective "support counter" or "mission energy" for the adopted intention.

### 3.3 Apostolic Shareables (*Missio*)
- **Purpose:** Empowering users to evangelize externally.
- **Functionality:** Dynamic image generation (Apostolic Cards) featuring scripture snippets, saint quotes from the Teachings Hub, or personal reflections.
- **Branding:** Consistent "Evangelizae" visual identity to ensure the source is recognized.

## 4. Visual Identity: "Modern Cathedral"
The aesthetic remains rooted in the project's established personality but refined for the new brand.

- **Sacred Materials:** Glassmorphism (simulating stained glass), Gold Leaf accents for primary buttons/borders, and Marble-like textures for backgrounds.
- **Typography:** 
    - **Headers:** *Cinzel* (Serif) for a formal, sacred feel.
    - **Body:** *Manrope* (Sans-serif) for high readability.
- **Latinity:** Integration of Latin terms as secondary labels (e.g., *Testimonium*, *Communio*, *Missio*) to ground the modern UI in Church tradition.

## 5. User Journey: The Narrative Flow
The landing page and onboarding will follow a "Narrative Flow" to maximize user-friendliness and clarity:

1. **Discovery (See the Impact):** The user encounters the Public Witness Feed first.
2. **Action (Join the Prayer):** The user is invited to join a "Circle" to power-up a live mission.
3. **Evangelization (Share the Light):** The user grows through the app and eventually shares their own witness externally.

## 6. Technical Implications
- **Backend Priority:** Transitioning from `localStorage` to a functional NestJS + MongoDB backend is critical to support global feeds and group collaboration.
- **Real-time Updates:** Socket.io or similar technology will be needed for "Live" mission stats in the Command Center dashboard.
- **PWA Enhancements:** Push notifications for mission updates and reminders.

## 7. Success Criteria
- **Engagement:** Time spent in the Witness Feed and Teachings Hub.
- **Conversion:** Rate at which visitors join a Circle to support an intention.
- **Growth:** Number of Apostolic Cards shared to external social platforms.
