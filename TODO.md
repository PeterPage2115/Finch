# TODO - Tracker Kasy# TODO - Tracker Kasy



**Last Updated:** 6 października 2025, 21:00  **Last Updated:** 6 października 2025, 21:00  

**Current Version:** v0.6.0 (In Progress - Phase 3 pending)  **Current Version:** v0.6.0 (In Progress - Phase 3 pending)  

**Next Priority:** 🎯 Complete v0.6.0 Accessibility (30 min) → v0.7.0 Testing Suite (1-2 days)**Next Priority:** 🎯 Complete v0.6.0 Accessibility (30 min)



------



## 🚨 URGENT (Critical - Do dziś)## 🚨 URGENT (Critical - Do dziś)



_Brak pilnych zadań_ ✅_Brak pilnych zadań_ ✅



------



## 🎯 NEXT UP (< 1 Hour)## 🎯 NEXT UP (< 1 Hour)



### v0.6.0 - Phase 3: Comprehensive Screen Reader Testing (30 min) - REKOMENDOWANE 🌟



**Cel:** Dokończyć v0.6.0, etyczne zobowiązanie WCAG 2.1 AA### Option A: v0.6.0 - Accessibility Addon (20-30 min) - REKOMENDOWANE 🌟## 🎯 NEXT UP (Quick Wins < 1 Hour)**Next Priority:** 🚨 Fix lucide-react icons (URGENT)  - calculateProgress() z alertami (80%, 100%)



**Status:** Phase 1 ✅ (Mobile Drawer), Phase 2 ✅ (aria-live regions), Phase 3 📋 Pending



**Zadania:****Cel:** WCAG 2.1 AA compliance, etyczne zobowiązanie

- [ ] **Install NVDA** (Windows) lub VoiceOver (Mac)

  - NVDA: https://www.nvaccess.org/download/

  - Free, open-source screen reader

- [ ] **Focus trap w drawer** (10 min)### v0.6.0 - Accessibility Addon (20-30 min) - REKOMENDOWANE  - Auto-obliczanie endDate dla okresów

- [ ] **Test z zamkniętymi oczami** (keyboard only):

  - Dashboard - navigation, transaction create/update/delete  - Instalacja `focus-trap-react`

  - Categories - navigation, category create/update/delete

  - Budgets - navigation, budget create/update/delete  - Wrap drawer content w `<FocusTrap>`- [ ] **Focus trap w drawer** (10 min)

  - Forms - validate labels, error messages, success notifications

  - Mobile drawer - keyboard navigation, focus management  - Test: Tab/Shift+Tab zamknięte w menu



- [ ] **Document findings:**  - Instalacja `focus-trap-react`---  - Business rule: unique userId+categoryId+startDate

  - Create test report in `docs/CODE_REVIEW_REPORT.md`

  - Note: timing of announcements, clarity, announcement order- [ ] **aria-live regions dla toastów** (10 min)

  - List any critical accessibility issues found

  - Dodanie `<div role="alert" aria-live="polite">` do root layout  - Wrap drawer content w `<FocusTrap>`

- [ ] **Fix critical issues** (if any found)

  - Adjust aria-live strategy if needed (polite vs assertive)  - Zustand store dla notifications

  - Fix missing labels, improve button purposes

  - Przykłady: "Transakcja dodana", "Kategoria usunięta"  - Test: Tab/Shift+Tab zamknięte w menu  - ⏳ Testy pending (Faza 7)

- [ ] **Mark v0.6.0 as COMPLETE** ✅

  - Update CHANGELOG.md: v0.6.0 - 2025-10-06 (Complete)

  - Commit: "feat: complete v0.6.0 accessibility (screen reader tested)"

- [ ] **Screen reader testing** (10 min)- [ ] **aria-live regions dla toastów** (10 min)

**Result:** v0.6.0 "Production Ready - WCAG 2.1 AA Compliant"

  - Instalacja NVDA (Windows) lub VoiceOver (Mac)

---

  - Walkthrough z zamkniętymi oczami  - Dodanie `<div role="alert" aria-live="polite">` do root layout## 🚨 URGENT (Critical Bugs)- ✅ Faza 6.2: Frontend Budgets UI (100%)

## 📅 THIS WEEK (< 7 Days)

  - Poprawki jeśli coś nie działa

### v0.7.0 - Testing Suite (Day 1-2, ~6-8h) - STABILNOŚĆ 💪

  - Zustand store dla notifications

**Cel:** 70%+ code coverage, confidence przed v1.0

**Result:** v0.6.0 "Production Ready - WCAG 2.1 AA Compliant"

**Priority:** 🔴 HIGH - Stabilność, pewność przy zmianach

  - Przykłady: "Transakcja dodana", "Kategoria usunięta"  - Strona /budgets z BudgetForm + BudgetList

#### Day 1: Backend Tests (3-4h)

### Option B: v0.8.0 - Real Authentication Basics (Day 1-2, ~4h)

- [ ] **Unit Tests - Services** (2h):

  - AuthService: register, login, validateToken- [ ] **Screen reader testing** (10 min)

  - TransactionsService: create, findAll, update, delete

  - CategoriesService: create, findAll, update, delete**Cel:** User profile + password reset, podstawy prawdziwej autentykacji

  - BudgetsService: create, findAll, calculateProgress

  - Instalacja NVDA (Windows) lub VoiceOver (Mac)### Fix: Lucide-react Icons Not Rendering (10-20 min)  - Progress bars (green/yellow/red)

- [ ] **Integration Tests - API Endpoints** (2h):

  - Setup: supertest, test database#### Day 1: User Profile Page (1-2h)

  - POST /auth/register, /auth/login

  - CRUD endpoints: /transactions, /categories, /budgets- [ ] Frontend: Profile page z formularzem (Email, Full Name, Password Change)  - Walkthrough z zamkniętymi oczami

  - Authorization headers, error cases

- [ ] Backend: `/api/users/profile` endpoint (GET, PATCH)

#### Day 2: Frontend Tests (3-4h)

- [ ] Walidacja: email unique, password min 8 chars  - Poprawki jeśli coś nie działa- [ ] **Problem:** Ikony kategorii renderują się jako znaki zapytania (?) zamiast rzeczywistych ikon  - Delete confirmation modal

- [ ] **React Testing Library - Components** (2h):

  - CategoryIcon (icon rendering)- [ ] Avatar upload (opcjonalnie - Cloudinary/AWS S3)

  - IconPicker (selection, categories)

  - TransactionForm (validation, submission)- **Priority:** 🟢 MEDIUM - Etyczne zobowiązanie, WCAG 2.1 AA compliance

  - BudgetCard (progress bars, colors)

#### Day 2: Password Reset Flow (1-2h)

- [ ] **Playwright E2E Tests** (2h):

  - User flow: Register → Login → Dashboard- [ ] Frontend: "Forgot password" link + formularz reset- **Impact:** Accessibility - pełna dostępność dla użytkowników z niepełnosprawnościami- [ ] **Diagnoza:** CategoryIcon.tsx używa dynamicznego importu `(LucideIcons as any)[iconName]`, który nie działa poprawnie w Next.js 15 SSR  - API Routes proxy

  - Create transaction → Verify in list

  - Create budget → Verify progress- [ ] Backend: Email token generation (crypto.randomBytes)

  - Happy paths + error scenarios

- [ ] Email service: Nodemailer integration (SMTP config)- **Result:** v0.6.0 "Production Ready - WCAG 2.1 AA Compliant"

- [ ] **CI/CD Setup** (optional):

  - GitHub Actions workflow- [ ] Token verification: `/api/auth/reset-password/:token`

  - Run tests on PR

- **Estimated Time:** 20-30 minut- [ ] **Rozwiązanie:**   - Link "Budżety" w navbar

**Result:** v0.7.0 "Tested & Stable"

---

---



### v0.8.0 - Real Authentication (Day 1-2, ~6-8h) - PRODUKCJA 🚀

## 📅 THIS MONTH (October 2025)

**Cel:** Production-ready auth, prawdziwi użytkownicy

---  - Dodać `'use client'` directive do CategoryIcon.tsx  - **Dashboard widget ✅** (top 3 budżety, compact design)

**Priority:** 🟡 MEDIUM - Functionality, prawdziwi użytkownicy

### v0.6.3 - Reports Page - Phase 3 (1-2h)

#### Day 1: User Profile Page (2-3h)



- [ ] **Backend - Profile Endpoint**:

  - GET /api/users/profile (current user info)**Status:** Backend ready (Faza 6 done), frontend pending

  - PATCH /api/users/profile (update email, name, password)

  - Validation: email unique, password min 8 chars## 📅 SHORT-TERM (1-5 Days)  - Sprawdzić czy to rozwiązuje problem- 🐛 Bug fixes: Dark mode, emoji removal, unified navbar

  - Password hashing on change (bcrypt)

- [ ] Wykres wydatków per kategoria (Bar Chart - recharts)

- [ ] **Frontend - Profile Page**:

  - New page: `/app/profile/page.tsx`- [ ] Tabela top 10 kategorii

  - Form: Email, Name, Current Password, New Password

  - Validation, error handling- [ ] Date range picker (start/end month)

  - Success notifications

- [ ] Export CSV button (frontend + backend endpoint)### v0.8.0 - Real Authentication System (3-5 dni)  - Jeśli nie: stworzyć mapping object z wszystkimi używanymi ikonami- 💡 **Decyzja architektoniczna**: Budgets = kontrola wydatków (reactive), Savings Goals = cele oszczędnościowe (proactive) → osobne moduły!

- [ ] **Avatar Upload** (optional):

  - Cloudinary/AWS S3 integration

  - Image preview, upload button

  - Backend: store avatar URL in User model### v0.7.0 - Testing Suite (2-3h)



#### Day 2: Password Reset Flow (2-3h)



- [ ] **Backend - Reset Endpoints**:**Priorytet:** MEDIUM - Jakość kodu przed v1.0#### Day 1: User Profile Page (1-2h)- [ ] **Test:** Sprawdzić Playwright czy ikony renderują się poprawnie- 📈 **Postęp**: Dashboard widget done, pozostają Raporty (Faza 6.3) + Testy (Faza 7)

  - POST /api/auth/forgot-password (generate token, send email)

  - POST /api/auth/reset-password/:token (verify token, update password)

  - Token: crypto.randomBytes, expires in 1 hour

  - Email service: Nodemailer (SMTP config)- [ ] **Backend Tests** (1.5h)- [ ] Frontend: Profile page z formularzem (Email, Full Name, Password Change)



- [ ] **Frontend - Reset Pages**:  - Unit: TransactionsService, BudgetsService

  - "Forgot password?" link on login page

  - `/app/forgot-password/page.tsx` (email input)  - Integration: POST /api/transactions, GET /api/budgets- [ ] Backend: `/api/users/profile` endpoint (GET, PATCH)- **Priority:** 🔴 HIGH - Wizualny bug widoczny na wszystkich stronach z kategoriami

  - `/app/reset-password/[token]/page.tsx` (new password input)

  - Success/error states  - Jest config + test database setup



- [ ] **Email Verification** (optional):- [ ] Walidacja: email unique, password min 8 chars

  - Send verification email on register

  - User must verify before login- [ ] **Frontend Tests** (1.5h)

  - Resend verification link

  - Unit: useAuth hook, TransactionForm validation- [ ] Avatar upload (opcjonalnie - Cloudinary/AWS S3)- **Impact:** UX - aplikacja wygląda nieprofesjonalnie bez ikon**Następny krok:** Faza 6.3 - Podstawowe Raporty 📊 lub Faza 7 - Testyzenia Finansów

**Result:** v0.8.0 "Production-Ready Authentication"

  - Integration: Playwright tests (login → add transaction → verify)

---

  - React Testing Library setup

## 📅 THIS MONTH (October 2025)



### v0.6.1 - Focus Trap Alternative (1-2h)

### Bug Fixes & Improvements#### Day 2: Password Reset Flow (1-2h)- **Estimated Time:** 10-20 minut

**Cel:** Alternative focus trap solution for drawer (without AnimatePresence conflict)



**Status:** Deferred from v0.6.0 (minor accessibility issue)

- [ ] **Dark mode** - niektóre komponenty nieczytelne- [ ] Frontend: "Forgot password" link + formularz reset

**Known Issue:**

- focus-trap-react conflicts with Framer Motion AnimatePresence- [ ] **Emoji removal** - usunąć emotikony z UI (zamienić na lucide-react icons)

- Drawer works but keyboard focus can escape to background elements

- Impact: Minor - keyboard users can Tab outside drawer- [ ] **Unified navbar** - spójny design między stronami- [ ] Backend: Email token generation (crypto.randomBytes)**Data rozpoczęcia:** 1 października 2025  



**Possible Solutions:**- [ ] **Dashboard widget polish** - responsive design dla mobile

- [ ] Custom focus trap with useEffect (manual focus management)

- [ ] Replace AnimatePresence with CSS transitions- [ ] Email service: Nodemailer integration (SMTP config)

- [ ] Use Radix UI Dialog (has built-in focus trap)

- [ ] Research: React Aria, Headless UI alternatives---



---- [ ] Token verification: `/api/auth/reset-password/:token`---**Status:** Faza 6 w trakcie 🚀 - Budgets Backend+Frontend ✅ (Raporty + Dashboard widget pending)



### v0.9.0 - Advanced Reports (Day 2-3, ~8-10h)## 📝 NOTES & DECISIONS



**Cel:** Głębsza analityka finansowa



**Priority:** 🟢 LOW - Nice to have, reports już działają### Architectural Decisions



**Current State:** Reports Page exists (DateRangePicker, SummaryCards, CategoryPieChart)- **Budgets vs Savings Goals:** Budgets = kontrola wydatków (reactive), Savings Goals = cele oszczędnościowe (proactive) → osobne moduły w przyszłości#### Day 3: Email Verification (1-2h - opcjonalnie)



**Enhancements:**- **Icon System:** Centralized lib/iconMap.ts, visual IconPicker component, 50+ icons in 9 categories

- [ ] **Timeline Charts** (3h):

  - Line chart: wydatki month-to-month- **Docker First:** Wszystko przez `docker-compose up`, zero manual setup- [ ] Rejestracja wysyła email z linkiem weryfikacyjnym

  - Bar chart: income vs expenses trend

  - Library: recharts lub visx



- [ ] **Export Functionality** (2h):### Recent Completions (v0.5.x)- [ ] Backend: `/api/auth/verify-email/:token`## 🎯 NEXT UP (Quick Wins < 1 Hour)---

  - Backend: Generate CSV (transactions export)

  - Frontend: Download button- ✅ v0.5.8 - Visual IconPicker (CategoryForm UX improvement)

  - Optional: PDF export (pdfmake)

- ✅ v0.5.7 - Lucide-react icons bugfix (? → proper icons)- [ ] User model: `emailVerified` boolean field

- [ ] **Custom Date Ranges** (2h):

  - Extend DateRangePicker: presets (Last 7 days, Last 30 days, This year)- ✅ v0.5.6 - Backend Budgets CRUD

  - Custom range selector (calendar)

- ✅ v0.5.5 - Frontend Budgets UI (BudgetForm, BudgetList, progress bars)- [ ] Ograniczenia: nieweryfikowani użytkownicy nie mogą dodawać transakcji

- [ ] **Category Breakdown** (2h):

  - Top 10 categories by spending- ✅ v0.5.4 - Dashboard BudgetWidget (top 3 budżety)

  - Table with percentages

  - Drill-down: click category → see transactions



**Result:** v0.9.0 "Advanced Analytics"_Więcej w [COMPLETED.md](./COMPLETED.md) i [CHANGELOG.md](./CHANGELOG.md)_



---#### Day 4: JWT Refresh Tokens (1-2h)### v0.6.0 - Accessibility Addon (20-30 min)**Ostatnie zmiany (6 października 2025 - Sesja 5):**



## 🎯 BACKLOG (Future Versions)---



### v1.0.0 - Production Release (January 2026)- [ ] Dual token system: access token (15 min), refresh token (7 days)



**Milestone:** First stable release, ready for self-hosting## 🔗 See Also



**Requirements:**- [ ] Backend: `/api/auth/refresh` endpoint- [ ] **Focus trap w drawer** (10 min)- ✅ **FAZA 6.1 + 6.2 UKOŃCZONA!** 🎉

- ✅ All core features (Transactions, Categories, Budgets, Reports)

- ✅ Real Authentication (v0.8.0)- **[ROADMAP.md](./ROADMAP.md)** - Long-term strategic plan (v1.0, v2.0, Q1 2026+)

- ✅ WCAG 2.1 AA compliance (v0.6.0)

- ✅ 70%+ test coverage (v0.7.0)- **[COMPLETED.md](./COMPLETED.md)** - Sprint history with CHANGELOG links- [ ] Frontend: Axios interceptor automatycznie odświeża tokeny

- ✅ Docker Compose one-command setup

- [ ] Production optimizations:- **[CHANGELOG.md](./CHANGELOG.md)** - Detailed version history

  - Caching strategy (Redis optional)

  - Performance monitoring- [ ] Secure HTTP-only cookies dla refresh tokens  - Instalacja `focus-trap-react`- ✅ Faza 6.1: Backend Budgets CRUD (100%)

  - Security hardening (rate limiting, helmet.js)

  - SEO optimization---

- [ ] Documentation complete:

  - User guide (screenshots, tutorials)

  - API documentation (Swagger/OpenAPI)

  - Deployment guide (VPS, Kubernetes)**Zasady pracy:**



---1. KISS & YAGNI - prostota nad abstrakcją#### Day 5: User Settings (1-2h)  - Wrap drawer content w `<FocusTrap>`  - BudgetsModule, Service, Controller



### Future Features (Post v1.0)2. MVP First - kluczowe funkcje przed zaawansowanymi



**Nice to Have:**3. "Zrobione = przetestowane" - zawsze pisz testy- [ ] Theme preference: light/dark/system (Zustand store)

- Multi-currency support (exchange rates API)

- Recurring transactions (monthly bills, subscriptions)4. Docker First - wszystko przez docker-compose

- Tags for transactions (multiple tags per transaction)

- Shared budgets (family accounts)5. Git workflow - małe commity, detale w CHANGELOG- [ ] Language: pl/en (przygotowanie do i18n)  - Test: Tab/Shift+Tab zamknięte w menu  - calculateProgress() z alertami (80%, 100%)

- Mobile app (React Native)

- Bank integrations (Plaid API)

- Budget templates (import/export)- [ ] Currency format: zł/$/€

- Dark mode improvements (all components)

- i18n (internationalization - English, Polish, others)- [ ] localStorage persistence dla preferencji- [ ] **aria-live regions dla toastów** (10 min)  - Auto-obliczanie endDate dla okresów



---



## 📝 Notes- **Priority:** 🟡 HIGH - Fundament dla multi-tenant aplikacji  - Dodanie `<div role="alert" aria-live="polite">` do root layout  - Business rule: unique userId+categoryId+startDate



### Known Issues (Technical Debt)- **Impact:** Production readiness - prawdziwa autentykacja, security, user experience



1. **Focus Trap in Drawer (v0.6.1)**- **Result:** v0.8.0 "Multi-tenant Ready"  - Zustand store dla notifications  - ⏳ Testy pending (Faza 7)

   - AnimatePresence conflicts with focus-trap-react

   - Minor accessibility issue- **Estimated Time:** 3-5 dni (5-10 godzin total)

   - Planned fix: Custom focus trap or Radix UI Dialog

  - Przykłady: "Transakcja dodana", "Kategoria usunięta"- ✅ Faza 6.2: Frontend Budgets UI (100%)

2. **Mock Authentication**

   - Currently using simple JWT mock---

   - No password reset, email verification

   - Planned fix: v0.8.0 Real Authentication- [ ] **Screen reader testing** (10 min)  - Strona /budgets z BudgetForm + BudgetList



3. **No Test Coverage**## 🚀 LONG-TERM (2-4 Weeks)

   - Backend: 0% coverage

   - Frontend: 0% coverage  - Instalacja NVDA (Windows) lub VoiceOver (Mac)  - Progress bars (green/yellow/red)

   - Planned fix: v0.7.0 Testing Suite

### v0.9.x → v1.0.0 - Advanced Features

### Recent Completions (October 2025)

  - Walkthrough z zamkniętymi oczami  - Delete confirmation modal

✅ v0.5.8 - Visual IconPicker (50+ icons, 9 categories)  

✅ v0.5.9 - Complete Icon System Fix (all components use CategoryIcon)  #### Week 1: Advanced Charts (5-7 dni)

✅ v0.5.10 - Project Cleanup (.gitignore fix, docs archive)  

✅ v0.6.0 Phase 1 - Mobile Drawer Menu (hamburger working)  - [ ] **Trend charts** (2 dni)  - Poprawki jeśli coś nie działa  - API Routes proxy

✅ v0.6.0 Phase 2 - aria-live Regions (WCAG 2.1 AA, 10 notifications)

  - Recharts LineChart: Income/Expenses over 6 months

_For detailed history, see [CHANGELOG.md](./CHANGELOG.md) and [COMPLETED.md](./COMPLETED.md)_

  - Month-over-month comparison- **Priority:** 🟢 MEDIUM - Etyczne zobowiązanie, WCAG 2.1 AA compliance  - Link "Budżety" w navbar

---

  - Year-over-year comparison

## 🤝 Contributing

- [ ] **Budget vs Actual chart** (2 dni)- **Impact:** Accessibility - pełna dostępność dla użytkowników z niepełnosprawnościami  - ⏳ Dashboard widget pending (Faza 6.3)

Przed rozpoczęciem pracy:

1. Sprawdź [CONTRIBUTING.md](./CONTRIBUTING.md) - guidelines  - Bar chart overlayed: Planned vs Actual spending

2. Wybierz zadanie z sekcji **NEXT UP** lub **THIS WEEK**

3. Utwórz branch: `feat/task-name` lub `fix/bug-name`  - Color coding: Green (under budget), Yellow (80-100%), Red (over budget)- **Result:** v0.6.0 "Production Ready - WCAG 2.1 AA Compliant"- 🐛 Bug fixes: Dark mode, emoji removal, unified navbar

4. Commit zgodnie z Conventional Commits

5. Testuj lokalnie (Docker Compose)- [ ] **Category spending over time** (1 dzień)

6. Otwórz Pull Request

  - Stacked area chart: All categories over 12 months- **Estimated Time:** 20-30 minut- � **Decyzja architektoniczna**: Budgets = kontrola wydatków (reactive), Savings Goals = cele oszczędnościowe (proactive) → osobne moduły!

**Kontakt:** [GitHub Issues](https://github.com/[username]/Tracker_kasy/issues)

  - Interactive legend: toggle categories on/off

- [ ] **Export charts as images** (1 dzień)

  - Recharts → Canvas → PNG download

  - Include in PDF reports---**Następny krok:** Faza 6.3 - Podstawowe Raporty 📊 lub Dashboard widget



#### Week 2: Data Export & Reports (3-4 dni)

- [ ] **CSV export** (1 dzień)

  - Transactions: wszystkie pola (date, description, amount, category, type)## 📅 SHORT-TERM (1-5 Days)---

  - Budgets: amount, period, category, progress

  - Categories: name, type, icon, color

- [ ] **PDF reports** (2 dni)

  - jsPDF + jsPDF-AutoTable### v0.8.0 - Real Authentication System (3-5 dni)---

  - Include: Summary cards, charts (as images), transaction table

  - Custom branding: logo, color scheme

- [ ] **Email PDF reports** (1 dzień)

  - Nodemailer: attach PDF as email#### Day 1: User Profile Page (1-2h)## 🏗️ Faza 1: Inicjalizacja Projektu i Konfiguracja

  - Schedule: weekly/monthly reports (node-cron)

- [ ] Frontend: Profile page z formularzem (Email, Full Name, Password Change)

#### Week 3: Budget Notifications (5-7 dni)

- [ ] **Email alerts** (2 dni)- [ ] Backend: `/api/users/profile` endpoint (GET, PATCH)### 1.1 Struktura Projektu i Dokumentacja

  - Trigger: 80% budget utilization

  - Template: HTML email with budget details- [ ] Walidacja: email unique, password min 8 chars- [x] Utworzenie struktury folderów (`frontend/`, `backend/`, `docs/`)

  - User preferences: Enable/Disable per budget

- [ ] **Weekly summary emails** (2 dni)- [ ] Avatar upload (opcjonalnie - Cloudinary/AWS S3)- [x] Przygotowanie głównego pliku `README.md` z instrukcją uruchomienia

  - Cron job: Every Monday 9:00 AM

  - Content: Last week income/expenses, top categories, budget status- [x] Konfiguracja `.gitignore` (node_modules, .env, build files, etc.)

- [ ] **Cron job setup** (1 dzień)

  - node-cron w backend#### Day 2: Password Reset Flow (1-2h)- [x] Inicjalizacja repozytorium Git i pierwszy commit

  - Separate worker process (Docker service)

  - Logging: Winston + log files- [ ] Frontend: "Forgot password" link + formularz reset



#### Week 4: PWA Support (3-5 dni)- [ ] Backend: Email token generation (crypto.randomBytes)### 1.2 Backend - NestJS

- [ ] **Service worker** (2 dni)

  - next-pwa plugin- [ ] Email service: Nodemailer integration (SMTP config)- [x] Inicjalizacja projektu NestJS (`nest new backend`)

  - Cache strategies: Network First (API), Cache First (static assets)

  - Offline fallback page- [ ] Token verification: `/api/auth/reset-password/:token`- [x] Konfiguracja TypeScript (`tsconfig.json`)

- [ ] **Offline mode** (2 dni)

  - IndexedDB: cache transactions/categories/budgets- [x] Instalacja zależności: Prisma, Passport.js, JWT, class-validator, class-transformer

  - Sync queue: retry failed requests when online

  - UI indicators: "You're offline" banner#### Day 3: Email Verification (1-2h - opcjonalnie)- [x] Utworzenie `Dockerfile` dla backendu

- [ ] **Install prompt** (1 dzień)

  - "Add to Home Screen" button- [ ] Rejestracja wysyła email z linkiem weryfikacyjnym- [x] Konfiguracja zmiennych środowiskowych (`.env.example`)

  - PWA manifest: icons, theme color, display mode

  - Push notifications (opcjonalnie - Firebase Cloud Messaging)- [ ] Backend: `/api/auth/verify-email/:token`- [x] Setup Prisma i połączenie z PostgreSQL



#### Additional Features (Optional - 1 week)- [ ] User model: `emailVerified` boolean field- [x] Utworzenie podstawowej struktury folderów (`src/users`, `src/transactions`, `src/budgets`)

- [ ] **Recurring transactions** (2 dni)

  - Auto-add: monthly rent, salary, subscriptions- [ ] Ograniczenia: nieweryfikowani użytkownicy nie mogą dodawać transakcji

  - Cron job: check every day at midnight

  - User preferences: Enable/Disable per recurring transaction### 1.3 Frontend - Next.js

- [ ] **Tags for transactions** (1 dzień)

  - Many-to-many relationship: Transaction ↔ Tags#### Day 4: JWT Refresh Tokens (1-2h)- [x] Inicjalizacja projektu Next.js 14+ z TypeScript

  - Filter by tags: "Business expenses", "Tax deductible"

- [ ] **Advanced search & filters** (2 dni)- [ ] Dual token system: access token (15 min), refresh token (7 days)- [x] Konfiguracja Tailwind CSS

  - Query builder UI: Amount range, Date range, Categories, Types, Tags

  - Backend: Prisma complex queries- [ ] Backend: `/api/auth/refresh` endpoint- [x] Instalacja zależności: Zustand, React Hook Form, Chart.js/Recharts

  - URL state: shareable filter links

- [ ] Frontend: Axios interceptor automatycznie odświeża tokeny- [x] Utworzenie `Dockerfile` dla frontendu

- **Priority:** 🔵 MEDIUM - Competitive features, user value

- **Impact:** Feature completeness - gotowość do monetyzacji, competitive advantage- [ ] Secure HTTP-only cookies dla refresh tokens- [x] Konfiguracja zmiennych środowiskowych (`.env.example`)

- **Result:** v1.0.0 "Feature Complete - Ready for Launch"

- **Estimated Time:** 2-4 tygodnie (40-80 godzin total)- [x] Utworzenie podstawowej struktury folderów (`app/`, `components/`, `lib/`, `types/`)



---#### Day 5: User Settings (1-2h)



## ✅ COMPLETED- [ ] Theme preference: light/dark/system (Zustand store)### 1.4 Docker i Orkiestracja



### v0.5.7 - Lucide-react Icons Bugfix (✅ Completed - 6 październik 2025)- [ ] Language: pl/en (przygotowanie do i18n)- [x] Utworzenie `docker-compose.yml` (frontend, backend, PostgreSQL)

- ✅ **CRITICAL BUG FIX:** Icons rendering as "?" → Fixed! ❌→✅

- ✅ Problem: CategoryIcon.tsx dynamiczny import `(LucideIcons as any)[iconName]` nie działał w Next.js 15 SSR- [ ] Currency format: zł/$/€- [x] Konfiguracja wolumenu dla PostgreSQL (`pgdata`)

- ✅ Rozwiązanie: Explicit icon mapping object (30+ ikon)

- ✅ Icons included: DollarSign, TrendingUp, Wallet, UtensilsCrossed, Car, Heart, Gamepad2, Home, Zap, etc.- [ ] localStorage persistence dla preferencji- [x] Konfiguracja sieci Docker dla komunikacji między serwisami

- ✅ Added 'use client' directive

- ✅ Type-safe mapping: `Record<string, LucideIcon>`- [x] Test uruchomienia całego stacku: `docker-compose up`

- ✅ Performance: Better tree-shaking (explicit imports)

- ✅ Test: Playwright screenshot - wszystkie ikony renderują się poprawnie- **Priority:** 🟡 HIGH - Fundament dla multi-tenant aplikacji- [x] Dokumentacja procesu uruchamiania w `README.md`

- **Time:** 10 minut

- **Commit:** aaf1cc4 - "fix: lucide-react icons rendering"- **Impact:** Production readiness - prawdziwa autentykacja, security, user experience- [x] **Naprawa:** Health check frontendu zmieniony z wget na sprawdzanie procesu next-server



### v0.5.6 - Accessibility Improvements (✅ Completed - 6 październik 2025)- **Result:** v0.8.0 "Multi-tenant Ready"

- ✅ ARIA labels: CategoryList + TransactionList Edit/Delete buttons

  - Format: `aria-label="Edytuj kategorię {name}"`, `aria-label="Usuń transakcję {description}"`- **Estimated Time:** 3-5 dni (5-10 godzin total)---

  - Coverage: Desktop table + Mobile cards (dual views)

- ✅ Enhanced focus styles: globals.css

  - `*:focus-visible`: 2px blue-500 outline, 2px offset, 4px border-radius

  - Dark mode: blue-400 outline color---## 🗄️ Faza 2: Baza Danych i Modele

  - Keyboard navigation only (not mouse clicks)

- ✅ Auto-focus: TransactionForm (amount), CategoryForm (name), BudgetForm (amount)

  - UX: Cursor immediately in most important field

- ✅ WCAG 2.1 Level AA basics: Keyboard navigation + Screen reader support## 🚀 LONG-TERM (2-4 Weeks)### 2.1 Schemat Bazy Danych (Prisma)

- **Time:** 30 minut

- **Commit:** 081e1ad - "a11y: accessibility improvements"- [x] Definicja modelu `User` (id, email, hasło-hash, createdAt, updatedAt)



### v0.5.5 - Performance Optimization (✅ Completed - 6 październik 2025)### v0.9.x → v1.0.0 - Advanced Features- [x] Definicja modelu `Transaction` (id, userId, amount, category, description, date, type: income/expense)

- ✅ React.memo: CategoryPieChart, BudgetList, TransactionList (3 components)

- ✅ useMemo: chartData calculation (CategoryPieChart - expensive Recharts data)- [x] Definicja modelu `Category` (id, name, type, userId)

- ✅ useCallback: 5 handlers total

  - Dashboard: handleEdit, handleCancel, handleDelete (with deps: token, removeTransaction, refetchBudgets)#### Week 1: Advanced Charts (5-7 dni)- [x] Definicja modelu `Budget` (id, userId, categoryId, amount, period, startDate, endDate)

  - Budgets: handleEdit, handleDeleteClick (with deps: budgets)

- ✅ Pattern: memo + useCallback combo prevents unnecessary child re-renders- [ ] **Trend charts** (2 dni)- [x] Definicja relacji między modelami

- **Time:** 20 minut

- **Commit:** 6baec10 - "perf: optimize component rendering"  - Recharts LineChart: Income/Expenses over 6 months- [x] Pierwsza migracja: `npx prisma migrate dev --name init`



### v0.5.4 - Page Transition Animations (✅ Completed - 6 październik 2025)  - Month-over-month comparison- [x] Seed danych testowych (opcjonalnie)

- ✅ app/template.tsx: Next.js 15 pattern (rerenders on navigation)

- ✅ Animation: fade-in (opacity 0→1, y 20→0, 0.5s easeOut)  - Year-over-year comparison

- ✅ Impact: ALL route changes (Dashboard → Categories → Budgets → Reports)

- ✅ No AnimatePresence needed (template.tsx handles rerenders)- [ ] **Budget vs Actual chart** (2 dni)---

- **Time:** 10 minut

- **Commit:** 6f0bed9 - "feat: page transition animations"  - Bar chart overlayed: Planned vs Actual spending



### v0.5.3 - Budget Progress Bar Animations (✅ Completed - 6 październik 2025)  - Color coding: Green (under budget), Yellow (80-100%), Red (over budget)## 🔐 Faza 3: Uwierzytelnianie i Autoryzacja

- ✅ ProgressBar.tsx: framer-motion width animation (1s easeOut)

- ✅ Animation: `initial={{ width: 0 }}` → `animate={{ width: percentage% }}`- [ ] **Category spending over time** (1 dzień)

- ✅ Impact: Dashboard BudgetWidget + Budgets BudgetCard

- ✅ GPU-accelerated width transition  - Stacked area chart: All categories over 12 months### 3.1 Backend - System Auth

- **Time:** 5 minut

- **Commit:** e61ec43 - "feat: budget progress bar animations"  - Interactive legend: toggle categories on/off- [x] Moduł `AuthModule` w NestJS



### v0.5.2 - Animation Bug Fixes (✅ Completed - 6 październik 2025)- [ ] **Export charts as images** (1 dzień)- [x] Endpoint rejestracji (`POST /auth/register`) z walidacją DTO

- ✅ Fixed duplicate animations on TransactionForm close

- ✅ Fixed BudgetWidget animation re-triggering  - Recharts → Canvas → PNG download- [x] Haszowanie haseł (bcrypt)

- ✅ Removed AnimatePresence from AppNavbar (conflicted with template.tsx)

- ✅ Cleaned up animation logic in all modal components  - Include in PDF reports- [x] Endpoint logowania (`POST /auth/login`) zwracający JWT

- **Commit:** Multiple commits (animation cleanup phase)

- [x] Guard JWT dla chronionych endpointów

### v0.5.1 - Mobile Responsiveness (✅ Completed - 6 październik 2025)

- ✅ Hamburger menu z slide-in drawer animation (framer-motion spring)#### Week 2: Data Export & Reports (3-4 dni)- [x] Decorator `@CurrentUser()` do wyciągania użytkownika z tokenu

- ✅ Transaction cards mobile layout (dual view: desktop table, mobile cards)

- ✅ Summary cards responsive grid (3-col desktop → stack mobile)- [ ] **CSV export** (1 dzień)- [x] Testy jednostkowe dla AuthService (11 testów)

- ✅ Navigation drawer: Body scroll lock, ESC key close

- ✅ All pages responsive: Dashboard, Categories, Budgets, Reports  - Transactions: wszystkie pola (date, description, amount, category, type)- [x] Testy integracyjne dla endpointów auth (22 testy e2e)

- **Commit:** Multiple commits (mobile responsiveness phase)

  - Budgets: amount, period, category, progress

---

  - Categories: name, type, icon, color### 3.2 Frontend - UI Auth

## 📊 Project Statistics

- [ ] **PDF reports** (2 dni)- [x] Strona rejestracji (`/register`) z formularzem (React Hook Form)

**Total Completed Versions:** 7 (v0.5.1 - v0.5.7)  

**Total Development Time (Polish & Performance + Bugfix):** ~75 minut    - jsPDF + jsPDF-AutoTable- [x] Strona logowania (`/login`) z formularzem

**Lines of Code Changed:** ~600 (estimated)  

**Files Modified:** 20+ (components, pages, styles, config)    - Include: Summary cards, charts (as images), transaction table- [x] Zarządzanie stanem autentykacji (Zustand store)

**Tests Status:** Manual testing with Playwright MCP (13 screenshots captured)  

**Docker Containers:** 3 (frontend, backend, db) - all running stable    - Custom branding: logo, color scheme- [x] Zapisywanie JWT w localStorage (via Zustand persist)



**Code Quality:**- [ ] **Email PDF reports** (1 dzień)- [x] Middleware Next.js do ochrony tras wymagających logowania

- ✅ TypeScript strict mode enabled

- ✅ ESLint passing (except expected Tailwind v4 warnings)  - Nodemailer: attach PDF as email- [x] Komponent Dashboard (placeholder)

- ✅ No console errors in production

- ✅ Framer-motion animations: 60 FPS  - Schedule: weekly/monthly reports (node-cron)- [x] Strona główna z przekierowaniem dla zalogowanych

- ✅ Recharts performance: smooth rendering with React.memo

- ✅ Icons: lucide-react rendering correctly (v0.5.7 fix)



**Screenshots Captured (Playwright MCP):**#### Week 3: Budget Notifications (5-7 dni)---

- Desktop (1920x1080): 7 screenshots

  - login-page.png, homepage-desktop.png- [ ] **Email alerts** (2 dni)

  - dashboard-desktop.png (9 transactions, 2 budgets, summary cards)

  - categories-desktop.png (7 categories, lucide-react icons)  - Trigger: 80% budget utilization## 💰 Faza 4: Moduł Transakcji (MVP) ✅ UKOŃCZONA

  - budgets-desktop.png (2 budgets with progress bars)

  - reports-desktop.png (CategoryPieChart with Recharts)  - Template: HTML email with budget details

- Mobile (375x667): 4 screenshots

  - homepage-mobile.png, dashboard-mobile.png  - User preferences: Enable/Disable per budget### 4.1 Backend - API Transakcji ✅

  - categories-mobile.png, budgets-mobile.png

  - mobile-menu-open.png (drawer with slide-in animation)- [ ] **Weekly summary emails** (2 dni)- [x] Moduł `TransactionsModule` w NestJS

- Bugfix testing: 2 screenshots

  - categories-icons-test.png (before fix - "?" icons)  - Cron job: Every Monday 9:00 AM- [x] DTO dla transakcji (CreateTransactionDto, UpdateTransactionDto)

  - categories-icons-fixed.png (after fix - proper lucide-react icons)

  - Content: Last week income/expenses, top categories, budget status- [x] Endpoint: `POST /transactions` (tworzenie transakcji)

---

- [ ] **Cron job setup** (1 dzień)- [x] Endpoint: `GET /transactions` (lista transakcji użytkownika z filtrowaniem)

## 📝 Notes & Philosophy

  - node-cron w backend- [x] Endpoint: `GET /transactions/:id` (szczegóły transakcji)

**Development Philosophy:**

- **KISS** (Keep It Simple, Stupid) - najprostsze rozwiązania, które działają  - Separate worker process (Docker service)- [x] Endpoint: `PATCH /transactions/:id` (edycja transakcji)

- **YAGNI** (You Ain't Gonna Need It) - nie implementujemy funkcji "na zapas"

- **MVP First** - kluczowe funkcjonalności najpierw, zaawansowane później  - Logging: Winston + log files- [x] Endpoint: `DELETE /transactions/:id` (usunięcie transakcji)

- **Test-Driven Mindset** - "Zrobione" = "Przetestowane"

- [x] Walidacja danych wejściowych (class-validator)

**Commit Convention:**

- Format: `<type>: <description>` (Conventional Commits)#### Week 4: PWA Support (3-5 dni)- [x] **Bonus:** Paginacja (page, limit, meta)

- Types: `feat`, `fix`, `perf`, `a11y`, `refactor`, `test`, `docs`, `style`, `chore`

- Minimalistyczny format (1 linia) - szczegóły w CHANGELOG.md- [ ] **Service worker** (2 dni)- [x] **Bonus:** Filtrowanie (type, categoryId, dateRange)

- Przykłady:

  - `feat: budget progress bar animations`  - next-pwa plugin- [x] Testy jednostkowe dla TransactionsService

  - `fix: lucide-react icons rendering`

  - `perf: optimize component rendering`  - Cache strategies: Network First (API), Cache First (static assets)- [x] Testy integracyjne dla wszystkich endpointów

  - `a11y: accessibility improvements`

  - Offline fallback page

**Testing Strategy:**

- Playwright MCP: Live browser testing z screenshotami- [ ] **Offline mode** (2 dni)### 4.2 Frontend - UI Transakcji ✅

- Jest: Unit tests (pending dla v0.6.0+)

- Integration tests: API endpoint testing (pending)  - IndexedDB: cache transactions/categories/budgets- [x] Strona główna z listą transakcji (`/dashboard`)

- Manual testing: Every feature before commit

  - Sync queue: retry failed requests when online- [x] Formularz dodawania transakcji (modal)

**Tech Stack:**

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4  - UI indicators: "You're offline" banner- [x] Wyświetlanie listy transakcji (tabela)

- **Backend:** NestJS, Prisma, PostgreSQL

- **Animation:** framer-motion (spring physics, GPU-accelerated)- [ ] **Install prompt** (1 dzień)- [x] Filtrowanie transakcji (po dacie, kategorii, typie)

- **Charts:** Recharts (React.memo optimized)

- **State Management:** Zustand (lightweight, no boilerplate)  - "Add to Home Screen" button- [x] Edycja transakcji

- **Icons:** lucide-react (explicit imports, type-safe mapping)

- **Forms:** react-hook-form (validation, error handling)  - PWA manifest: icons, theme color, display mode- [x] Usuwanie transakcji (z potwierdzeniem)



**Environment:**  - Push notifications (opcjonalnie - Firebase Cloud Messaging)- [x] Obsługa błędów i komunikatów (toast notifications)

- **Docker:** 3 containers (frontend:3000, backend:4000, db:5432)

- **Hot Reload:** Next.js Turbopack (2-3s rebuild time)- [x] Loading states podczas zapytań API

- **Test User:** test@test.pl / test1234

- **Live Data:** 9 transactions, 7 categories, 2 budgets#### Additional Features (Optional - 1 week)- [x] **Bonus:** Zustand store z localStorage persist



**Known Issues:**- [ ] **Recurring transactions** (2 dni)- [x] **Bonus:** Next.js API Routes jako proxy

- ⚠️ Tailwind v4 ESLint warnings: `@theme inline` syntax (expected, safe to ignore)

- ⚠️ Git LF→CRLF warnings (Windows line endings, safe to ignore)  - Auto-add: monthly rent, salary, subscriptions- [x] **Bonus:** Categories API (GET /categories)



---  - Cron job: check every day at midnight- [x] **Bonus:** ThemeProvider + Pure Black Dark Mode



**Last Updated:** 6 października 2025, 16:30    - User preferences: Enable/Disable per recurring transaction- [x] **Bonus:** Professional Icons (lucide-react)

**Maintained By:** AI Copilot + User  

**Repository:** https://github.com/[user]/Tracker_kasy (private)- [ ] **Tags for transactions** (1 dzień)- [x] **Bonus:** Stats calculation z defensywnym programowaniem


  - Many-to-many relationship: Transaction ↔ Tags- [x] **CRITICAL FIX:** amount.toFixed error (Prisma Decimal → string)

  - Filter by tags: "Business expenses", "Tax deductible"- [x] **CRITICAL FIX:** Auto-create default categories przy rejestracji

- [ ] **Advanced search & filters** (2 dni)

  - Query builder UI: Amount range, Date range, Categories, Types, Tags**Wnioski z Fazy 4:**

  - Backend: Prisma complex queries- ⚠️ Prisma Decimal zwraca string w runtime - zawsze używaj Number() conversion

  - URL state: shareable filter links- ✅ Sequential thinking skuteczny dla złożonych problemów

- ✅ User-scoped dane wymagają automatycznego seed przy rejestracji

- **Priority:** 🔵 MEDIUM - Competitive features, user value- ✅ Krótkie commity + CHANGELOG.md dla szczegółów

- **Impact:** Feature completeness - gotowość do monetyzacji, competitive advantage

- **Result:** v1.0.0 "Feature Complete - Ready for Launch"---

- **Estimated Time:** 2-4 tygodnie (40-80 godzin total)

## 📊 Faza 5: Kategorie ✅ 100% UKOŃCZONA

---

### 5.1 Backend - API Kategorii ✅ UKOŃCZONA

## ✅ COMPLETED- [x] Moduł `CategoriesModule` w NestJS

- [x] Endpoint: `GET /categories` (lista kategorii użytkownika)

### v0.5.1 - Mobile Responsiveness (✅ Completed - 6 październik 2025)- [x] Endpoint: `GET /categories/:id` (szczegóły pojedynczej kategorii)

- ✅ Hamburger menu z slide-in drawer animation (framer-motion spring)- [x] Endpoint: `POST /categories` (tworzenie niestandardowej kategorii)

- ✅ Transaction cards mobile layout (dual view: desktop table, mobile cards)- [x] Endpoint: `PATCH /categories/:id` (edycja kategorii)

- ✅ Summary cards responsive grid (3-col desktop → stack mobile)- [x] Endpoint: `DELETE /categories/:id` (usunięcie kategorii)

- ✅ Navigation drawer: Body scroll lock, ESC key close- [x] Auto-create domyślnych kategorii przy rejestracji (AuthService)

- ✅ All pages responsive: Dashboard, Categories, Budgets, Reports- [x] DTO: CreateCategoryDto, UpdateCategoryDto z walidacją

- **Commit:** Multiple commits (mobile responsiveness phase)- [x] CategoriesService z logiką biznesową

- [x] Business rule: nie można usunąć kategorii z transakcjami

### v0.5.2 - Animation Bug Fixes (✅ Completed - 6 październik 2025)- [x] Walidacja duplikatów (unique constraint userId_name_type)

- ✅ Fixed duplicate animations on TransactionForm close

- ✅ Fixed BudgetWidget animation re-triggering### 5.2 Frontend - UI Kategorii ✅ UKOŃCZONA

- ✅ Removed AnimatePresence from AppNavbar (conflicted with template.tsx)- [x] Select/dropdown kategorii w formularzu transakcji (z API)

- ✅ Cleaned up animation logic in all modal components- [x] Strona zarządzania kategoriami (`/categories`)

- **Commit:** Multiple commits (animation cleanup phase)- [x] Formularz dodawania/edycji niestandardowej kategorii

- [x] Lista kategorii z możliwością edycji/usunięcia

### v0.5.3 - Budget Progress Bar Animations (✅ Completed - 6 październik 2025)- [x] Ikony kategorii (lucide-react: Plus, Pencil, Trash2, ArrowLeft)

- ✅ ProgressBar.tsx: framer-motion width animation (1s easeOut)- [x] Kolory kategorii (color picker input z hex validation)

- ✅ Animation: `initial={{ width: 0 }}` → `animate={{ width: percentage% }}`- [x] API Routes proxy: POST, PATCH, DELETE /api/categories

- ✅ Impact: Dashboard BudgetWidget + Budgets BudgetCard- [x] Link "Kategorie" w navbar dashboard

- ✅ GPU-accelerated width transition- [x] Delete confirmation modal

- **Time:** 5 minut- [x] Empty state + loading states

- **Commit:** e61ec43 - "feat: budget progress bar animations"- [x] Extended categoriesApi client (wszystkie metody CRUD)



### v0.5.4 - Page Transition Animations (✅ Completed - 6 październik 2025)**Wnioski z Fazy 5:**

- ✅ app/template.tsx: Next.js 15 pattern (rerenders on navigation)- ✅ Kompletny CRUD dla kategorii (Backend + Frontend)

- ✅ Animation: fade-in (opacity 0→1, y 20→0, 0.5s easeOut)- ✅ User może teraz customizować swoje kategorie

- ✅ Impact: ALL route changes (Dashboard → Categories → Budgets → Reports)- ✅ lucide-react dla profesjonalnych ikon

- ✅ No AnimatePresence needed (template.tsx handles rerenders)- ✅ Business rules działają (blokada delete z transactions)

- **Time:** 10 minut- 🎉 MVP Fazy 1-5 gotowe (86/86 zadań - 100%)

- **Commit:** 6f0bed9 - "feat: page transition animations"

---

### v0.5.5 - Performance Optimization (✅ Completed - 6 październik 2025)

- ✅ React.memo: CategoryPieChart, BudgetList, TransactionList (3 components)## 📈 Faza 6: Budżety i Raporty (MVP) 🚀 W TRAKCIE

- ✅ useMemo: chartData calculation (CategoryPieChart - expensive Recharts data)

- ✅ useCallback: 5 handlers total### 6.1 Backend - API Budżetów ✅ UKOŃCZONA

  - Dashboard: handleEdit, handleCancel, handleDelete (with deps: token, removeTransaction, refetchBudgets)- [x] Moduł `BudgetsModule` w NestJS

  - Budgets: handleEdit, handleDeleteClick (with deps: budgets)- [x] DTO (CreateBudgetDto, UpdateBudgetDto, QueryBudgetDto)

- ✅ Pattern: memo + useCallback combo prevents unnecessary child re-renders- [x] Endpoint: `POST /budgets` (tworzenie budżetu)

- **Time:** 20 minut- [x] Endpoint: `GET /budgets` (lista budżetów z filtrowaniem)

- **Commit:** 6baec10 - "perf: optimize component rendering"- [x] Endpoint: `GET /budgets/:id` (szczegóły + postęp)

- [x] Endpoint: `GET /budgets/:id/progress` (tylko progress)

### v0.5.6 - Accessibility Improvements (✅ Completed - 6 październik 2025)- [x] Endpoint: `PATCH /budgets/:id` (edycja)

- ✅ ARIA labels: CategoryList + TransactionList Edit/Delete buttons- [x] Endpoint: `DELETE /budgets/:id` (usunięcie)

  - Format: `aria-label="Edytuj kategorię {name}"`, `aria-label="Usuń transakcję {description}"`- [x] Logika obliczania postępu budżetu (spent/limit/percentage/alerts)

  - Coverage: Desktop table + Mobile cards (dual views)- [x] Auto-obliczanie endDate na podstawie period

- ✅ Enhanced focus styles: globals.css- [x] Walidacja: amount > 0, period (DAILY/WEEKLY/MONTHLY/YEARLY/CUSTOM)

  - `*:focus-visible`: 2px blue-500 outline, 2px offset, 4px border-radius- [x] Business rule: unique constraint (userId + categoryId + startDate)

  - Dark mode: blue-400 outline color- [x] Testy jednostkowe (24 tests, 100% passing ✅)

  - Keyboard navigation only (not mouse clicks)- [ ] Testy integracyjne

- ✅ Auto-focus: TransactionForm (amount), CategoryForm (name), BudgetForm (amount)

  - UX: Cursor immediately in most important field### 6.2 Frontend - UI Budżetów ✅ UKOŃCZONA

- ✅ WCAG 2.1 Level AA basics: Keyboard navigation + Screen reader support- [x] Strona budżetów (`/budgets`)

- **Time:** 30 minut- [x] Formularz tworzenia/edycji budżetu (kategoria, kwota, okres, daty)

- **Commit:** 081e1ad - "a11y: accessibility improvements"- [x] Lista budżetów z progress barami (BudgetList + BudgetCard)

- [x] Progress colors: green (<80%), yellow (80-99%), red (≥100%)

---- [x] Alerty przy przekroczeniu budżetu (80%, 100%)

- [x] Loading states i error handling

## 📊 Project Statistics- [x] Delete confirmation modal

- [x] Link "Budżety" w dashboard navbar

**Total Completed Versions:** 6 (v0.5.1 - v0.5.6)  - [x] API Routes proxy (/api/budgets, /api/budgets/[id])

**Total Development Time (Polish & Performance):** ~65 minut  - [x] Dashboard widget "Budżety" z overview (top 3 by percentage)

**Lines of Code Changed:** ~500 (estimated)  

**Files Modified:** 15+ (components, pages, styles, config)  **Wnioski z Fazy 6 (Backend + Frontend):**

**Tests Status:** Manual testing with Playwright MCP (11 screenshots captured)  - ✅ Budżety = kontrola wydatków z kategorii (reactive tracking)

**Docker Containers:** 3 (frontend, backend, db) - all running stable  - ✅ calculateProgress() agreguje transakcje automatycznie

- ✅ Alerty przy 80% i 100% limitu działają

**Code Quality:**- ✅ Dark mode + lucide-react icons throughout

- ✅ TypeScript strict mode enabled- ✅ Business logic: unique constraint zapobiega duplikatom

- ✅ ESLint passing (except expected Tailwind v4 warnings)- ✅ Dashboard widget: top 3 budżety, compact progress bars, graceful error handling

- ✅ No console errors in production- ✅ Testy jednostkowe: 24 tests covering all CRUD + calculateProgress logic (100% passing)

- ✅ Framer-motion animations: 60 FPS- ⚠️ Prisma Decimal → Number() conversion (jak w Transactions)

- ✅ Recharts performance: smooth rendering with React.memo- 📊 Pozostało: testy integracyjne (e2e)



**Screenshots Captured (Playwright MCP):**### 6.3 Dashboard Widget + Podstawowe Raporty ✅ UKOŃCZONA

- Desktop (1920x1080): 7 screenshots- [x] Dashboard widget "Budżety" (top 3 budżety z progress) ✅

  - login-page.png, homepage-desktop.png- [x] Endpoint: `GET /reports/summary` (podsumowanie: suma przychodów/wydatków za okres)

  - dashboard-desktop.png (9 transactions, 2 budgets, summary cards)- [x] Endpoint: `GET /reports/by-category` (wydatki/przychody po kategorii)

  - categories-desktop.png (7 categories, lucide-react icons)- [x] Strona raportów (`/reports`) z wykresami (Recharts PieChart)

  - budgets-desktop.png (2 budgets with progress bars)- [x] Wybór okresu dla raportów (miesiąc, kwartał, rok, własny zakres)

  - reports-desktop.png (CategoryPieChart with Recharts)- [x] DateRangePicker z presetami (bieżący miesiąc/kwartał/rok)

- Mobile (375x667): 4 screenshots- [x] SummaryCards (income/expense/balance z ikonami)

  - homepage-mobile.png, dashboard-mobile.png- [x] CategoryPieChart (breakdown wydatków z percentagami)

  - categories-mobile.png, budgets-mobile.png- [x] Link "Raporty" w nawigacji

  - mobile-menu-open.png (drawer with slide-in animation)- [x] Dark mode support

- [ ] Export danych do CSV (opcjonalnie - Faza 8)

---

---

## 📝 Notes & Philosophy

## 🧪 Faza 7: Testy i Jakość Kodu

**Development Philosophy:**

- **KISS** (Keep It Simple, Stupid) - najprostsze rozwiązania, które działają### 7.1 Testy Backend

- **YAGNI** (You Ain't Gonna Need It) - nie implementujemy funkcji "na zapas"- [ ] Konfiguracja Jest dla NestJS

- **MVP First** - kluczowe funkcjonalności najpierw, zaawansowane później- [ ] Testy jednostkowe dla wszystkich serwisów

- **Test-Driven Mindset** - "Zrobione" = "Przetestowane"- [ ] Testy integracyjne dla wszystkich endpointów API

- [ ] Code coverage > 80%

**Commit Convention:**

- Format: `<type>: <description>` (Conventional Commits)### 7.2 Testy Frontend

- Types: `feat`, `fix`, `perf`, `a11y`, `refactor`, `test`, `docs`, `style`, `chore`- [ ] Konfiguracja Jest + React Testing Library

- Minimalistyczny format (1 linia) - szczegóły w CHANGELOG.md- [ ] Testy jednostkowe dla kluczowych komponentów

- Przykłady:- [ ] Testy integracyjne dla głównych flow'ów (rejestracja, dodawanie transakcji)

  - `feat: budget progress bar animations`

  - `perf: optimize component rendering`### 7.3 Linting i Formatowanie

  - `a11y: accessibility improvements`- [ ] ESLint dla backendu i frontendu

- [ ] Prettier dla formatowania kodu

**Testing Strategy:**- [ ] Husky + lint-staged (opcjonalnie)

- Playwright MCP: Live browser testing z screenshotami

- Jest: Unit tests (pending dla v0.6.0+)---

- Integration tests: API endpoint testing (pending)

- Manual testing: Every feature before commit## 🚀 Faza 8: CI/CD i Dokumentacja



**Tech Stack:**### 8.1 GitHub Actions

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4- [ ] Workflow: uruchamianie testów przy każdym push/PR

- **Backend:** NestJS, Prisma, PostgreSQL- [ ] Workflow: budowanie obrazów Docker

- **Animation:** framer-motion (spring physics, GPU-accelerated)- [ ] Workflow: linting i type-checking

- **Charts:** Recharts (React.memo optimized)

- **State Management:** Zustand (lightweight, no boilerplate)### 8.2 Dokumentacja

- **Icons:** lucide-react (⚠️ CURRENTLY BROKEN - see URGENT)- [ ] Uzupełnienie `README.md` o pełną instrukcję setup'u

- **Forms:** react-hook-form (validation, error handling)- [ ] Dokumentacja API (Swagger w NestJS - opcjonalnie)

- [ ] `CONTRIBUTING.md` dla potencjalnych kontrybutorów

**Environment:**- [ ] Aktualizacja `TODO.md` z postępami

- **Docker:** 3 containers (frontend:3000, backend:4000, db:5432)

- **Hot Reload:** Next.js Turbopack (2-3s rebuild time)---

- **Test User:** test@test.pl / test1234

- **Live Data:** 9 transactions, 7 categories, 2 budgets## 🎨 Faza 9: Polish i UX (Post-MVP)



**Known Issues:**- [ ] Responsywność na urządzeniach mobilnych

- 🐛 **URGENT:** Lucide-react icons render as "?" (see URGENT section)- [ ] Dark mode (✅ częściowo - zaimplementowane dla Dashboard, Categories, Budgets)

- ⚠️ Tailwind v4 ESLint warnings: `@theme inline` syntax (expected, safe to ignore)- [ ] Animacje i transitions

- ⚠️ Git LF→CRLF warnings (Windows line endings, safe to ignore)- [ ] Accessibility audit (a11y)

- [ ] Optymalizacja wydajności (Lighthouse audit)

---- [ ] Testy E2E (Playwright/Cypress - opcjonalnie)



**Last Updated:** 6 października 2025, 16:00  ---

**Maintained By:** AI Copilot + User  

**Repository:** https://github.com/[user]/Tracker_kasy (private)## � Faza 10: Cele Oszczędnościowe (Post-MVP) 🎯 PLANOWANE


**Koncepcja:**
- **Savings Goals** = śledzenie celów oszczędnościowych (np. "Wakacje w Grecji", "Nowy laptop", "Fundusz awaryjny")
- **Różnica vs Budżety:**
  - **Budżet** = REACTIVE (kontrolujesz wydatki: "max 500 zł na rozrywkę/miesiąc")
  - **Savings Goal** = PROACTIVE (planujesz przyszłość: "odłóż 5000 zł na wakacje do grudnia")
- **Funkcjonalność:**
  - Nazwa celu (np. "Wakacje w Grecji")
  - Kwota docelowa (targetAmount)
  - Kwota aktualna (currentAmount - użytkownik manualnie aktualizuje lub linkuje z transakcjami INCOME do kategorii "Oszczędności")
  - Termin (deadline - opcjonalny)
  - Progress bar (currentAmount / targetAmount * 100%)
  - Tracking history (data + kwota wpłaty)

### 10.1 Backend - API Savings Goals (TODO)
- [ ] Model `SavingsGoal` w Prisma (id, userId, name, targetAmount, currentAmount, deadline, createdAt, updatedAt)
- [ ] Model `SavingsContribution` (id, goalId, amount, date, description) - historia wpłat
- [ ] Moduł `SavingsGoalsModule` w NestJS
- [ ] CRUD endpointy (POST, GET, PATCH, DELETE /savings-goals)
- [ ] Endpoint: `POST /savings-goals/:id/contribute` (dodanie wpłaty)
- [ ] Progress calculation (currentAmount / targetAmount)
- [ ] Walidacja: targetAmount > 0, currentAmount >= 0

### 10.2 Frontend - UI Savings Goals (TODO)
- [ ] Strona `/savings-goals` z listą celów
- [ ] Formularz tworzenia/edycji celu (nazwa, kwota docelowa, deadline)
- [ ] Progress bars z kolorami (podobnie jak budżety)
- [ ] Modal "Dodaj wpłatę" (kwota + data + opis)
- [ ] Historia wpłat dla każdego celu
- [ ] Dashboard widget "Cele Oszczędnościowe" (top 3)
- [ ] API Routes proxy

### 10.3 Integracje (opcjonalne)
- [ ] Link z kategorią "Oszczędności" (automatyczne dodawanie transakcji INCOME jako wpłaty do celu)
- [ ] Powiadomienia przy osiągnięciu kamieni milowych (25%, 50%, 75%, 100%)
- [ ] Export danych celu do PDF/CSV

---

## �📝 Notatki

- Każde zadanie powinno być realizowane zgodnie z zasadami KISS i YAGNI
- Przed oznaczeniem zadania jako ukończonego: kod musi być przetestowany
- Commit message'y według Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, etc.
- Regularne push'e do GitHuba
- **Budgets vs Savings Goals**: Budżety kontrolują wydatki (reactive), cele oszczędnościowe planują przyszłość (proactive) - to osobne funkcjonalności!
- **Emoji w production**: Unikaj emoji w UI - używaj lucide-react icons dla consistency

---

**Ostatnia aktualizacja:** 6 października 2025
