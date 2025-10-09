# 📊 Database Schema - Finance Tracker

## Overview

The application uses **PostgreSQL** as the database engine and **Prisma ORM** to manage the schema and migrations.

## 🗄️ Data Models

### 1. **User**

Stores information about every user account in the system.

| Field       | Type      | Description                                  |
|-------------|-----------|----------------------------------------------|
| `id`        | String    | UUID – unique identifier (PK)                |
| `email`     | String    | Email address (unique, required)             |
| `password`  | String    | Password hash (bcrypt)                       |
| `name`      | String?   | Display name (optional)                      |
| `createdAt` | DateTime  | Account creation timestamp                   |
| `updatedAt` | DateTime  | Last update timestamp                        |

**Relationships:**
- One user has many transactions (`transactions`)
- One user has many categories (`categories`)
- One user has many budgets (`budgets`)

**Constraints:**
- `email` must be unique across the table
- Deleting a user cascades to all related entities (`CASCADE`)

---

### 2. **Category**

Categories classify transactions (for example: "Food", "Transport", "Salary").

| Field        | Type          | Description                                      |
|--------------|---------------|--------------------------------------------------|
| `id`         | String        | UUID – unique identifier (PK)                    |
| `name`       | String        | Category name                                    |
| `type`       | CategoryType  | `INCOME` or `EXPENSE` (defaults to `EXPENSE`)    |
| `color`      | String?       | Hex color for the UI (e.g., `#3B82F6`)           |
| `icon`       | String?       | Icon or emoji name (e.g., `"🍔"`)              |
| `userId`     | String        | User ID (FK → User)                              |
| `createdAt`  | DateTime      | Creation timestamp                               |
| `updatedAt`  | DateTime      | Last update timestamp                            |

**Enums:**
```prisma
enum CategoryType {
  INCOME   // Income
  EXPENSE  // Expense
}
```

**Relationships:**
- Each category belongs to a single user (`user`)
- A category can have many transactions (`transactions`)
- A category can have many budgets (`budgets`)

**Constraints:**
- `(userId, name, type)` must be unique (a user cannot duplicate a category with the same name and type)
- Deleting a user cascades to the user's categories (`CASCADE`)
- A category cannot be deleted while related transactions exist (`RESTRICT`)

---

### 3. **Transaction**

Represents a single financial transaction (income or expense).

| Field          | Type             | Description                                          |
|----------------|------------------|------------------------------------------------------|
| `id`           | String           | UUID – unique identifier (PK)                        |
| `amount`       | Decimal(12,2)    | Transaction amount                                   |
| `description`  | String?          | Optional description                                 |
| `date`         | DateTime         | Transaction date (defaults to now)                   |
| `type`         | TransactionType  | `INCOME` or `EXPENSE`                                |
| `userId`       | String           | User ID (FK → User)                                  |
| `categoryId`   | String           | Category ID (FK → Category)                          |
| `createdAt`    | DateTime         | Creation timestamp                                   |
| `updatedAt`    | DateTime         | Last update timestamp                                |

**Enums:**
```prisma
enum TransactionType {
  INCOME   // Income
  EXPENSE  // Expense
}
```

**Relationships:**
- Every transaction belongs to exactly one user (`user`)
- Every transaction belongs to exactly one category (`category`)

**Indexes:**
- `(userId, date DESC)` – fast queries for user transactions sorted by date
- `(categoryId)` – fast queries for transactions per category

**Constraints:**
- Deleting a user cascades to the user's transactions (`CASCADE`)
- A category cannot be deleted while related transactions exist (`RESTRICT`)

---

### 4. **Budget**

Defines a spending limit for a given category within a specific period.

| Field         | Type           | Description                                      |
|---------------|----------------|--------------------------------------------------|
| `id`          | String         | UUID – unique identifier (PK)                    |
| `amount`      | Decimal(12,2)  | Budget limit                                     |
| `period`      | BudgetPeriod   | DAILY, WEEKLY, MONTHLY, YEARLY, or CUSTOM        |
| `startDate`   | DateTime       | Period start date                                |
| `endDate`     | DateTime       | Period end date                                  |
| `userId`      | String         | User ID (FK → User)                              |
| `categoryId`  | String         | Category ID (FK → Category)                      |
| `createdAt`   | DateTime       | Creation timestamp                               |
| `updatedAt`   | DateTime       | Last update timestamp                            |

**Enums:**
```prisma
enum BudgetPeriod {
  DAILY    // Daily
  WEEKLY   // Weekly
  MONTHLY  // Monthly (default)
  YEARLY   // Yearly
  CUSTOM   // Custom
}
```

**Relationships:**
- Each budget belongs to one user (`user`)
- Each budget targets one category (`category`)

**Indexes:**
- `(userId, startDate)` – optimized queries for budgets per user and period

**Constraints:**
- `(userId, categoryId, startDate)` must be unique (no duplicate budgets for a category in the same period)
- Deleting a user cascades to the user's budgets (`CASCADE`)
- A category cannot be deleted while related budgets exist (`RESTRICT`)

---

## 🔗 Relationship Diagram

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

**Legend:**
- `1:N` – one-to-many relationship
- `CASCADE` – deleting a parent removes its children
- `RESTRICT` – a parent cannot be removed while children exist

---

## 🛠️ Migrations

### Initial migration: `20251002173625_init`

Creates the entire database schema:
- 4 tables: `users`, `categories`, `transactions`, `budgets`
- 3 enum types: `CategoryType`, `TransactionType`, `BudgetPeriod`
- All indexes and constraints
- Foreign keys with appropriate `ON DELETE` strategies

### Running migrations

**In Docker (production-like):**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**Locally (development):**
```bash
cd backend
npx prisma migrate dev
```

---

## 🌱 Sample Data (Optional Seed)

> **Note:** Seed files are not committed to the repository (development only).
> Create your own `backend/prisma/seed.ts` locally if you want test data.

### Example seed structure

If you want to seed data locally, create `backend/prisma/seed.ts`:

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
      name: 'Food',
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

### Running the seed (if created locally)

**Locally:**
```bash
cd backend
DATABASE_URL="postgresql://tracker_user:tracker_password@localhost:5432/finance_tracker?schema=public" npx prisma db seed
```

**In Docker:**
```bash
docker-compose exec backend npx prisma db seed
```

---

## 📝 Best Practices

1. **UUID as the primary key** – better than auto-increment for distributed systems
2. **Decimals for monetary values** – avoid floating-point rounding errors
3. **Indexes on common queries** – `(userId, date DESC)` for recent transactions
4. **No soft delete** – we keep the schema simple (KISS). Add it later if needed.
5. **Timestamps everywhere** – every table has `createdAt` and `updatedAt`
6. **Cascade vs Restrict:**
   - `CASCADE` on User → removing an account wipes related data
   - `RESTRICT` on Category → cannot remove a category with transactions/budgets

---

## 🔍 Example Queries

### All transactions for a user in a given month
```typescript
const transactions = await prisma.transaction.findMany({
  where: {
    userId,
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

### Total expenses per category
```typescript
const expenses = await prisma.transaction.groupBy({
  by: ['categoryId'],
  where: {
    userId,
    type: 'EXPENSE',
  },
  _sum: {
    amount: true,
  },
});
```

### Budget usage calculation
```typescript
const budget = await prisma.budget.findFirst({
  where: {
    userId,
    categoryId,
    startDate: { lte: new Date() },
    endDate: { gte: new Date() },
  },
});

const spent = await prisma.transaction.aggregate({
  where: {
    userId,
    categoryId,
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

## 🚀 Next Steps

After completing Phase 2.1, the roadmap continues with:
- **Phase 3:** Authentication system
- **Phase 4:** Category CRUD
- **Phase 5:** Transaction CRUD
- **Phase 6:** Budget CRUD
- **Phase 7:** Dashboard and analytics

---

**Last updated:** October 2, 2025  
**Status:** Phase 2.1 completed ✅
