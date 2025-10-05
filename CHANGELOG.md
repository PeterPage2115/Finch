# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/).

## [Unreleased]

### W planach
- **FAZA 6**: Moduł Budżetów (Backend + Frontend)
- Wykresy wydatków (Chart.js integration)
- Export danych do CSV/PDF
- Usprawnienia kolorystyki dla dark mode

## [0.4.1] - 2025-10-06

### Naprawione
- **CRITICAL**: Zustand hydration w Next.js SSR
  * Dodano `_hasHydrated` flag do authStore
  * `onRehydrateStorage` callback ustawia flagę po hydration
  * Categories/Dashboard sprawdzają hydration przed auth check
  * Rozwiązano problem przekierowań do /login gdy użytkownik jest zalogowany
- **@CurrentUser decorator** - akceptuje parametry pola (np. `@CurrentUser('id')`)
- **Puste pliki DTO** - `index.ts` i `update-category.dto.ts` wypełnione
- **CategoriesService** - kompletna implementacja (był pusty plik)
  * findAll, findOne, create, update, remove
  * Business rule: blokada usunięcia kategorii z transakcjami
- **CategoriesController** - refaktoryzacja (używa service zamiast Prisma)
- **Middleware** - uproszczony kod auth sprawdzania

### Dodane
- PROJECT_STATUS.md - kompletny stan projektu + zasady pracy
- MCP tools w dokumentacji - Sequential Thinking, Memory, Context7

### Wnioski techniczne
- ✅ Zustand persist w Next.js SSR wymaga hydration handling
- ✅ MCP tools (#mcp_sequentialthi_sequentialthinking, #memory, #mcp_upstash_conte_get-library-docs) znacząco przyspieszają debugging
- ⚠️ Zawsze sprawdzać czy pliki nie są puste przed użyciem

## [0.4.0] - 2025-10-06

### Dodane
- **Categories Frontend UI (FAZA 5 UKOŃCZONA 100%)** ✅
  * Strona /categories - kompletne zarządzanie kategoriami
  * CategoryForm component (create/edit z full walidacją)
  * CategoryList component (grid view z grupowaniem INCOME/EXPENSE)
  * API Routes: POST, PATCH, DELETE /api/categories
  * Link "Kategorie" w navbar dashboard
  * Delete confirmation modal
  * Empty state dla pustej listy
  * Loading states + error handling
- lucide-react icons (Plus, ArrowLeft, Pencil, Trash2)
- Extended categoriesApi: create, update, delete, getById methods

### Zmienione
- categoriesApi rozbudowany o wszystkie metody CRUD
- Dashboard navbar: dodano nawigację (Dashboard, Kategorie)
- Color picker + icon input w CategoryForm

### Zakończone fazy
- ✅ **FAZA 5: Kategorie** (Backend + Frontend - 100%)

## [0.3.0] - 2025-10-04

### Dodane
- Categories API (Backend + Frontend) - kategorie są user-specific
- ThemeProvider z Context API dla globalnego dark mode
- Pure black background (#000) w dark mode dla lepszego kontrastu
- Parallel fetch transactions + categories (Promise.all)
- Dark mode dostępny globalnie (login, register, dashboard)
- Toggle dark mode button w navbar
- Defensywne programowanie w stats calculation
- **Automatyczne tworzenie domyślnych kategorii przy rejestracji**
- Professional icons z lucide-react (zastąpienie emotek)

### Zmienione
- MOCK_CATEGORIES zastąpione przez real API call
- Dark mode: gray-900 → black (#000) dla tła
- Navbar: gray-800 → gray-900 (lekka separacja od tła)
- Stats calculation: dodano Array.isArray() + Number() casting
- Commity: krótkie wiadomości, szczegóły w CHANGELOG

### Naprawione
- **CRITICAL**: Runtime TypeError "amount.toFixed is not a function" - Prisma Decimal zwraca string
- **CRITICAL**: Błąd "Category not found or does not belong to user" - kategorie są teraz pobierane z API
- **CRITICAL**: ThemeProvider context error blokujący logowanie
- **CRITICAL**: Brak kategorii dla nowych użytkowników - auto-create przy register
- Dark mode toggle nie działał (problem z mounted state)
- Transakcje można teraz dodawać na wszystkich kontach

### Wnioski techniczne
- ⚠️ Prisma Decimal typ = string w runtime, zawsze używaj Number() conversion
- ✅ Sequential thinking skuteczny dla złożonych problemów
- ✅ User-scoped dane wymagają automatycznego seed przy rejestracji
- ✅ Weryfikacja w bazie > założenia TypeScript types

## [0.2.0] - 2025-10-04

### Dodane
- Backend Transactions CRUD API (POST, GET, PATCH, DELETE)
- Frontend Transactions komponenty (TransactionList, TransactionForm)
- Zustand store dla transactions z localStorage persist
- Next.js API Routes jako proxy do backendu
- Filtrowanie transakcji (type, categoryId, dateRange)
- Paginacja (page, limit, meta)

### Naprawione
- JWT auth dla wszystkich endpoints transakcji
- User-scoped access (user widzi tylko swoje transakcje)

## [0.1.0] - 2025-10-03

### Dodane
- Inicjalizacja projektu (Next.js 15 + NestJS)
- Docker Compose setup (frontend, backend, PostgreSQL)
- Prisma ORM z migracjami
- JWT Authentication (login, register, /auth/me)
- AuthStore z Zustand (persist do localStorage)
- Middleware do ochrony routes
- Dashboard podstawowy layout

### Bezpieczeństwo
- Zmienne środowiskowe dla secrets (JWT_SECRET)
- .env.example dla dokumentacji
- .gitignore dla .env files
