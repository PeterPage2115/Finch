# 🏗️ Architecture Overview

> **System design, component structure, and data flow patterns**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                    Next.js 15 (port 3000)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages      │  │  Components  │  │   Stores     │       │
│  │  (App Router)│──│  (React 19)  │──│  (Zustand)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                      ┌─────▼─────┐                          │
│                      │ API Client│                          │
│                      │  (Axios)  │                          │
│                      └─────┬─────┘                          │
└────────────────────────────┼──────────────────────────────-─┘
                             │ HTTP/REST
                             │ (JWT in headers)
┌────────────────────────────▼───────────────────────────────┐
│                         BACKEND                             │
│                    NestJS (port 3001)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Controllers  │──│   Services   │──│  Prisma ORM  │    │
│  │ (REST API)   │  │  (Business)  │  │  (Database)  │    │
│  └──────────────┘  └──────────────┘  └──────┬───────┘    │
│         │                                     │            │
│         │ Guards (JWT)                        │            │
│         ▼                                     │            │
│  ┌──────────────┐                            │            │
│  │ Auth Module  │                            │            │
│  │(Passport JWT)│                            │            │
│  └──────────────┘                            │            │
└────────────────────────────────────────────┬─┘            │
                                             │               │
┌────────────────────────────────────────────▼───────────────┐
│                       DATABASE                              │
│                 PostgreSQL 17 (port 5432)                   │
├─────────────────────────────────────────────────────────────┤
│  Tables: User, Transaction, Category, Budget               │
│  Relations: One-to-Many (User → Transactions)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure (Feature-Based)

```
frontend/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard page
│   ├── login/               # Authentication pages
│   ├── register/
│   ├── transactions/        # Transactions CRUD
│   ├── categories/          # Categories management
│   ├── budgets/             # Budgets tracking
│   ├── reports/             # Financial reports
│   └── api/                 # API route handlers (proxy to backend)
│
├── components/              # Reusable React components
│   ├── transactions/        # TransactionForm, TransactionList
│   ├── categories/          # CategoryForm, CategoryIcon, IconPicker
│   ├── budgets/             # BudgetForm, BudgetCard, ProgressBar
│   ├── reports/             # ReportCharts, ReportSummary
│   ├── layout/              # Navbar, Sidebar, Footer
│   └── ui/                  # Button, Input, Modal (base components)
│
├── lib/                     # Utilities and configurations
│   ├── api/                 # Axios client, API functions
│   ├── stores/              # Zustand state management
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   └── iconMap.ts           # Centralized icon mapping
│
└── types/                   # TypeScript type definitions
    ├── index.ts             # Shared types
    ├── transaction.ts
    ├── category.ts
    └── budget.ts
```

### State Management (Zustand)

**Store Pattern:**
```typescript
// Example: transactionStore
interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: CreateTransactionDto) => Promise<void>;
  updateTransaction: (id: number, data: UpdateTransactionDto) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}
```

**Stores:**
- `authStore` - User session, login/logout
- `transactionStore` - Transactions CRUD + filtering
- `categoryStore` - Categories CRUD + type filtering
- `budgetStore` - Budgets CRUD + progress calculation
- `notificationStore` - Aria-live notifications (accessibility)

### Data Flow (Frontend)

```
User Interaction → Component → Zustand Store Action → API Client (Axios)
                                       ↓
                              Backend API (JWT auth)
                                       ↓
                              Response / Error
                                       ↓
                              Store Update (setState)
                                       ↓
                              Component Re-render
```

---

## Backend Architecture

### Directory Structure (Module-Based)

```
backend/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── prisma.service.ts    # Prisma client singleton
│   │
│   ├── auth/                # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts  # JWT generation, validation
│   │   ├── auth.controller.ts
│   │   ├── strategies/      # Passport strategies
│   │   ├── guards/          # JWT guard, local guard
│   │   └── dto/             # Login, Register DTOs
│   │
│   ├── transactions/        # Transactions module
│   │   ├── transactions.module.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.controller.ts
│   │   └── dto/             # Create, Update DTOs
│   │
│   ├── categories/          # Categories module
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   ├── categories.controller.ts
│   │   └── dto/
│   │
│   ├── budgets/             # Budgets module
│   │   ├── budgets.module.ts
│   │   ├── budgets.service.ts
│   │   ├── budgets.controller.ts
│   │   └── dto/
│   │
│   └── reports/             # Reports module (future)
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
│
└── test/
    ├── app.e2e-spec.ts      # End-to-end tests
    └── jest-e2e.json        # E2E test configuration
```

### Module Pattern (NestJS)

**Typical Module Structure:**
```typescript
@Module({
  imports: [PrismaModule],      // Shared dependencies
  controllers: [XController],    // HTTP endpoints
  providers: [XService],         // Business logic
  exports: [XService],           // Export for other modules
})
export class XModule {}
```

### Authentication Flow (Current: Mock JWT)

```
1. User submits login (email + password)
2. AuthService validates (currently: test@test.pl bypasses validation)
3. Generate JWT token (payload: userId, email)
4. Return token to frontend
5. Frontend stores token in Zustand authStore
6. Subsequent requests include token in Authorization header
7. JwtAuthGuard validates token via Passport JWT strategy
8. Request.user populated with decoded payload
```

**⚠️ Note:** v0.8.0 will replace mock with bcrypt password hashing and real validation.

---

## Database Schema (Prisma)

### Entity Relationships

```
User (1) ──────< (N) Transaction
  │
  └──────< (N) Category
  │
  └──────< (N) Budget
  
Category (1) ──< (N) Transaction
           └──< (N) Budget

Budget (1) ─────< (N) Transaction (via categoryId)
```

### Key Models

**User:**
- `id` (primary key)
- `email` (unique)
- `password` (hashed, currently plaintext mock)
- `name`
- `createdAt`, `updatedAt`

**Transaction:**
- `id` (primary key)
- `userId` (foreign key → User)
- `categoryId` (foreign key → Category, nullable)
- `amount` (Decimal)
- `type` (INCOME | EXPENSE)
- `description`
- `date`
- `createdAt`, `updatedAt`

**Category:**
- `id` (primary key)
- `userId` (foreign key → User)
- `name`
- `type` (INCOME | EXPENSE)
- `icon` (Lucide icon name, e.g., "ShoppingCart")
- `createdAt`, `updatedAt`

**Budget:**
- `id` (primary key)
- `userId` (foreign key → User)
- `categoryId` (foreign key → Category)
- `amount` (Decimal, budget limit)
- `period` (MONTHLY | YEARLY)
- `startDate`, `endDate`
- `createdAt`, `updatedAt`
- Unique constraint: `userId + categoryId + startDate`

---

## API Design

### RESTful Endpoints

**Authentication:**
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user (v0.8.0)

**Transactions:**
- `GET /api/transactions` - List all (with filtering)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

**Categories:**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Budgets:**
- `GET /api/budgets` - List all budgets (with progress calculation)
- `POST /api/budgets` - Create budget
- `PATCH /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

**Reports:**
- `GET /api/reports/summary` - Monthly/yearly summaries
- `GET /api/reports/by-category` - Category breakdowns

### Request/Response Format

**Standard Success Response:**
```json
{
  "id": 1,
  "amount": 150.50,
  "type": "EXPENSE",
  "description": "Groceries",
  "date": "2025-10-07T00:00:00Z",
  "categoryId": 5,
  "category": {
    "id": 5,
    "name": "Food",
    "icon": "ShoppingCart"
  }
}
```

**Standard Error Response:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## Design Patterns

### Frontend Patterns
- **Component Composition:** Reusable UI components (Button, Input, Modal)
- **Custom Hooks:** `useAuth()`, `useTransactions()`, `useCategories()`
- **Render Props:** Modal with children for flexible content
- **State Lifting:** Parent components manage shared state

### Backend Patterns
- **Dependency Injection:** NestJS IoC container
- **Repository Pattern:** PrismaService abstracts database access
- **DTO Pattern:** class-validator for input validation
- **Guard Pattern:** JwtAuthGuard protects routes

---

## Security Considerations

**Current (v0.7.0):**
- JWT tokens for stateless authentication
- CORS enabled for frontend origin only
- Input validation with class-validator
- SQL injection prevention (Prisma parameterized queries)

**Future (v0.8.0+):**
- Bcrypt password hashing (10 rounds)
- Rate limiting (DDoS protection)
- Helmet.js (HTTP security headers)
- CSRF tokens for state-changing operations
- Refresh token rotation

---

## Performance Optimizations

**Frontend:**
- Next.js Server Components (reduce client-side JS)
- Code splitting (dynamic imports)
- Image optimization (next/image)
- Zustand (minimal re-renders)

**Backend:**
- Prisma query optimization (select specific fields)
- Database indexing (userId, categoryId foreign keys)
- Connection pooling (PostgreSQL)

**Future:**
- Redis caching (frequent queries)
- CDN for static assets
- Database read replicas

---

**Last Updated:** October 7, 2025  
**Version:** v0.7.0
