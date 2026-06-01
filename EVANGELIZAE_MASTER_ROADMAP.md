# Evangelizae - Master Roadmap ✝️

> **Vision:** A digital missionary hub designed to spread the Gospel, teach Catholic Truth, connect the faithful, and actively bring souls to the Catholic Church.

## Core Pillars
This roadmap is structured around the three pillars of the Evangelizae brand: **Veritas** (Learn/Teachings), **Communio** (Connect/Community), and **Missio** (Mission/Evangelization).

---

## 📖 Pillar I: Veritas (Learn & Teach)
*Spreading the Truth of Christ and the Church's Traditions.*

### Phase 1: Foundation (Current)
- [x] Basic MDX article rendering (`/ensinamentos`).
- [x] St. Louis de Montfort interactive Rosary Guide.

### Phase 2: Daily Life & Defense (Next Steps)
- [ ] **Daily Gospel & Reflection:** Integrate daily Mass readings with orthodox, bite-sized Catholic reflections to ground users in Scripture.
- [ ] **Apologetics Tracts (Visual Guides):** Create highly visual, easily digestible guides explaining core dogmas (Eucharist, Papacy, Marian Dogmas) specifically designed to answer common secular and Protestant objections.

### Phase 3: Future Expansion
- [ ] *Deep Dive Courses:* Structured learning paths on Church history and Patristics (Planned for the future).

---

## 🤝 Pillar II: Communio (Connect)
*Building a strong faith through community and shared prayer.*

### Phase 1: Foundation (Current)
- [x] Testimonium Feed (Refined glassmorphic witness sharing).
- [x] Intentions Wall (Masonry grid for global prayer requests).

### Phase 2: Deepening Connections
- [ ] **Conversion Story Feed:** Elevate the Testimonium section to focus heavily on profound faith stories, answered prayers, and miracles to inspire hope.
- [ ] **Faith Circles (Círculos de Fé):** Enable users to create or join small, localized, or topic-based groups. Circles will allow for shared Novenas and private intention walls.

### Phase 3: Mentorship
- [ ] **Mentorship (Padrinhos) Program:** A secure system connecting experienced, devout Catholics with catechumens, RCIA candidates, or curious seekers for guidance and faith sharing.

---

## 🕊️ Pillar III: Missio (Mission)
*Equipping the faithful to bring souls to the Church.*

### Phase 1: Foundation (Current)
- [x] Mission Landing Page Section (UI & Staggered Reveal).

### Phase 2: The Evangelization Toolkit
- [ ] **Apostolic Card Generator:** A fully functional tool allowing users to select a Saint quote or Bible verse, apply the "Modern Cathedral" aesthetic, and export a high-quality image for Instagram/WhatsApp.
- [ ] **Quick Apologetics Tool:** A fast, searchable database (accessible on mobile) providing orthodox Catholic answers to common questions (e.g., "Where is purgatory in the Bible?"), equipping users for real-world evangelization.

### Phase 3: Active Outreach
- [ ] **Evangelization Challenges:** Gamified, monthly community missions (e.g., "Invite a friend to Mass this Sunday", "Share a saint quote"). Users can "Check-in" to these missions, fueling the Communio feed.

---

## Technical Priorities to Support this Roadmap
1. **Backend Implementation (NestJS + MongoDB):** Required immediately for Faith Circles, Mentorship pairing, and the Apologetics database.
2. **Image Generation API:** Required for the Apostolic Card Generator (likely using Vercel `next/og` or a canvas-based solution).
3. **Advanced i18n:** Ensure all apologetics and daily gospel readings are perfectly synced in English and Portuguese.
