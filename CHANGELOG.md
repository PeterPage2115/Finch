# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/).

## [Unreleased]

### Dodane
- Categories API (Backend + Frontend) - kategorie są user-specific
- ThemeProvider z Context API dla globalnego dark mode
- Pure black background (#000) w dark mode dla lepszego kontrastu
- Parallel fetch transactions + categories (Promise.all)
- Dark mode dostępny globalnie (login, register, dashboard)
- Toggle dark mode button w navbar
- Defensywne programowanie w stats calculation

### Zmienione
- MOCK_CATEGORIES zastąpione przez real API call
- Dark mode: gray-900 → black (#000) dla tła
- Navbar: gray-800 → gray-900 (lekka separacja od tła)
- Stats calculation: dodano Array.isArray() + Number() casting

### Naprawione
- **CRITICAL**: Błąd "Category not found or does not belong to user" - kategorie są teraz pobierane z API
- **CRITICAL**: ThemeProvider context error blokujący logowanie
- TypeError "stats.expenses.toFixed is not a function"
- Dark mode toggle nie działał (problem z mounted state)
- Transakcje można teraz dodawać na wszystkich kontach

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
