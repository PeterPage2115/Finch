# 🛠️ Tech Stack

> **Overview of technologies, frameworks, and libraries used in Finch**

---

## Frontend (Next.js)

### Core Framework
- **Next.js** `15.5.4` - React framework with App Router, Server Components, API routes
- **React** `19.1.0` - UI library with hooks, concurrent features
- **TypeScript** `5.x` - Type-safe JavaScript with strict mode enabled

### Styling
- **Tailwind CSS** `4.0.0` - Utility-first CSS framework
- **PostCSS** - CSS processing with autoprefixer
- **Framer Motion** `11.15.1` - Animation library for smooth transitions

### State Management
- **Zustand** `5.0.8` - Lightweight state management
  - `authStore` - User authentication state
  - `transactionStore` - Transactions CRUD
  - `categoryStore` - Categories management
  - `budgetStore` - Budgets tracking
  - `notificationStore` - Aria-live notifications

### Icons & UI
- **Lucide React** `0.468.0` - Icon library (50+ icons used)
- **Recharts** `2.15.0` - Charts for reports (line, bar, pie)

### HTTP Client
- **Axios** `1.7.9` - Promise-based HTTP requests with interceptors

---

## Backend (NestJS)

### Core Framework
- **NestJS** `10.x` - Progressive Node.js framework
- **TypeScript** `5.x` - Type-safe backend development
- **Node.js** `20.x` (Alpine in Docker)

### Database
- **PostgreSQL** `17-alpine` - Relational database
- **Prisma ORM** `6.1.0` - Type-safe database client
  - Migrations management
  - Schema-first development
  - Auto-generated TypeScript types

### Authentication
- **Passport.js** `0.7.0` - Authentication middleware
- **passport-jwt** `4.0.1` - JWT strategy (currently mock, v0.8.0 will add bcrypt)
- **@nestjs/jwt** `10.2.0` - JWT token generation

### Validation
- **class-validator** `0.14.1` - DTO validation decorators
- **class-transformer** `0.5.1` - Transform plain objects to class instances

---

## Testing

### Frontend Testing
- **Vitest** `3.2.4` - Fast unit test framework (Vite-based)
- **@testing-library/react** `16.1.0` - React component testing
- **@testing-library/jest-dom** `6.6.3` - Custom Jest matchers
- **jsdom** `25.0.1` - DOM simulation for tests
- **happy-dom** - Alternative DOM implementation

**Current Coverage:**
- 91 tests passing
- TransactionForm: 98.87% coverage
- CategoryIcon, IconPicker, ProgressBar, BudgetCard: 100% coverage

### Backend Testing
- **Jest** `30.0.0` - JavaScript testing framework
- **@nestjs/testing** - NestJS test utilities
- **supertest** - HTTP assertions for E2E tests

**Current Coverage:**
- 84 tests passing
- AuthService, BudgetsService covered

---

## DevOps & Infrastructure

### Containerization
- **Docker** - Application containerization
- **Docker Compose** - Multi-container orchestration
  - `frontend` service (Next.js on port 3000)
  - `backend` service (NestJS on port 3001)
  - `db` service (PostgreSQL on port 5432)

### Environment Management
- **dotenv** - Environment variables from `.env` files
- `.env.example` - Template for configuration

### Version Control
- **Git** - Source control
- **GitHub** - Remote repository hosting
- **Conventional Commits** - Commit message convention

---

## Code Quality

### Linting & Formatting
- **ESLint** `9.x` - JavaScript/TypeScript linting
- **@typescript-eslint** - TypeScript-specific rules
- **eslint-config-next** - Next.js recommended config

### Type Checking
- **TypeScript Strict Mode** - Enabled for maximum type safety
- **Prisma Generated Types** - Auto-generated from schema

---

## Dependencies Summary

### Frontend Key Dependencies
```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "zustand": "5.0.8",
  "axios": "1.7.9",
  "lucide-react": "0.468.0",
  "recharts": "2.15.0",
  "framer-motion": "11.15.1"
}
```

### Backend Key Dependencies
```json
{
  "@nestjs/core": "10.x",
  "@nestjs/common": "10.x",
  "@nestjs/jwt": "10.2.0",
  "@prisma/client": "6.1.0",
  "passport": "0.7.0",
  "passport-jwt": "4.0.1",
  "class-validator": "0.14.1"
}
```

---

## Browser Support

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari 12+, Chrome Android
- **Accessibility:** WCAG 2.1 AA compliant (95%)

---

## Future Additions (Roadmap)

- **v0.8.0:** bcrypt (password hashing), NodeMailer (email service)
- **v0.9.0:** PDF generation (reports), CSV export
- **v1.0:** Monitoring (Sentry), Performance tracking
- **v1.1:** Multi-currency API integration

---

**Last Updated:** October 7, 2025  
**Version:** v0.7.0
