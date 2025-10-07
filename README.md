# 💰 Tracker Kasy - Aplikacja do Śledzenia Finansów

**Otwartoźródłowa aplikacja webowa do zarządzania finansami osobistymi**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 O Projekcie

Tracker Kasy to nowoczesna aplikacja webowa zaprojektowana z myślą o prostocie i łatwości samodzielnego hostowania. Umożliwia śledzenie przychodów, wydatków, kategoryzowanie transakcji, ustalanie budżetów i generowanie raportów finansowych.

### ✨ Kluczowe Cechy

- 🔒 **Prywatność** - Twoje dane pozostają u Ciebie (self-hosted)
- 🐳 **Łatwe wdrożenie** - Jedna komenda: `docker-compose up`
- 📊 **Intuicyjny interfejs** - Przejrzysty dashboard z wykresami
- 💼 **Zarządzanie budżetami** - Ustaw limity i monitoruj wydatki
- 📈 **Raporty** - Analizuj swoje finanse w czasie

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

### Zatrzymanie aplikacji

```bash
# Zatrzymanie kontenerów (dane pozostają)
docker-compose stop

# Zatrzymanie i usunięcie kontenerów (dane pozostają w wolumenie)
docker-compose down

# UWAGA: To usunie WSZYSTKIE dane!
docker-compose down -v
```

### Logi i Debugowanie

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

### Aktualizacja

```bash
# Pobierz najnowsze zmiany
git pull

# Przebuduj i uruchom ponownie
docker-compose up -d --build
```

## 🏗️ Architektura

### Komponenty Systemu

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

### Struktura Projektu

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

## 📚 Dokumentacja

Szczegółowa dokumentacja dostępna w folderze [`docs/`](./docs/):

- [**API Reference**](./docs/API.md) - Kompletna dokumentacja endpointów REST API (Auth, Users, Transactions, etc.)
- [**Schemat Bazy Danych**](./docs/DATABASE.md) - Modele, relacje, migracje, przykładowe zapytania
- [**Docker & Orkiestracja**](./docs/DOCKER.md) - Szczegółowy przewodnik po konfiguracji Docker
- [Architektura aplikacji](./docs/architecture.md) *(wkrótce)*
- [Przewodnik developera](./docs/developer-guide.md) *(wkrótce)*

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

### Docker Volumes i Dane

Dane aplikacji są przechowywane w Docker volume `tracker_kasy_pgdata`. Nawet po zatrzymaniu kontenerów (`docker-compose down`), dane pozostają bezpieczne.

**Backup bazy danych:**
```bash
docker-compose exec db pg_dump -U tracker_user tracker_kasy > backup.sql
```

**Restore bazy danych:**
```bash
docker-compose exec -T db psql -U tracker_user tracker_kasy < backup.sql
```

## 🧪 Rozwój Lokalny

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

### Uruchamianie Testów

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 🤝 Współpraca

Chcesz pomóc w rozwoju projektu? Świetnie! 

1. Fork'nij repozytorium
2. Utwórz branch z nową funkcjonalnością (`git checkout -b feat/amazing-feature`)
3. Commit'uj zmiany (`git commit -m 'feat: dodanie niesamowitej funkcji'`)
4. Push'nij do branch'a (`git push origin feat/amazing-feature`)
5. Otwórz Pull Request

Więcej informacji w pliku [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📚 Dokumentacja

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

## 📝 Konwencje Commitów

Projekt używa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - nowa funkcjonalność
- `fix:` - naprawa błędu
- `docs:` - zmiany w dokumentacji
- `test:` - dodanie lub modyfikacja testów
- `refactor:` - refaktoryzacja kodu
- `chore:` - zmiany w toolingu, konfiguracji

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
