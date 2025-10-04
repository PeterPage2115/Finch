# Backend - Tracker Kasy

API backend zbudowane z NestJS i Prisma ORM.

## 🚀 Szybki Start

### Lokalne Uruchomienie (bez Dockera)

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Skonfiguruj zmienne środowiskowe:**
   ```bash
   cp .env.example .env
   # Edytuj .env i ustaw DATABASE_URL na lokalną bazę PostgreSQL
   ```

3. **Uruchom migracje bazy danych:**
   ```bash
   npx prisma migrate dev
   ```

4. **Wygeneruj Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Uruchom aplikację:**
   ```bash
   npm run start:dev
   ```

Backend będzie dostępny pod adresem: `http://localhost:3001`

## 📁 Struktura Projektu

```
src/
├── auth/           # Moduł uwierzytelniania (JWT, Passport)
├── users/          # Zarządzanie użytkownikami
├── transactions/   # Transakcje finansowe
├── categories/     # Kategorie wydatków/przychodów
├── budgets/        # Zarządzanie budżetami
├── app.module.ts   # Główny moduł aplikacji
├── main.ts         # Entry point
└── prisma.service.ts # Serwis Prisma Client

prisma/
├── schema.prisma   # Schemat bazy danych
└── migrations/     # Migracje bazy danych
```

## 🧪 Testowanie

```bash
# Testy jednostkowe
npm run test

# Testy e2e
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Komendy Prisma

```bash
# Utworzenie nowej migracji
npx prisma migrate dev --name nazwa_migracji

# Reset bazy danych (UWAGA: usuwa wszystkie dane)
npx prisma migrate reset

# Prisma Studio (GUI do przeglądania bazy)
npx prisma studio
```

## 📝 Zmienne Środowiskowe

Zobacz `.env.example` dla pełnej listy wymaganych zmiennych.

## 🐳 Docker

Backend jest automatycznie budowany jako część `docker-compose.yml` w głównym katalogu projektu.
