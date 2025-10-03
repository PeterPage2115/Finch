# TODO - Aplikacja do Śledzenia Finansów

**Data rozpoczęcia:** 1 października 2025  
**Status:** Faza 3.2 zakończona ✅ (46/86 zadań - 53%)

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

## 💰 Faza 4: Moduł Transakcji (MVP)

### 4.1 Backend - API Transakcji
- [ ] Moduł `TransactionsModule` w NestJS
- [ ] DTO dla transakcji (CreateTransactionDto, UpdateTransactionDto)
- [ ] Endpoint: `POST /transactions` (tworzenie transakcji)
- [ ] Endpoint: `GET /transactions` (lista transakcji użytkownika z filtrowaniem)
- [ ] Endpoint: `GET /transactions/:id` (szczegóły transakcji)
- [ ] Endpoint: `PUT /transactions/:id` (edycja transakcji)
- [ ] Endpoint: `DELETE /transactions/:id` (usunięcie transakcji)
- [ ] Walidacja danych wejściowych (class-validator)
- [ ] Testy jednostkowe dla TransactionsService
- [ ] Testy integracyjne dla wszystkich endpointów

### 4.2 Frontend - UI Transakcji
- [ ] Strona główna z listą transakcji (`/dashboard`)
- [ ] Formularz dodawania transakcji (modal lub osobna strona)
- [ ] Wyświetlanie listy transakcji (tabela/karty)
- [ ] Filtrowanie transakcji (po dacie, kategorii, typie)
- [ ] Edycja transakcji
- [ ] Usuwanie transakcji (z potwierdzeniem)
- [ ] Obsługa błędów i komunikatów (toast notifications)
- [ ] Loading states podczas zapytań API

---

## 📊 Faza 5: Kategorie

### 5.1 Backend - API Kategorii
- [ ] Moduł `CategoriesModule` w NestJS
- [ ] Endpoint: `POST /categories` (tworzenie kategorii)
- [ ] Endpoint: `GET /categories` (lista kategorii użytkownika)
- [ ] Endpoint: `PUT /categories/:id` (edycja kategorii)
- [ ] Endpoint: `DELETE /categories/:id` (usunięcie kategorii)
- [ ] Domyślne kategorie dla nowych użytkowników
- [ ] Testy

### 5.2 Frontend - UI Kategorii
- [ ] Strona zarządzania kategoriami (`/categories`)
- [ ] Formularz dodawania/edycji kategorii
- [ ] Lista kategorii z możliwością usunięcia
- [ ] Select/dropdown kategorii w formularzu transakcji

---

## 📈 Faza 6: Budżety i Raporty (MVP)

### 6.1 Backend - API Budżetów
- [ ] Moduł `BudgetsModule` w NestJS
- [ ] Endpoint: `POST /budgets` (tworzenie budżetu)
- [ ] Endpoint: `GET /budgets` (lista budżetów)
- [ ] Endpoint: `GET /budgets/:id` (szczegóły + postęp)
- [ ] Endpoint: `PUT /budgets/:id` (edycja)
- [ ] Endpoint: `DELETE /budgets/:id` (usunięcie)
- [ ] Logika obliczania postępu budżetu
- [ ] Testy

### 6.2 Frontend - UI Budżetów
- [ ] Strona budżetów (`/budgets`)
- [ ] Formularz tworzenia budżetu
- [ ] Wyświetlanie listy budżetów z progress barami
- [ ] Alerty przy przekroczeniu budżetu

### 6.3 Podstawowe Raporty
- [ ] Endpoint: `GET /reports/summary` (podsumowanie: suma przychodów/wydatków za okres)
- [ ] Endpoint: `GET /reports/by-category` (wydatki/przychody po kategorii)
- [ ] Strona raportów (`/reports`) z wykresami (Chart.js/Recharts)
- [ ] Wybór okresu dla raportów (miesiąc, kwartał, rok)

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
