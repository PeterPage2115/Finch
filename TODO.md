# TODO - Tracker Kasy# TODO **Ostatnie zmiany (6 października 2025 - Sesja 5):**

- ✅ **FAZA 6.1 + 6.2 UKOŃCZONA!** 🎉

**Last Updated:** 6 października 2025, 16:00  - ✅ Faza 6.1: Backend Budgets CRUD (100%)

**Current Version:** v0.5.6    - BudgetsModule, Service, Controller

**Next Priority:** 🚨 Fix lucide-react icons (URGENT)  - calculateProgress() z alertami (80%, 100%)

  - Auto-obliczanie endDate dla okresów

---  - Business rule: unique userId+categoryId+startDate

  - ⏳ Testy pending (Faza 7)

## 🚨 URGENT (Critical Bugs)- ✅ Faza 6.2: Frontend Budgets UI (100%)

  - Strona /budgets z BudgetForm + BudgetList

### Fix: Lucide-react Icons Not Rendering (10-20 min)  - Progress bars (green/yellow/red)

- [ ] **Problem:** Ikony kategorii renderują się jako znaki zapytania (?) zamiast rzeczywistych ikon  - Delete confirmation modal

- [ ] **Diagnoza:** CategoryIcon.tsx używa dynamicznego importu `(LucideIcons as any)[iconName]`, który nie działa poprawnie w Next.js 15 SSR  - API Routes proxy

- [ ] **Rozwiązanie:**   - Link "Budżety" w navbar

  - Dodać `'use client'` directive do CategoryIcon.tsx  - **Dashboard widget ✅** (top 3 budżety, compact design)

  - Sprawdzić czy to rozwiązuje problem- 🐛 Bug fixes: Dark mode, emoji removal, unified navbar

  - Jeśli nie: stworzyć mapping object z wszystkimi używanymi ikonami- 💡 **Decyzja architektoniczna**: Budgets = kontrola wydatków (reactive), Savings Goals = cele oszczędnościowe (proactive) → osobne moduły!

- [ ] **Test:** Sprawdzić Playwright czy ikony renderują się poprawnie- 📈 **Postęp**: Dashboard widget done, pozostają Raporty (Faza 6.3) + Testy (Faza 7)

- **Priority:** 🔴 HIGH - Wizualny bug widoczny na wszystkich stronach z kategoriami

- **Impact:** UX - aplikacja wygląda nieprofesjonalnie bez ikon**Następny krok:** Faza 6.3 - Podstawowe Raporty 📊 lub Faza 7 - Testyzenia Finansów

- **Estimated Time:** 10-20 minut

**Data rozpoczęcia:** 1 października 2025  

---**Status:** Faza 6 w trakcie 🚀 - Budgets Backend+Frontend ✅ (Raporty + Dashboard widget pending)



## 🎯 NEXT UP (Quick Wins < 1 Hour)---



### v0.6.0 - Accessibility Addon (20-30 min)**Ostatnie zmiany (6 października 2025 - Sesja 5):**

- [ ] **Focus trap w drawer** (10 min)- ✅ **FAZA 6.1 + 6.2 UKOŃCZONA!** 🎉

  - Instalacja `focus-trap-react`- ✅ Faza 6.1: Backend Budgets CRUD (100%)

  - Wrap drawer content w `<FocusTrap>`  - BudgetsModule, Service, Controller

  - Test: Tab/Shift+Tab zamknięte w menu  - calculateProgress() z alertami (80%, 100%)

- [ ] **aria-live regions dla toastów** (10 min)  - Auto-obliczanie endDate dla okresów

  - Dodanie `<div role="alert" aria-live="polite">` do root layout  - Business rule: unique userId+categoryId+startDate

  - Zustand store dla notifications  - ⏳ Testy pending (Faza 7)

  - Przykłady: "Transakcja dodana", "Kategoria usunięta"- ✅ Faza 6.2: Frontend Budgets UI (100%)

- [ ] **Screen reader testing** (10 min)  - Strona /budgets z BudgetForm + BudgetList

  - Instalacja NVDA (Windows) lub VoiceOver (Mac)  - Progress bars (green/yellow/red)

  - Walkthrough z zamkniętymi oczami  - Delete confirmation modal

  - Poprawki jeśli coś nie działa  - API Routes proxy

- **Priority:** 🟢 MEDIUM - Etyczne zobowiązanie, WCAG 2.1 AA compliance  - Link "Budżety" w navbar

- **Impact:** Accessibility - pełna dostępność dla użytkowników z niepełnosprawnościami  - ⏳ Dashboard widget pending (Faza 6.3)

- **Result:** v0.6.0 "Production Ready - WCAG 2.1 AA Compliant"- 🐛 Bug fixes: Dark mode, emoji removal, unified navbar

- **Estimated Time:** 20-30 minut- � **Decyzja architektoniczna**: Budgets = kontrola wydatków (reactive), Savings Goals = cele oszczędnościowe (proactive) → osobne moduły!



---**Następny krok:** Faza 6.3 - Podstawowe Raporty 📊 lub Dashboard widget



## 📅 SHORT-TERM (1-5 Days)---



### v0.8.0 - Real Authentication System (3-5 dni)---



#### Day 1: User Profile Page (1-2h)## 🏗️ Faza 1: Inicjalizacja Projektu i Konfiguracja

- [ ] Frontend: Profile page z formularzem (Email, Full Name, Password Change)

- [ ] Backend: `/api/users/profile` endpoint (GET, PATCH)### 1.1 Struktura Projektu i Dokumentacja

- [ ] Walidacja: email unique, password min 8 chars- [x] Utworzenie struktury folderów (`frontend/`, `backend/`, `docs/`)

- [ ] Avatar upload (opcjonalnie - Cloudinary/AWS S3)- [x] Przygotowanie głównego pliku `README.md` z instrukcją uruchomienia

- [x] Konfiguracja `.gitignore` (node_modules, .env, build files, etc.)

#### Day 2: Password Reset Flow (1-2h)- [x] Inicjalizacja repozytorium Git i pierwszy commit

- [ ] Frontend: "Forgot password" link + formularz reset

- [ ] Backend: Email token generation (crypto.randomBytes)### 1.2 Backend - NestJS

- [ ] Email service: Nodemailer integration (SMTP config)- [x] Inicjalizacja projektu NestJS (`nest new backend`)

- [ ] Token verification: `/api/auth/reset-password/:token`- [x] Konfiguracja TypeScript (`tsconfig.json`)

- [x] Instalacja zależności: Prisma, Passport.js, JWT, class-validator, class-transformer

#### Day 3: Email Verification (1-2h - opcjonalnie)- [x] Utworzenie `Dockerfile` dla backendu

- [ ] Rejestracja wysyła email z linkiem weryfikacyjnym- [x] Konfiguracja zmiennych środowiskowych (`.env.example`)

- [ ] Backend: `/api/auth/verify-email/:token`- [x] Setup Prisma i połączenie z PostgreSQL

- [ ] User model: `emailVerified` boolean field- [x] Utworzenie podstawowej struktury folderów (`src/users`, `src/transactions`, `src/budgets`)

- [ ] Ograniczenia: nieweryfikowani użytkownicy nie mogą dodawać transakcji

### 1.3 Frontend - Next.js

#### Day 4: JWT Refresh Tokens (1-2h)- [x] Inicjalizacja projektu Next.js 14+ z TypeScript

- [ ] Dual token system: access token (15 min), refresh token (7 days)- [x] Konfiguracja Tailwind CSS

- [ ] Backend: `/api/auth/refresh` endpoint- [x] Instalacja zależności: Zustand, React Hook Form, Chart.js/Recharts

- [ ] Frontend: Axios interceptor automatycznie odświeża tokeny- [x] Utworzenie `Dockerfile` dla frontendu

- [ ] Secure HTTP-only cookies dla refresh tokens- [x] Konfiguracja zmiennych środowiskowych (`.env.example`)

- [x] Utworzenie podstawowej struktury folderów (`app/`, `components/`, `lib/`, `types/`)

#### Day 5: User Settings (1-2h)

- [ ] Theme preference: light/dark/system (Zustand store)### 1.4 Docker i Orkiestracja

- [ ] Language: pl/en (przygotowanie do i18n)- [x] Utworzenie `docker-compose.yml` (frontend, backend, PostgreSQL)

- [ ] Currency format: zł/$/€- [x] Konfiguracja wolumenu dla PostgreSQL (`pgdata`)

- [ ] localStorage persistence dla preferencji- [x] Konfiguracja sieci Docker dla komunikacji między serwisami

- [x] Test uruchomienia całego stacku: `docker-compose up`

- **Priority:** 🟡 HIGH - Fundament dla multi-tenant aplikacji- [x] Dokumentacja procesu uruchamiania w `README.md`

- **Impact:** Production readiness - prawdziwa autentykacja, security, user experience- [x] **Naprawa:** Health check frontendu zmieniony z wget na sprawdzanie procesu next-server

- **Result:** v0.8.0 "Multi-tenant Ready"

- **Estimated Time:** 3-5 dni (5-10 godzin total)---



---## 🗄️ Faza 2: Baza Danych i Modele



## 🚀 LONG-TERM (2-4 Weeks)### 2.1 Schemat Bazy Danych (Prisma)

- [x] Definicja modelu `User` (id, email, hasło-hash, createdAt, updatedAt)

### v0.9.x → v1.0.0 - Advanced Features- [x] Definicja modelu `Transaction` (id, userId, amount, category, description, date, type: income/expense)

- [x] Definicja modelu `Category` (id, name, type, userId)

#### Week 1: Advanced Charts (5-7 dni)- [x] Definicja modelu `Budget` (id, userId, categoryId, amount, period, startDate, endDate)

- [ ] **Trend charts** (2 dni)- [x] Definicja relacji między modelami

  - Recharts LineChart: Income/Expenses over 6 months- [x] Pierwsza migracja: `npx prisma migrate dev --name init`

  - Month-over-month comparison- [x] Seed danych testowych (opcjonalnie)

  - Year-over-year comparison

- [ ] **Budget vs Actual chart** (2 dni)---

  - Bar chart overlayed: Planned vs Actual spending

  - Color coding: Green (under budget), Yellow (80-100%), Red (over budget)## 🔐 Faza 3: Uwierzytelnianie i Autoryzacja

- [ ] **Category spending over time** (1 dzień)

  - Stacked area chart: All categories over 12 months### 3.1 Backend - System Auth

  - Interactive legend: toggle categories on/off- [x] Moduł `AuthModule` w NestJS

- [ ] **Export charts as images** (1 dzień)- [x] Endpoint rejestracji (`POST /auth/register`) z walidacją DTO

  - Recharts → Canvas → PNG download- [x] Haszowanie haseł (bcrypt)

  - Include in PDF reports- [x] Endpoint logowania (`POST /auth/login`) zwracający JWT

- [x] Guard JWT dla chronionych endpointów

#### Week 2: Data Export & Reports (3-4 dni)- [x] Decorator `@CurrentUser()` do wyciągania użytkownika z tokenu

- [ ] **CSV export** (1 dzień)- [x] Testy jednostkowe dla AuthService (11 testów)

  - Transactions: wszystkie pola (date, description, amount, category, type)- [x] Testy integracyjne dla endpointów auth (22 testy e2e)

  - Budgets: amount, period, category, progress

  - Categories: name, type, icon, color### 3.2 Frontend - UI Auth

- [ ] **PDF reports** (2 dni)- [x] Strona rejestracji (`/register`) z formularzem (React Hook Form)

  - jsPDF + jsPDF-AutoTable- [x] Strona logowania (`/login`) z formularzem

  - Include: Summary cards, charts (as images), transaction table- [x] Zarządzanie stanem autentykacji (Zustand store)

  - Custom branding: logo, color scheme- [x] Zapisywanie JWT w localStorage (via Zustand persist)

- [ ] **Email PDF reports** (1 dzień)- [x] Middleware Next.js do ochrony tras wymagających logowania

  - Nodemailer: attach PDF as email- [x] Komponent Dashboard (placeholder)

  - Schedule: weekly/monthly reports (node-cron)- [x] Strona główna z przekierowaniem dla zalogowanych



#### Week 3: Budget Notifications (5-7 dni)---

- [ ] **Email alerts** (2 dni)

  - Trigger: 80% budget utilization## 💰 Faza 4: Moduł Transakcji (MVP) ✅ UKOŃCZONA

  - Template: HTML email with budget details

  - User preferences: Enable/Disable per budget### 4.1 Backend - API Transakcji ✅

- [ ] **Weekly summary emails** (2 dni)- [x] Moduł `TransactionsModule` w NestJS

  - Cron job: Every Monday 9:00 AM- [x] DTO dla transakcji (CreateTransactionDto, UpdateTransactionDto)

  - Content: Last week income/expenses, top categories, budget status- [x] Endpoint: `POST /transactions` (tworzenie transakcji)

- [ ] **Cron job setup** (1 dzień)- [x] Endpoint: `GET /transactions` (lista transakcji użytkownika z filtrowaniem)

  - node-cron w backend- [x] Endpoint: `GET /transactions/:id` (szczegóły transakcji)

  - Separate worker process (Docker service)- [x] Endpoint: `PATCH /transactions/:id` (edycja transakcji)

  - Logging: Winston + log files- [x] Endpoint: `DELETE /transactions/:id` (usunięcie transakcji)

- [x] Walidacja danych wejściowych (class-validator)

#### Week 4: PWA Support (3-5 dni)- [x] **Bonus:** Paginacja (page, limit, meta)

- [ ] **Service worker** (2 dni)- [x] **Bonus:** Filtrowanie (type, categoryId, dateRange)

  - next-pwa plugin- [x] Testy jednostkowe dla TransactionsService

  - Cache strategies: Network First (API), Cache First (static assets)- [x] Testy integracyjne dla wszystkich endpointów

  - Offline fallback page

- [ ] **Offline mode** (2 dni)### 4.2 Frontend - UI Transakcji ✅

  - IndexedDB: cache transactions/categories/budgets- [x] Strona główna z listą transakcji (`/dashboard`)

  - Sync queue: retry failed requests when online- [x] Formularz dodawania transakcji (modal)

  - UI indicators: "You're offline" banner- [x] Wyświetlanie listy transakcji (tabela)

- [ ] **Install prompt** (1 dzień)- [x] Filtrowanie transakcji (po dacie, kategorii, typie)

  - "Add to Home Screen" button- [x] Edycja transakcji

  - PWA manifest: icons, theme color, display mode- [x] Usuwanie transakcji (z potwierdzeniem)

  - Push notifications (opcjonalnie - Firebase Cloud Messaging)- [x] Obsługa błędów i komunikatów (toast notifications)

- [x] Loading states podczas zapytań API

#### Additional Features (Optional - 1 week)- [x] **Bonus:** Zustand store z localStorage persist

- [ ] **Recurring transactions** (2 dni)- [x] **Bonus:** Next.js API Routes jako proxy

  - Auto-add: monthly rent, salary, subscriptions- [x] **Bonus:** Categories API (GET /categories)

  - Cron job: check every day at midnight- [x] **Bonus:** ThemeProvider + Pure Black Dark Mode

  - User preferences: Enable/Disable per recurring transaction- [x] **Bonus:** Professional Icons (lucide-react)

- [ ] **Tags for transactions** (1 dzień)- [x] **Bonus:** Stats calculation z defensywnym programowaniem

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
