# � Finch - Personal Finance Tracker

> 📢 **English version coming soon!** | Full internationalization (i18n) support planned for v1.1
>
> **English Documentation (WIP):** This is a Polish financial tracking application. English UI and documentation are currently in development. See [docs/i18n/](./docs/i18n/) for progress.

**Open-source web application for personal finance management**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🎉 What's New in v1.0 (January 2025)

- ✅ **Nowy system ikon** - Lucide icons zamiast emoji (profesjonalny wygląd)
- ✅ **Pełny dark mode** - Kompletne wsparcie dla trybu ciemnego
- ✅ **Ulepszone wykresy** - CategoryPieChart z interaktywnymi detalami transakcji
- ✅ **Modal szczegółów kategorii** - Kliknij segment wykresu, aby zobaczyć transakcje
- ✅ **Zoptymalizowana architektura** - Zustand store persistence, API client refactoring
- ✅ **Testy jednostkowe** - 88 testów backend (100% service coverage)
- ✅ **Zero luk bezpieczeństwa** - npm audit: 0 vulnerabilities
- ✅ **Kompletna dokumentacja** - 800+ linii docs, CHANGELOG, API reference

📖 **Zobacz pełną listę zmian:** [CHANGELOG.md](./CHANGELOG.md)

## 📋 About The Project

Finch is a modern web application designed for simplicity and easy self-hosting. Track income, expenses, categorize transactions, set budgets, and generate financial reports.

### ✨ Key Features

- 🔒 **Privacy** - Your data stays with you (self-hosted)
- 🐳 **Easy deployment** - One command: `docker-compose up`
- 📊 **Intuitive interface** - Clean dashboard with charts
- 💼 **Budget management** - Set limits and monitor expenses
- 📈 **Reports** - Analyze your finances over time

## 🛠️ Stack Technologiczny

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend:** NestJS, TypeScript
- **Baza Danych:** PostgreSQL 17
- **ORM:** Prisma
- **Konteneryzacja:** Docker & Docker Compose

📖 **Dokumentacja techniczna:** [docs/technical/](./docs/technical/)

## 🚀 Szybki Start

### Wymagania

- Docker (wersja 20.10+)
- Docker Compose (wersja 2.0+)
- Git

### Instalacja i Uruchomienie

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/[twoja-nazwa-uzytkownika]/Tracker_kasy.git
   cd Tracker_kasy
   ```

2. **Skonfiguruj zmienne środowiskowe (opcjonalnie):**
   ```bash
   # Skopiuj plik .env.example jako .env
   cp .env.example .env
   
   # WAŻNE: W produkcji zmień JWT_SECRET na bezpieczny, losowy ciąg znaków!
   # Możesz wygenerować go za pomocą:
   # openssl rand -base64 32
   ```

3. **Uruchom aplikację:**
   ```bash
   docker-compose up -d
   ```

   Przy pierwszym uruchomieniu Docker:
   - Pobierze obrazy PostgreSQL
   - Zbuduje obrazy backendu i frontendu
   - Uruchomi wszystkie kontenery
   - Backend automatycznie wykona migracje bazy danych

   **Proces może potrwać 2-5 minut przy pierwszym uruchomieniu.**

4. **Sprawdź status:**
   ```bash
   docker-compose ps
   ```

   Wszystkie serwisy powinny być w stanie `healthy` lub `running`.

5. **Otwórz aplikację w przeglądarce:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:3001](http://localhost:3001)
   - **Baza danych:** `localhost:5432`

### Pierwsza konfiguracja

Po uruchomieniu aplikacji:
1. Otwórz [http://localhost:3000](http://localhost:3000)
2. Kliknij "Załóż konto" i zarejestruj się
3. Zaloguj się do aplikacji
4. Gotowe! Możesz zacząć dodawać transakcje

<details>
<summary>🛑 Zatrzymanie aplikacji</summary>

```bash
# Zatrzymanie kontenerów (dane pozostają)
docker-compose stop

# Zatrzymanie i usunięcie kontenerów (dane pozostają w wolumenie)
docker-compose down

# UWAGA: To usunie WSZYSTKIE dane!
docker-compose down -v
```
</details>

<details>
<summary>📋 Logi i Debugowanie</summary>

```bash
# Wszystkie logi
docker-compose logs -f

# Logi konkretnego serwisu
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Sprawdzenie statusu health checks
docker-compose ps
```
</details>

<details>
<summary>🔄 Aktualizacja</summary>

```bash
# Pobierz najnowsze zmiany
git pull

# Przebuduj i uruchom ponownie
docker-compose up -d --build
```
</details>

## 🏗️ Architektura

<details>
<summary>📊 Komponenty Systemu</summary>

```
┌─────────────────────────────────────────────────────────┐
│                      Użytkownik                          │
│                    (Przeglądarka)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP (port 3000)
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Frontend (Next.js)                      │
│  - Server-Side Rendering                                 │
│  - Tailwind CSS, Zustand                                 │
│  - React Hook Form, Recharts                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (port 3001)
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Backend (NestJS)                        │
│  - RESTful API                                           │
│  - JWT Authentication                                    │
│  - Prisma ORM                                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ PostgreSQL Protocol (port 5432)
                     │
┌────────────────────▼────────────────────────────────────┐
│              Baza Danych (PostgreSQL)                    │
│  - Dane użytkowników                                     │
│  - Transakcje, Kategorie, Budżety                        │
└──────────────────────────────────────────────────────────┘
```
</details>

<details>
<summary>📁 Struktura Projektu</summary>

```
Tracker_kasy/
├── backend/              # Backend (NestJS)
│   ├── src/
│   │   ├── auth/         # Moduł uwierzytelniania
│   │   ├── users/        # Zarządzanie użytkownikami
│   │   ├── transactions/ # Transakcje finansowe
│   │   ├── categories/   # Kategorie
│   │   ├── budgets/      # Budżety
│   │   └── prisma.service.ts
│   ├── prisma/
│   │   └── schema.prisma # Schemat bazy danych
│   └── Dockerfile
│
├── frontend/             # Frontend (Next.js)
│   ├── app/              # App Router (Next.js 14+)
│   ├── components/       # Komponenty React
│   ├── lib/              # Utilities i stores
│   ├── types/            # TypeScript types
│   └── Dockerfile
│
├── docs/                 # Dokumentacja
├── docker-compose.yml    # Orkiestracja Docker
└── README.md
```
</details>

## 📚 Dokumentacja

Szczegółowa dokumentacja dostępna w folderze [`docs/`](./docs/):

- [**API Reference**](./docs/API.md) - Kompletna dokumentacja endpointów REST API (Auth, Users, Transactions, etc.)
- [**Schemat Bazy Danych**](./docs/DATABASE.md) - Modele, relacje, migracje, przykładowe zapytania
- [**Docker & Orkiestracja**](./docs/DOCKER.md) - Szczegółowy przewodnik po konfiguracji Docker
- [Architektura aplikacji](./docs/architecture.md) *(wkrótce)*
- [Przewodnik developera](./docs/developer-guide.md) *(wkrótce)*

<details>
<summary>🔌 Porty i Dostęp</summary>

### Porty i Dostęp

Po uruchomieniu aplikacji dostępne są następujące porty:

| Serwis     | Port  | URL                          | Opis                          |
|------------|-------|------------------------------|-------------------------------|
| Frontend   | 3000  | http://localhost:3000        | Interfejs użytkownika         |
| Backend    | 3001  | http://localhost:3001        | REST API                      |
| PostgreSQL | 5432  | localhost:5432               | Baza danych                   |

**Dane dostępowe do bazy danych (domyślne):**
- Host: `localhost` (lub `db` wewnątrz sieci Docker)
- Port: `5432`
- Database: `tracker_kasy`
- User: `tracker_user`
- Password: `tracker_password`
</details>

<details>
<summary>💾 Docker Volumes i Dane</summary>

Dane aplikacji są przechowywane w Docker volume `tracker_kasy_pgdata`. Nawet po zatrzymaniu kontenerów (`docker-compose down`), dane pozostają bezpieczne.

**Backup bazy danych:**
```bash
docker-compose exec db pg_dump -U tracker_user tracker_kasy > backup.sql
```

**Restore bazy danych:**
```bash
docker-compose exec -T db psql -U tracker_user tracker_kasy < backup.sql
```
</details>

## 🧪 Rozwój Lokalny

<details>
<summary>⚙️ Setup bez Dockera</summary>

Jeśli chcesz rozwijać aplikację bez Dockera:

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
</details>

<details>
<summary>🧪 Uruchamianie Testów</summary>

```bash
# Backend - Unit Tests
cd backend
npm test                    # All tests
npm test -- --coverage      # With coverage report
npm test -- auth.service    # Specific file

# Backend - E2E Tests
npm run test:e2e

# Backend - Test Results (v1.0)
# ✅ 88 tests passing
# ✅ Coverage: ~27% (focused on business logic)
# ✅ Services: 100% method coverage
```

**Test Suites:**
- `auth.service.spec.ts` - Authentication (11 tests)
- `transactions.service.spec.ts` - Transactions CRUD (21 tests)
- `categories.service.spec.ts` - Categories management (18 tests)
- `budgets.service.spec.ts` - Budgets & progress (21 tests)
- `reports.service.spec.ts` - Reports & analytics (17 tests)
</details>

<details>
<summary>🔒 Bezpieczeństwo</summary>

- 🔐 **JWT Authentication** - Bezpieczne tokeny sesji
- 🛡️ **Password Hashing** - bcrypt z salt rounds
- 🚫 **SQL Injection Protection** - Prisma ORM
- 🔍 **Input Validation** - class-validator DTOs
- 🧹 **XSS Protection** - Next.js auto-escaping
- 📦 **Dependency Audit** - 0 vulnerabilities (npm audit)
- 🎯 **User-scoped queries** - Każdy endpoint weryfikuje userId
</details>

## 🤝 Współpraca

Chcesz pomóc w rozwoju projektu? Świetnie! 

1. Fork'nij repozytorium
2. Utwórz branch z nową funkcjonalnością (`git checkout -b feat/amazing-feature`)
3. Commit'uj zmiany (`git commit -m 'feat: dodanie niesamowitej funkcji'`)
4. Push'nij do branch'a (`git push origin feat/amazing-feature`)
5. Otwórz Pull Request

Więcej informacji w pliku [CONTRIBUTING.md](./CONTRIBUTING.md).

<details>
<summary>📚 Więcej Dokumentacji</summary>

### Zarządzanie Projektem
- 📋 [TODO - Current Sprint](./docs/project/TODO.md) - Aktualny sprint i priorytety
- ✅ [Completed Milestones](./docs/project/COMPLETED.md) - Ostatnie 3 wersje
- 🗺️ [Roadmap](./docs/project/ROADMAP.md) - Długoterminowa wizja (2025-2027)
- 📝 [Changelog](./docs/project/CHANGELOG.md) - Pełna historia zmian

### Dokumentacja Techniczna
- 🛠️ [Tech Stack](./docs/technical/TECH_STACK.md) - Technologie i zależności
- 🏗️ [Architecture](./docs/technical/ARCHITECTURE.md) - Architektura systemu
- 🚀 [Development Guide](./docs/technical/DEVELOPMENT_GUIDE.md) - Setup i workflow
- 🧪 [Testing Strategy](./docs/technical/TESTING_STRATEGY.md) - Wzorce testów i pokrycie
- 📡 [API Reference](./docs/technical/API_REFERENCE.md) - Dokumentacja REST API
</details>

<details>
<summary>📝 Konwencje Commitów</summary>

## 📝 Konwencje Commitów

Projekt używa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - nowa funkcjonalność
- `fix:` - naprawa błędu
- `docs:` - zmiany w dokumentacji
- `test:` - dodanie lub modyfikacja testów
- `refactor:` - refaktoryzacja kodu
- `chore:` - zmiany w toolingu, konfiguracji
</details>

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik [LICENSE](./LICENSE) po szczegóły.

## 🙏 Podziękowania

Projekt wykorzystuje następujące open-source'owe technologie:
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Kontakt

Pytania? Sugestie? Otwórz [Issue](https://github.com/[twoja-nazwa-uzytkownika]/Tracker_kasy/issues)!

---

**Zbudowane z ❤️ dla społeczności open-source**
