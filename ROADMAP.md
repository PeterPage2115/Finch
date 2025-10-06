# ROADMAP - Tracker Kasy

**Strategic Long-Term Plan** 🗺️  
**Vision:** Open-source self-hosted personal finance tracker with advanced analytics

---

## 📍 Current State (October 2025)

**Version:** v0.6.0 (In Progress - Phase 3 pending)  
**Status:** MVP + Accessibility Foundation ✅
- ✅ Authentication (mock JWT)
- ✅ Transactions CRUD
- ✅ Categories management (visual IconPicker, 50+ icons)
- ✅ Budgets with progress tracking
- ✅ Reports with charts (DateRangePicker, SummaryCards, CategoryPieChart)
- ✅ Dashboard with widgets
- ✅ Mobile Drawer Menu (hamburger working)
- ✅ aria-live Regions (WCAG 2.1 AA partial compliance)
- 📋 Screen reader testing pending (v0.6.0 Phase 3)

**Tech Stack:**
- Frontend: Next.js 15, React 19, TypeScript, Tailwind v4
- Backend: NestJS, Prisma, PostgreSQL
- Deployment: Docker Compose (self-hosting ready)

---

## 🎯 Q4 2025 (October - December)

### v0.6.0 - Accessibility (Oct 2025) - IN PROGRESS
**Goal:** WCAG 2.1 AA compliance  
**Status:** Phase 1 ✅, Phase 2 ✅, Phase 3 📋 Pending

**Completed:**
- ✅ Mobile Drawer Menu (Phase 1)
- ✅ aria-live regions for screen reader notifications (Phase 2)
- ✅ 10 accessible notifications (dashboard + categories)

**Pending:**
- 📋 Comprehensive screen reader testing (NVDA/VoiceOver) - 30 min
- 📋 Focus trap alternative (v0.6.1 - deferred due to AnimatePresence conflict)

**Impact:** Etyczne zobowiązanie, dostępność dla wszystkich użytkowników

### v0.7.0 - Testing Suite (Oct-Nov 2025)
**Goal:** 70%+ code coverage przed v1.0
- Backend: Unit tests (Services), Integration tests (API)
- Frontend: React Testing Library, Playwright E2E
- CI/CD: GitHub Actions (test na PR)
**Impact:** Stabilność, pewność przy zmianach

### v0.8.0 - Real Authentication (Nov 2025)
**Goal:** Produkcyjna autentykacja zamiast mock JWT
- User profile page (edit email, password, avatar)
- Password reset flow (email tokens)
- Email verification (opcjonalnie)
- Session management (refresh tokens)
**Impact:** Gotowość do prawdziwych użytkowników

### v0.9.0 - Advanced Reports (Nov-Dec 2025)
**Goal:** Głębsza analityka finansowa
- Wykresy per kategoria (bar chart, pie chart)
- Trends timeline (wydatki miesiąc do miesiąca)
- Export CSV/PDF
- Custom date ranges
**Impact:** Użytkownik widzi "gdzie idą pieniądze"

---

## 🚀 v1.0.0 - "Production Ready" (January 2026)

**Milestone:** Pierwsza stabilna wersja, gotowa do self-hostingu dla końcowych użytkowników

### Core Features Complete
- ✅ Wszystkie podstawowe funkcje (Transactions, Categories, Budgets, Reports)
- ✅ Real Authentication (profile, password reset, email verification)
- ✅ WCAG 2.1 AA compliance
- ✅ 70%+ test coverage
- ✅ Docker Compose one-command setup

### Polish & UX
- Dark mode pełne wsparcie (wszystkie komponenty czytelne)
- Responsive design (mobile-first)
- Animations & transitions (framer-motion)
- Toasts/notifications system (zustand store)
- Empty states & error handling

### Documentation
- README.md z instalacją Docker
- User guide (screenshots, use cases)
- API documentation (Swagger/OpenAPI)
- Contributing guide dla open-source contributors

### Performance
- Lighthouse score 90+ (Performance, Accessibility, Best Practices)
- Optimistic UI updates (immediate feedback)
- Data caching (React Query / SWR)
- Image optimization (Next.js Image)

---

## 🌟 v1.x - Post-Launch Features (Q1-Q2 2026)

### v1.1.0 - Multi-Currency Support (Feb 2026)
- PLN, USD, EUR, GBP presets
- Currency conversion API (exchangerate-api.com)
- Default currency setting
- Multi-currency transactions
**Impact:** Międzynarodowi użytkownicy

### v1.2.0 - Recurring Transactions (Mar 2026)
- Szablon recurring transaction (miesięczny czynsz, subskrypcje)
- Cron job generuje transakcje automatycznie
- Edit/delete recurring patterns
- Notification przed auto-generacją
**Impact:** Automatyzacja, oszczędność czasu

### v1.3.0 - Savings Goals (Apr 2026)
**Decyzja architektoniczna:** Savings ≠ Budgets
- Budgets = kontrola wydatków (reactive)
- Savings Goals = cele oszczędnościowe (proactive, np. "Wakacje 2026 - 5000 PLN")
- Progress tracking (contributed amount vs target)
- Integration: "Odłóż 500 PLN do celu Wakacje"
**Impact:** Motywacja do oszczędzania

### v1.4.0 - Tags & Advanced Filtering (May 2026)
- Custom tags dla transakcji (#zakupy, #prezent, #praca)
- Multi-tag filter w Reports
- Tag clouds (most used tags)
- Quick filters: "All #prezent last 3 months"
**Impact:** Flexible organization, power users

### v1.5.0 - Mobile PWA (Jun 2026)
- Progressive Web App manifest
- Service worker (offline support)
- Install prompt (Add to Home Screen)
- Push notifications (przekroczenie budżetu)
**Impact:** Mobile-first experience, native-like UX

---

## 🔮 v2.0.0 - "Advanced Analytics" (Q3 2026)

### AI-Powered Insights
- ML model: kategoria prediction (automatyczna kategoryzacja transakcji)
- Spending patterns analysis ("Wydajesz więcej w weekendy")
- Budget recommendations ("Zwiększ budżet na Transport o 20%")
- Anomaly detection ("Wysoka transakcja: 2000 PLN - Pizza?")

### Advanced Visualizations
- Interactive charts (D3.js / recharts advanced)
- Heatmaps (spending per day of week)
- Sankey diagrams (money flow)
- Comparison charts (this month vs last month)

### Collaboration Features
- Shared budgets (household finances)
- Multi-user categories
- Permissions (viewer/editor/admin)
- Activity log (kto dodał transakcję)

### Integrations
- Bank import (CSV upload → auto-parse)
- Receipt scanning (OCR: Tesseract.js)
- Email parsing (Gmail API: e-receipts)
- External APIs (Notion export, Google Sheets sync)

---

## 🛣️ Beyond v2.0 (2027+)

### Enterprise Features
- Multi-tenant architecture (SaaS model)
- Organization accounts
- Role-based access control (RBAC)
- Audit logs & compliance

### Community & Ecosystem
- Plugin system (community extensions)
- Marketplace dla custom reports
- Public API (webhooks, OAuth)
- Mobile native apps (React Native)

### Sustainability
- Open-source governance (Contributors, Maintainers)
- Monetization strategy (managed hosting, premium support)
- Community forum (Discord/Reddit)
- Conference talks & workshops

---

## 📊 Success Metrics

### v1.0 Launch Goals
- 100+ GitHub stars
- 10+ self-hosting users (feedback loop)
- 5+ open-source contributors
- 90+ Lighthouse score
- 0 critical bugs (P0)

### v2.0 Maturity Goals
- 1000+ GitHub stars
- 500+ active self-hosted instances
- 50+ contributors
- Featured on Product Hunt, Hacker News
- Case studies (blog posts, tutorials)

---

## 🧭 Guiding Principles

1. **Self-Hosting First** - Docker Compose musi działać zawsze (zero cloud dependencies)
2. **Privacy by Design** - Dane użytkownika nigdy nie opuszczają jego serwera
3. **Open Source** - Transparent development, community-driven
4. **Simplicity** - KISS & YAGNI, no premature optimization
5. **Accessibility** - WCAG 2.1 AA minimum, universal design

---

**Last Updated:** 6 października 2025  
**Next Review:** v1.0 launch (January 2026)

_See also: [TODO.md](./TODO.md) (current sprint), [COMPLETED.md](./COMPLETED.md) (history)_
