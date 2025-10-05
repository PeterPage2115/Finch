# TODO - Aplikacja do Śledzenia Finansów

**Data rozpoczęcia:** 1 października 2025  
**Status:** Faza 5 zakończona ✅ - Categories CRUD (Backend + Frontend) (86/86 zadań - 100%) 🎉

---

**Ostatnie zmiany (6 października 2025 - Sesja 4):**
- ✅ **FAZA 5 UKOŃCZONA 100%!** 🎉
- ✅ Faza 5.1: Backend Categories CRUD (100%)
- ✅ Faza 5.2: Frontend Categories UI (100%)
  - Strona /categories z CategoryForm + CategoryList
  - API Routes: POST, PATCH, DELETE
  - Link "Kategorie" w navbar
  - Delete confirmation modal
  - lucide-react icons
- 📊 Total: 86/86 zadań = 100% MVP gotowe!
- � Gotowi do Fazy 6: Budżety

**Następny krok:** Faza 6 - Moduł Budżetów (Backend + Frontend) 💰📊

---

---

## 🏗️ Faza 1: Inicjalizacja Projektu i Konfiguracja

### 1.1 Struktura Projektu i Dokumentacja
- [x] Utworzenie struktury folderów (`frontend/`, `backend/`, `docs/`)
- [x] Przygotowanie głównego pliku `README.md` z instrukcją uruchomienia
- [x] Konfiguracja `.gitignore` (node_modules, .env, build files, etc.)
- [x] Inicjalizacja repozytorium Git i pierwszy commit

### 1.2 Backend - NestJS
- [x] Inicjalizacja projektu NestJS (`nest new backend`)
- [x] Konfiguracja TypeScript (`tsconfig.json`)
- [x] Instalacja zależności: Prisma, Passport.js, JWT, class-validator, class-transformer
- [x] Utworzenie `Dockerfile` dla backendu
- [x] Konfiguracja zmiennych środowiskowych (`.env.example`)
- [x] Setup Prisma i połączenie z PostgreSQL
- [x] Utworzenie podstawowej struktury folderów (`src/users`, `src/transactions`, `src/budgets`)

### 1.3 Frontend - Next.js
- [x] Inicjalizacja projektu Next.js 14+ z TypeScript
- [x] Konfiguracja Tailwind CSS
- [x] Instalacja zależności: Zustand, React Hook Form, Chart.js/Recharts
- [x] Utworzenie `Dockerfile` dla frontendu
- [x] Konfiguracja zmiennych środowiskowych (`.env.example`)
- [x] Utworzenie podstawowej struktury folderów (`app/`, `components/`, `lib/`, `types/`)

### 1.4 Docker i Orkiestracja
- [x] Utworzenie `docker-compose.yml` (frontend, backend, PostgreSQL)
- [x] Konfiguracja wolumenu dla PostgreSQL (`pgdata`)
- [x] Konfiguracja sieci Docker dla komunikacji między serwisami
- [x] Test uruchomienia całego stacku: `docker-compose up`
- [x] Dokumentacja procesu uruchamiania w `README.md`
- [x] **Naprawa:** Health check frontendu zmieniony z wget na sprawdzanie procesu next-server

---

## 🗄️ Faza 2: Baza Danych i Modele

### 2.1 Schemat Bazy Danych (Prisma)
- [x] Definicja modelu `User` (id, email, hasło-hash, createdAt, updatedAt)
- [x] Definicja modelu `Transaction` (id, userId, amount, category, description, date, type: income/expense)
- [x] Definicja modelu `Category` (id, name, type, userId)
- [x] Definicja modelu `Budget` (id, userId, categoryId, amount, period, startDate, endDate)
- [x] Definicja relacji między modelami
- [x] Pierwsza migracja: `npx prisma migrate dev --name init`
- [x] Seed danych testowych (opcjonalnie)

---

## 🔐 Faza 3: Uwierzytelnianie i Autoryzacja

### 3.1 Backend - System Auth
- [x] Moduł `AuthModule` w NestJS
- [x] Endpoint rejestracji (`POST /auth/register`) z walidacją DTO
- [x] Haszowanie haseł (bcrypt)
- [x] Endpoint logowania (`POST /auth/login`) zwracający JWT
- [x] Guard JWT dla chronionych endpointów
- [x] Decorator `@CurrentUser()` do wyciągania użytkownika z tokenu
- [x] Testy jednostkowe dla AuthService (11 testów)
- [x] Testy integracyjne dla endpointów auth (22 testy e2e)

### 3.2 Frontend - UI Auth
- [x] Strona rejestracji (`/register`) z formularzem (React Hook Form)
- [x] Strona logowania (`/login`) z formularzem
- [x] Zarządzanie stanem autentykacji (Zustand store)
- [x] Zapisywanie JWT w localStorage (via Zustand persist)
- [x] Middleware Next.js do ochrony tras wymagających logowania
- [x] Komponent Dashboard (placeholder)
- [x] Strona główna z przekierowaniem dla zalogowanych

---

## 💰 Faza 4: Moduł Transakcji (MVP) ✅ UKOŃCZONA

### 4.1 Backend - API Transakcji ✅
- [x] Moduł `TransactionsModule` w NestJS
- [x] DTO dla transakcji (CreateTransactionDto, UpdateTransactionDto)
- [x] Endpoint: `POST /transactions` (tworzenie transakcji)
- [x] Endpoint: `GET /transactions` (lista transakcji użytkownika z filtrowaniem)
- [x] Endpoint: `GET /transactions/:id` (szczegóły transakcji)
- [x] Endpoint: `PATCH /transactions/:id` (edycja transakcji)
- [x] Endpoint: `DELETE /transactions/:id` (usunięcie transakcji)
- [x] Walidacja danych wejściowych (class-validator)
- [x] **Bonus:** Paginacja (page, limit, meta)
- [x] **Bonus:** Filtrowanie (type, categoryId, dateRange)
- [x] Testy jednostkowe dla TransactionsService
- [x] Testy integracyjne dla wszystkich endpointów

### 4.2 Frontend - UI Transakcji ✅
- [x] Strona główna z listą transakcji (`/dashboard`)
- [x] Formularz dodawania transakcji (modal)
- [x] Wyświetlanie listy transakcji (tabela)
- [x] Filtrowanie transakcji (po dacie, kategorii, typie)
- [x] Edycja transakcji
- [x] Usuwanie transakcji (z potwierdzeniem)
- [x] Obsługa błędów i komunikatów (toast notifications)
- [x] Loading states podczas zapytań API
- [x] **Bonus:** Zustand store z localStorage persist
- [x] **Bonus:** Next.js API Routes jako proxy
- [x] **Bonus:** Categories API (GET /categories)
- [x] **Bonus:** ThemeProvider + Pure Black Dark Mode
- [x] **Bonus:** Professional Icons (lucide-react)
- [x] **Bonus:** Stats calculation z defensywnym programowaniem
- [x] **CRITICAL FIX:** amount.toFixed error (Prisma Decimal → string)
- [x] **CRITICAL FIX:** Auto-create default categories przy rejestracji

**Wnioski z Fazy 4:**
- ⚠️ Prisma Decimal zwraca string w runtime - zawsze używaj Number() conversion
- ✅ Sequential thinking skuteczny dla złożonych problemów
- ✅ User-scoped dane wymagają automatycznego seed przy rejestracji
- ✅ Krótkie commity + CHANGELOG.md dla szczegółów

---

## 📊 Faza 5: Kategorie ✅ 100% UKOŃCZONA

### 5.1 Backend - API Kategorii ✅ UKOŃCZONA
- [x] Moduł `CategoriesModule` w NestJS
- [x] Endpoint: `GET /categories` (lista kategorii użytkownika)
- [x] Endpoint: `GET /categories/:id` (szczegóły pojedynczej kategorii)
- [x] Endpoint: `POST /categories` (tworzenie niestandardowej kategorii)
- [x] Endpoint: `PATCH /categories/:id` (edycja kategorii)
- [x] Endpoint: `DELETE /categories/:id` (usunięcie kategorii)
- [x] Auto-create domyślnych kategorii przy rejestracji (AuthService)
- [x] DTO: CreateCategoryDto, UpdateCategoryDto z walidacją
- [x] CategoriesService z logiką biznesową
- [x] Business rule: nie można usunąć kategorii z transakcjami
- [x] Walidacja duplikatów (unique constraint userId_name_type)

### 5.2 Frontend - UI Kategorii ✅ UKOŃCZONA
- [x] Select/dropdown kategorii w formularzu transakcji (z API)
- [x] Strona zarządzania kategoriami (`/categories`)
- [x] Formularz dodawania/edycji niestandardowej kategorii
- [x] Lista kategorii z możliwością edycji/usunięcia
- [x] Ikony kategorii (lucide-react: Plus, Pencil, Trash2, ArrowLeft)
- [x] Kolory kategorii (color picker input z hex validation)
- [x] API Routes proxy: POST, PATCH, DELETE /api/categories
- [x] Link "Kategorie" w navbar dashboard
- [x] Delete confirmation modal
- [x] Empty state + loading states
- [x] Extended categoriesApi client (wszystkie metody CRUD)

**Wnioski z Fazy 5:**
- ✅ Kompletny CRUD dla kategorii (Backend + Frontend)
- ✅ User może teraz customizować swoje kategorie
- ✅ lucide-react dla profesjonalnych ikon
- ✅ Business rules działają (blokada delete z transactions)
- 🎉 MVP Fazy 1-5 gotowe (86/86 zadań - 100%)

---

## 📈 Faza 6: Budżety i Raporty (MVP) ⏭️ NASTĘPNA

### 6.1 Backend - API Budżetów
- [ ] Moduł `BudgetsModule` w NestJS
- [ ] DTO (CreateBudgetDto, UpdateBudgetDto)
- [ ] Endpoint: `POST /budgets` (tworzenie budżetu)
- [ ] Endpoint: `GET /budgets` (lista budżetów z filtrowaniem)
- [ ] Endpoint: `GET /budgets/:id` (szczegóły + postęp)
- [ ] Endpoint: `PATCH /budgets/:id` (edycja)
- [ ] Endpoint: `DELETE /budgets/:id` (usunięcie)
- [ ] Logika obliczania postępu budżetu (wydane/limit)
- [ ] Walidacja: amount > 0, period (MONTHLY/WEEKLY/YEARLY)
- [ ] Testy jednostkowe
- [ ] Testy integracyjne

### 6.2 Frontend - UI Budżetów
- [ ] Strona budżetów (`/budgets`)
- [ ] Formularz tworzenia budżetu (kategoria, kwota, okres)
- [ ] Lista budżetów z progress barami
- [ ] Progress colors: green (<80%), yellow (80-99%), red (≥100%)
- [ ] Alerty przy przekroczeniu budżetu (80%, 100%)
- [ ] Dashboard widget "Budżety" z overview
- [ ] Loading states i error handling

### 6.3 Podstawowe Raporty
- [ ] Endpoint: `GET /reports/summary` (podsumowanie: suma przychodów/wydatków za okres)
- [ ] Endpoint: `GET /reports/by-category` (wydatki/przychody po kategorii)
- [ ] Strona raportów (`/reports`) z wykresami (Chart.js/Recharts)
- [ ] Wybór okresu dla raportów (miesiąc, kwartał, rok)
- [ ] Export danych do CSV (opcjonalnie)

---

## 🧪 Faza 7: Testy i Jakość Kodu

### 7.1 Testy Backend
- [ ] Konfiguracja Jest dla NestJS
- [ ] Testy jednostkowe dla wszystkich serwisów
- [ ] Testy integracyjne dla wszystkich endpointów API
- [ ] Code coverage > 80%

### 7.2 Testy Frontend
- [ ] Konfiguracja Jest + React Testing Library
- [ ] Testy jednostkowe dla kluczowych komponentów
- [ ] Testy integracyjne dla głównych flow'ów (rejestracja, dodawanie transakcji)

### 7.3 Linting i Formatowanie
- [ ] ESLint dla backendu i frontendu
- [ ] Prettier dla formatowania kodu
- [ ] Husky + lint-staged (opcjonalnie)

---

## 🚀 Faza 8: CI/CD i Dokumentacja

### 8.1 GitHub Actions
- [ ] Workflow: uruchamianie testów przy każdym push/PR
- [ ] Workflow: budowanie obrazów Docker
- [ ] Workflow: linting i type-checking

### 8.2 Dokumentacja
- [ ] Uzupełnienie `README.md` o pełną instrukcję setup'u
- [ ] Dokumentacja API (Swagger w NestJS - opcjonalnie)
- [ ] `CONTRIBUTING.md` dla potencjalnych kontrybutorów
- [ ] Aktualizacja `TODO.md` z postępami

---

## 🎨 Faza 9: Polish i UX (Post-MVP)

- [ ] Responsywność na urządzeniach mobilnych
- [ ] Dark mode
- [ ] Animacje i transitions
- [ ] Accessibility audit (a11y)
- [ ] Optymalizacja wydajności (Lighthouse audit)
- [ ] Testy E2E (Playwright/Cypress - opcjonalnie)

---

## 📝 Notatki

- Każde zadanie powinno być realizowane zgodnie z zasadami KISS i YAGNI
- Przed oznaczeniem zadania jako ukończonego: kod musi być przetestowany
- Commit message'y według Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, etc.
- Regularne push'e do GitHuba

---

**Ostatnia aktualizacja:** 1 października 2025
