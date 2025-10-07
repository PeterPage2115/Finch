# 🧪 Testing Strategy

> **Testing approach, coverage targets, patterns, and CI/CD guidelines**

---

## Testing Philosophy

**Principles:**
1. **"Done" means "Tested"** - No feature is complete without tests
2. **Test Behavior, Not Implementation** - Focus on user interactions and outcomes
3. **Pragmatic Coverage** - 70%+ is the goal, 100% is not required for simple getters/setters
4. **Fast Feedback** - Tests should run in seconds, not minutes

---

## Coverage Targets

### Current Status (v0.7.0)

**Backend:**
- **84 tests passing** (Jest)
- **Coverage:** ~40% overall
- **Covered Modules:** AuthService, BudgetsService
- **Pending:** TransactionsService, CategoriesService, ReportsService

**Frontend:**
- **91 tests passing** (Vitest)
- **Coverage:** ~11% overall, **100% for tested components**
- **Covered Components:**
  - TransactionForm: 98.87% (26 tests)
  - CategoryIcon: 100%
  - IconPicker: 100%
  - ProgressBar: 100%
  - BudgetCard: 100%
- **Pending:** TransactionList, CategoryForm, BudgetForm, Dashboard pages

### Target Coverage (v1.0)

- **Backend:** 70%+ statement coverage
- **Frontend:** 70%+ component coverage
- **Critical Paths:** 90%+ (auth, transactions, budgets)

---

## Testing Stack

### Frontend Testing

**Framework:**
- **Vitest** `3.2.4` - Fast unit test runner (Vite-based)
- **@testing-library/react** `16.1.0` - Component testing utilities
- **@testing-library/jest-dom** `6.6.3` - Custom matchers (toBeInTheDocument, etc.)
- **jsdom** `25.0.1` - DOM simulation for Node.js

**Configuration:** `frontend/vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
```

### Backend Testing

**Framework:**
- **Jest** `30.0.0` - JavaScript testing framework
- **@nestjs/testing** - NestJS test utilities (Test.createTestingModule)
- **supertest** - HTTP assertions for E2E tests

**Configuration:** `backend/jest.config.js`

---

## Testing Patterns

### Frontend Patterns

#### 1. Component Testing (AAA Pattern)

**Arrange-Act-Assert:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';

describe('TransactionForm', () => {
  it('should submit form with valid data', async () => {
    // Arrange
    const mockOnSubmit = vi.fn();
    render(<TransactionForm onSubmit={mockOnSubmit} />);
    
    // Act
    fireEvent.change(screen.getByLabelText(/kwota/i), { 
      target: { value: '100.50' } 
    });
    fireEvent.change(screen.getByLabelText(/kategoria/i), { 
      target: { value: '1' } 
    });
    fireEvent.submit(screen.getByRole('form'));
    
    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 100.50,
        categoryId: 1,
        type: 'EXPENSE',
      });
    });
  });
});
```

#### 2. Mocking Zustand Stores

**Mock Factory Pattern:**
```typescript
// tests/mocks/stores.ts
export const mockTransactionStore = {
  transactions: [],
  isLoading: false,
  error: null,
  fetchTransactions: vi.fn(),
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
};

// In test file
vi.mock('@/lib/stores/transactionStore', () => ({
  useTransactionStore: vi.fn(() => mockTransactionStore),
}));
```

**Reset Between Tests:**
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  mockTransactionStore.transactions = [];
  mockTransactionStore.isLoading = false;
});
```

#### 3. HTML5 Form Validation Workaround (jsdom)

**Problem:** jsdom enforces `required` attributes, blocking form submission in tests.

**Solution:** Use `fireEvent.submit(form)` instead of `fireEvent.click(button)`:

```typescript
// ❌ Wrong - HTML5 validation blocks
fireEvent.click(screen.getByRole('button', { name: /dodaj/i }));

// ✅ Correct - Bypasses HTML5 validation
const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
fireEvent.submit(form);
```

#### 4. Async Assertions with waitFor

```typescript
it('should display error message on failed submission', async () => {
  const mockAddTransaction = vi.fn().mockRejectedValue(new Error('Network error'));
  
  render(<TransactionForm />);
  fireEvent.submit(form);
  
  // Wait for async state update
  await waitFor(() => {
    expect(screen.getByText(/błąd/i)).toBeInTheDocument();
  });
});
```

---

### Backend Patterns

#### 1. Service Unit Tests

**Mock PrismaService:**
```typescript
describe('BudgetsService', () => {
  let service: BudgetsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: PrismaService,
          useValue: {
            budget: {
              findMany: vi.fn(),
              create: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate budget progress correctly', async () => {
    const mockBudget = { amount: 1000, spent: 750 };
    vi.spyOn(prisma.budget, 'findUnique').mockResolvedValue(mockBudget);

    const result = await service.calculateProgress(1);
    expect(result.percentage).toBe(75);
    expect(result.status).toBe('warning'); // 80% threshold
  });
});
```

#### 2. Controller Tests (Integration)

```typescript
describe('TransactionsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/transactions - success', () => {
    return request(app.getHttpServer())
      .get('/api/transactions')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

#### 3. E2E Tests (End-to-End)

```typescript
describe('Authentication Flow (e2e)', () => {
  it('should register, login, and access protected route', async () => {
    // 1. Register
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'new@user.com', password: 'secure123', name: 'New User' })
      .expect(201);

    // 2. Login
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'new@user.com', password: 'secure123' })
      .expect(200);

    const token = loginRes.body.access_token;

    // 3. Access Protected Route
    return request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe('new@user.com');
      });
  });
});
```

---

## Test Organization

### Frontend Structure

```
frontend/
├── tests/
│   ├── components/
│   │   ├── transactions/
│   │   │   ├── TransactionForm.test.tsx
│   │   │   └── TransactionList.test.tsx
│   │   ├── categories/
│   │   │   ├── CategoryIcon.test.tsx
│   │   │   └── IconPicker.test.tsx
│   │   └── budgets/
│   │       ├── BudgetCard.test.tsx
│   │       └── ProgressBar.test.tsx
│   ├── mocks/
│   │   ├── stores.ts          # Mock Zustand stores
│   │   └── factories.ts       # Test data factories
│   └── setup.ts               # Global test setup
└── vitest.config.ts
```

### Backend Structure

```
backend/
├── src/
│   ├── auth/
│   │   └── auth.service.spec.ts
│   ├── transactions/
│   │   └── transactions.service.spec.ts
│   └── budgets/
│       └── budgets.service.spec.ts
└── test/
    ├── app.e2e-spec.ts        # End-to-end tests
    ├── auth.e2e-spec.ts
    └── jest-e2e.json
```

---

## Running Tests

### Frontend

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npx vitest run tests/components/transactions/TransactionForm.test.tsx
```

### Backend

```bash
cd backend

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:cov

# Run specific test
npm test -- auth.service.spec.ts
```

---

## CI/CD Integration (Future)

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Tests
        run: |
          cd backend
          npm ci
          npm test
          npm run test:cov

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm ci
          npm test
          npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Run E2E Tests
        run: |
          docker-compose up -d
          cd backend
          npm run test:e2e
```

---

## Test Data Factories (DRY Principle)

### Frontend Factories

```typescript
// tests/mocks/factories.ts
export const createMockTransaction = (overrides?: Partial<Transaction>): Transaction => ({
  id: 1,
  userId: 1,
  categoryId: 1,
  amount: 100,
  type: 'EXPENSE',
  description: 'Test transaction',
  date: new Date('2025-10-07'),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCategory = (overrides?: Partial<Category>): Category => ({
  id: 1,
  userId: 1,
  name: 'Food',
  type: 'EXPENSE',
  icon: 'ShoppingCart',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
```

**Usage:**
```typescript
const transaction = createMockTransaction({ amount: 500, description: 'Custom' });
```

---

## Best Practices

### Do's ✅

1. **Test User Behavior:** Simulate real user interactions (click, type, submit)
2. **Use Semantic Queries:** `getByRole`, `getByLabelText` over `getByTestId`
3. **Wait for Async:** Always use `waitFor` for async state updates
4. **Mock External Dependencies:** API calls, Zustand stores, external libraries
5. **Reset Mocks:** Clear mocks between tests (`beforeEach` hook)
6. **Descriptive Test Names:** `should display error when email is invalid`
7. **Arrange-Act-Assert:** Structure tests consistently

### Don'ts ❌

1. **Don't Test Implementation Details:** Avoid testing internal state, use user-facing behavior
2. **Don't Use `getByTestId` as First Choice:** Prefer accessible queries
3. **Don't Skip Cleanup:** Always unmount components, close DB connections
4. **Don't Mock Everything:** Test real integrations when possible
5. **Don't Ignore Coverage Gaps:** Address uncovered critical paths
6. **Don't Write Flaky Tests:** Ensure deterministic, repeatable results

---

## Known Issues & Workarounds

### Issue 1: jsdom HTML5 Form Validation

**Problem:** HTML5 `required` attributes prevent form submission in jsdom.

**Workaround:**
```typescript
const form = screen.getByRole('button', { name: /submit/i }).closest('form')!;
fireEvent.submit(form); // Bypasses validation
```

### Issue 2: Zustand Persistence in Tests

**Problem:** Zustand persist middleware causes state leakage between tests.

**Workaround:**
```typescript
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
```

### Issue 3: Next.js Router in Tests

**Problem:** Next.js `useRouter` throws errors in test environment.

**Workaround:**
```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
  }),
}));
```

---

## Useful Resources

- **Testing Library Docs:** https://testing-library.com/docs/react-testing-library/intro
- **Vitest Docs:** https://vitest.dev/guide/
- **Jest Docs:** https://jestjs.io/docs/getting-started
- **NestJS Testing:** https://docs.nestjs.com/fundamentals/testing
- **Common Mistakes:** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

**Last Updated:** October 7, 2025  
**Version:** v0.7.0
