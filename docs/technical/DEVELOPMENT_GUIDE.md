# 🚀 Development Guide

> **Setup instructions, workflow, and debugging tips for contributors**

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (or Docker Engine + Docker Compose)
- **Git** (for version control)
- **Node.js** 20.x (optional, for local development without Docker)
- **Code Editor:** VS Code recommended (with ESLint, Prettier extensions)

---

## Quick Start (Docker - Recommended)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Finch.git
cd Finch
```

### 2. Environment Setup

Create `.env` file in project root:

```bash
# Backend
DATABASE_URL="postgresql://Finch_user_db:Finch_password_db@db:5432/Finch_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

**⚠️ Important:** Change `JWT_SECRET` in production!

### 3. Start Application

```bash
docker-compose up --build
```

This command will:
- Build frontend and backend Docker images
- Start PostgreSQL database
- Run Prisma migrations
- Start frontend on `http://localhost:3000`
- Start backend on `http://localhost:3001`

### 4. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Test User:** `test@test.pl` / `password123` (mock authentication)

### 5. Stop Application

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

---

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend
npm install

# Setup database
npx prisma migrate dev

# Optional: Create seed.ts locally for test data (see docs/DATABASE.md)
# npx prisma db seed

# Start development server
npm run start:dev  # Hot reload enabled
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev  # Hot reload enabled
```

Frontend runs on `http://localhost:3000`

### Database Management (Local)

**Install PostgreSQL** (if not using Docker):
```bash
# macOS
brew install postgresql@17

# Ubuntu/Debian
sudo apt install postgresql-17

# Windows
# Download installer from postgresql.org
```

**Create Database:**
```bash
createdb Finch_db
```

**Update .env:**
```bash
DATABASE_URL="postgresql://localhost:5432/Finch_db?schema=public"
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow **KISS** and **YAGNI** principles (see `.github/copilot-instructions.md`)
- Write clean, self-documenting code
- Add JSDoc comments for complex functions

### 3. Run Tests

**Backend:**
```bash
cd backend
npm test                 # Unit tests
npm run test:e2e         # Integration tests
npm run test:cov         # Coverage report
```

**Frontend:**
```bash
cd frontend
npm test                 # Unit tests (Vitest)
npm run test:coverage    # Coverage report
```

### 4. Commit Changes (Conventional Commits)

```bash
git add .
git commit -m "feat: add user profile page"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions/updates
- `refactor:` - Code refactoring
- `style:` - Formatting changes
- `chore:` - Build/tooling updates

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create Pull Request on GitHub with description of changes.

---

## Hot Reload

### Frontend (Next.js)

- **Automatic:** File changes trigger instant refresh
- **Fast Refresh:** Preserves component state during updates
- **No restart needed** for most changes

### Backend (NestJS)

- **Automatic:** Uses `nodemon` in dev mode
- **Restarts on:** `.ts` file changes
- **No manual restart** for code updates

**⚠️ Note:** Prisma schema changes require manual migration:
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

---

## Database Migrations (Prisma)

### Create Migration

After modifying `backend/prisma/schema.prisma`:

```bash
cd backend
npx prisma migrate dev --name add_user_avatar
```

This will:
1. Generate SQL migration file
2. Apply migration to database
3. Regenerate Prisma Client types

### Apply Migrations (Production)

```bash
npx prisma migrate deploy
```

### Reset Database (Development)

```bash
npx prisma migrate reset  # ⚠️ Deletes all data!
```

### View Database (Prisma Studio)

```bash
npx prisma studio
```

Opens GUI at `http://localhost:5555` for database inspection.

---

## Debugging

### Frontend Debugging (VS Code)

**launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug frontend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/frontend",
      "port": 9229
    }
  ]
}
```

### Backend Debugging (VS Code)

**launch.json:**
```json
{
  "name": "NestJS: debug backend",
  "type": "node",
  "request": "launch",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "start:debug"],
  "cwd": "${workspaceFolder}/backend",
  "port": 9229
}
```

### Docker Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Common Issues

**Issue:** `Port 3000 already in use`  
**Solution:**
```bash
# Find process
lsof -ti:3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Issue:** `Database connection failed`  
**Solution:**
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials

**Issue:** `Prisma Client not generated`  
**Solution:**
```bash
cd backend
npx prisma generate
```

---

## Code Quality Tools

### Linting (ESLint)

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

### Type Checking

```bash
# Frontend
cd frontend
npx tsc --noEmit

# Backend
cd backend
npx tsc --noEmit
```

### Auto-Fix

```bash
npm run lint -- --fix
```

---

## Testing Best Practices

### Frontend Tests (Vitest + Testing Library)

**Pattern: AAA (Arrange-Act-Assert)**
```typescript
it('should add transaction when form is submitted', async () => {
  // Arrange
  render(<TransactionForm />);
  
  // Act
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  
  // Assert
  await waitFor(() => {
    expect(mockAddTransaction).toHaveBeenCalledWith({ amount: 100 });
  });
});
```

**Mocking Zustand Stores:**
```typescript
vi.mock('@/lib/stores/transactionStore', () => ({
  useTransactionStore: vi.fn(() => ({
    transactions: [],
    addTransaction: vi.fn(),
  })),
}));
```

### Backend Tests (Jest)

**Service Tests:**
```typescript
describe('BudgetsService', () => {
  let service: BudgetsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BudgetsService, PrismaService],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate budget progress correctly', async () => {
    // Test logic
  });
});
```

**E2E Tests:**
```typescript
describe('/api/auth (e2e)', () => {
  it('POST /auth/login - success', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@test.pl', password: 'password123' })
      .expect(200)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });
});
```

---

## Useful Commands

### Docker

```bash
# Rebuild single service
docker-compose up -d --build backend

# Execute command in container
docker-compose exec backend npm run prisma:studio

# View container logs
docker-compose logs -f frontend

# Remove orphaned containers
docker-compose down --remove-orphans
```

### Git

```bash
# Sync with main branch
git fetch origin
git rebase origin/main

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Stash changes
git stash
git stash pop
```

### NPM

```bash
# Install dependency
npm install <package-name>

# Update dependencies
npm update

# Check outdated packages
npm outdated

# Clean install (remove node_modules)
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables Reference

### Backend (.env)

```bash
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

**⚠️ Security Note:** Never commit `.env` files to Git! Use `.env.example` as template.

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **NestJS Docs:** https://docs.nestjs.com
- **Prisma Docs:** https://www.prisma.io/docs
- **Zustand Docs:** https://zustand-demo.pmnd.rs
- **Testing Library:** https://testing-library.com/docs/react-testing-library/intro

---

**Last Updated:** October 7, 2025  
**Version:** v0.7.0
