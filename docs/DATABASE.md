# 📊 Schemat Bazy Danych - Tracker Kasy

## Przegląd

Aplikacja używa **PostgreSQL** jako bazy danych oraz **Prisma ORM** do zarządzania schematem i migracjami.

## 🗄️ Modele Danych

### 1. **User** (Użytkownik)

Tabela przechowująca informacje o użytkownikach aplikacji.

| Pole        | Typ       | Opis                                      |
|-------------|-----------|-------------------------------------------|
| `id`        | String    | UUID - unikalny identyfikator (PK)        |
| `email`     | String    | Adres email (unique, wymagany)            |
| `password`  | String    | Hash hasła (bcrypt)                       |
| `name`      | String?   | Imię i nazwisko (opcjonalne)              |
| `createdAt` | DateTime  | Data utworzenia konta                     |
| `updatedAt` | DateTime  | Data ostatniej aktualizacji               |

**Relacje:**
- Użytkownik może mieć wiele transakcji (`transactions`)
- Użytkownik może mieć wiele kategorii (`categories`)
- Użytkownik może mieć wiele budżetów (`budgets`)

**Constraints:**
- `email` - unikalny w całej tabeli
- Wszystkie powiązane dane są usuwane przy usunięciu użytkownika (`CASCADE`)

---

### 2. **Category** (Kategoria)

Kategorie służą do klasyfikowania transakcji (np. "Jedzenie", "Transport", "Wynagrodzenie").

| Pole        | Typ           | Opis                                          |
|-------------|---------------|-----------------------------------------------|
| `id`        | String        | UUID - unikalny identyfikator (PK)            |
| `name`      | String        | Nazwa kategorii                               |
| `type`      | CategoryType  | Typ: `INCOME` lub `EXPENSE` (domyślnie EXPENSE) |
| `color`     | String?       | Kolor hex dla UI (np. "#3B82F6")             |
| `icon`      | String?       | Nazwa ikony lub emoji (np. "🍔")             |
| `userId`    | String        | ID użytkownika (FK → User)                    |
| `createdAt` | DateTime      | Data utworzenia                               |
| `updatedAt` | DateTime      | Data ostatniej aktualizacji                   |

**Enums:**
```prisma
enum CategoryType {
  INCOME   // Przychód
  EXPENSE  // Wydatek
}
```

**Relacje:**
- Kategoria należy do jednego użytkownika (`user`)
- Kategoria może mieć wiele transakcji (`transactions`)
- Kategoria może mieć wiele budżetów (`budgets`)

**Constraints:**
- `(userId, name, type)` - unique constraint (użytkownik nie może mieć dwóch kategorii o tej samej nazwie i typie)
- Usunięcie użytkownika usuwa wszystkie jego kategorie (`CASCADE`)
- Nie można usunąć kategorii jeśli istnieją powiązane transakcje (`RESTRICT`)

---

### 3. **Transaction** (Transakcja)

Pojedyncza transakcja finansowa (przychód lub wydatek).

| Pole          | Typ              | Opis                                          |
|---------------|------------------|-----------------------------------------------|
| `id`          | String           | UUID - unikalny identyfikator (PK)            |
| `amount`      | Decimal(12,2)    | Kwota transakcji (12 cyfr, 2 po przecinku)    |
| `description` | String?          | Opis transakcji (opcjonalny)                  |
| `date`        | DateTime         | Data transakcji (domyślnie: teraz)            |
| `type`        | TransactionType  | Typ: `INCOME` lub `EXPENSE`                   |
| `userId`      | String           | ID użytkownika (FK → User)                    |
| `categoryId`  | String           | ID kategorii (FK → Category)                  |
| `createdAt`   | DateTime         | Data utworzenia rekordu                       |
| `updatedAt`   | DateTime         | Data ostatniej aktualizacji                   |

**Enums:**
```prisma
enum TransactionType {
  INCOME   // Przychód
  EXPENSE  // Wydatek
}
```

**Relacje:**
- Transakcja należy do jednego użytkownika (`user`)
- Transakcja należy do jednej kategorii (`category`)

**Indeksy:**
- `(userId, date DESC)` - szybkie zapytania o transakcje użytkownika posortowane po dacie
- `(categoryId)` - szybkie zapytania o transakcje w danej kategorii

**Constraints:**
- Usunięcie użytkownika usuwa wszystkie jego transakcje (`CASCADE`)
- Nie można usunąć kategorii jeśli istnieją powiązane transakcje (`RESTRICT`)

---

### 4. **Budget** (Budżet)

Budżet określa limit wydatków dla danej kategorii w określonym okresie.

| Pole         | Typ           | Opis                                          |
|--------------|---------------|-----------------------------------------------|
| `id`         | String        | UUID - unikalny identyfikator (PK)            |
| `amount`     | Decimal(12,2) | Kwota limitu budżetu                          |
| `period`     | BudgetPeriod  | Okres: DAILY, WEEKLY, MONTHLY, YEARLY, CUSTOM |
| `startDate`  | DateTime      | Data rozpoczęcia okresu                       |
| `endDate`    | DateTime      | Data zakończenia okresu                       |
| `userId`     | String        | ID użytkownika (FK → User)                    |
| `categoryId` | String        | ID kategorii (FK → Category)                  |
| `createdAt`  | DateTime      | Data utworzenia                               |
| `updatedAt`  | DateTime      | Data ostatniej aktualizacji                   |

**Enums:**
```prisma
enum BudgetPeriod {
  DAILY    // Dzienny
  WEEKLY   // Tygodniowy
  MONTHLY  // Miesięczny (domyślny)
  YEARLY   // Roczny
  CUSTOM   // Niestandardowy
}
```

**Relacje:**
- Budżet należy do jednego użytkownika (`user`)
- Budżet dotyczy jednej kategorii (`category`)

**Indeksy:**
- `(userId, startDate)` - szybkie zapytania o budżety użytkownika w danym okresie

**Constraints:**
- `(userId, categoryId, startDate)` - unique constraint (jeden budżet na kategorię w danym okresie)
- Usunięcie użytkownika usuwa wszystkie jego budżety (`CASCADE`)
- Nie można usunąć kategorii jeśli istnieją powiązane budżety (`RESTRICT`)

---

## 🔗 Diagram Relacji

```
┌─────────────┐
│    User     │
│  (users)    │
└──────┬──────┘
       │
       │ 1:N (CASCADE)
       │
   ┌───┴────────────────────────┬─────────────────────┐
   │                            │                     │
   ▼                            ▼                     ▼
┌──────────────┐         ┌──────────────┐      ┌──────────────┐
│  Category    │◄────────│ Transaction  │      │   Budget     │
│(categories)  │ N:1     │(transactions)│      │  (budgets)   │
└──────────────┘(RESTRICT)└──────────────┘      └──────────────┘
       ▲                                               ▲
       │ N:1 (RESTRICT)                               │ N:1 (RESTRICT)
       └──────────────────────────────────────────────┘
```

**Legenda:**
- `1:N` - relacja jeden-do-wielu
- `CASCADE` - usunięcie rodzica usuwa dzieci
- `RESTRICT` - nie można usunąć rodzica jeśli istnieją dzieci

---

## 🛠️ Migracje

### Pierwsza migracja: `20251002173625_init`

Tworzy kompletny schemat bazy danych:
- 4 tabele: `users`, `categories`, `transactions`, `budgets`
- 3 typy enum: `CategoryType`, `TransactionType`, `BudgetPeriod`
- Wszystkie indeksy i constraints
- Klucze obce z odpowiednimi strategiami `ON DELETE`

### Uruchamianie migracji

**W kontenerze Docker (produkcja):**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**Lokalnie (development):**
```bash
cd backend
npx prisma migrate dev
```

---

## 🌱 Dane Testowe (Seed) - Opcjonalne

> **Note:** Seed files are not included in the repository (development only).  
> You can create your own `backend/prisma/seed.ts` locally for testing purposes.

### Example Seed Structure

If you want to create test data locally, create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  // Create categories
  await prisma.category.create({
    data: {
      userId: user.id,
      name: 'Jedzenie',
      type: 'EXPENSE',
      icon: 'UtensilsCrossed',
      color: '#ef4444',
    },
  });

  // Add more seed data as needed...
  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Running Seed (if created locally)

**Locally:**
```bash
cd backend
DATABASE_URL="postgresql://tracker_user:tracker_password@localhost:5432/tracker_kasy?schema=public" npx prisma db seed
```

**In Docker container:**
```bash
docker-compose exec backend npx prisma db seed
```

---

## 📝 Najlepsze Praktyki

1. **UUID jako Primary Key** - lepsze niż auto-increment dla distributed systems
2. **Decimal dla kwot** - unikamy problemów z zaokrągleniem float/double
3. **Indeksy na często używanych zapytaniach** - `(userId, date DESC)` dla listy transakcji
4. **Soft delete?** - Nie. Trzymamy się prostoty (KISS). Jeśli będzie potrzeba, dodamy później.
5. **Timestamps** - Każda tabela ma `createdAt` i `updatedAt`
6. **Cascade vs Restrict:**
   - `CASCADE` na User → usunięcie konta czyści wszystkie dane
   - `RESTRICT` na Category → nie można usunąć kategorii z transakcjami/budżetami

---

## 🔍 Przykładowe Zapytania

### Wszystkie transakcje użytkownika w danym miesiącu:
```typescript
const transactions = await prisma.transaction.findMany({
  where: {
    userId: userId,
    date: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  include: {
    category: true,
  },
  orderBy: {
    date: 'desc',
  },
});
```

### Suma wydatków per kategoria:
```typescript
const expenses = await prisma.transaction.groupBy({
  by: ['categoryId'],
  where: {
    userId: userId,
    type: 'EXPENSE',
  },
  _sum: {
    amount: true,
  },
});
```

### Sprawdzenie wykorzystania budżetu:
```typescript
const budget = await prisma.budget.findFirst({
  where: {
    userId: userId,
    categoryId: categoryId,
    startDate: { lte: new Date() },
    endDate: { gte: new Date() },
  },
});

const spent = await prisma.transaction.aggregate({
  where: {
    userId: userId,
    categoryId: categoryId,
    type: 'EXPENSE',
    date: {
      gte: budget.startDate,
      lte: budget.endDate,
    },
  },
  _sum: {
    amount: true,
  },
});

const remaining = budget.amount - (spent._sum.amount || 0);
```

---

## 🚀 Następne Kroki

Po zakończeniu Fazy 2.1, następne będą:
- **Faza 3:** System uwierzytelniania (Auth)
- **Faza 4:** CRUD dla kategorii
- **Faza 5:** CRUD dla transakcji
- **Faza 6:** CRUD dla budżetów
- **Faza 7:** Dashboard i statystyki

---

**Ostatnia aktualizacja:** 2 października 2025  
**Status:** Faza 2.1 zakończona ✅
