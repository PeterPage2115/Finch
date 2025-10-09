# 🛠️ Tech Stack

> **Overview of technologies, frameworks, and libraries used in Finch**

---

## Frontend (Next.js)

### Core Framework
- **Next.js** `15.5.4` - React framework with App Router, Server Components, API routes
- **React** `19.2.0` - UI library with hooks, concurrent features
- **TypeScript** `5.x` - Type-safe JavaScript with strict mode enabled

### Styling
- **Tailwind CSS** `4.0.0` - Utility-first CSS framework with @variant support
- **PostCSS** - CSS processing with @tailwindcss/postcss
- **Framer Motion** `12.23.22` - Animation library for smooth transitions

### State Management
- **Zustand** `5.0.8` - Lightweight state management with persist middleware
  - `authStore` - User authentication state
  - `transactionStore` - Transactions CRUD
  - `categoryStore` - Categories management
  - `budgetStore` - Budgets tracking
  - `notificationStore` - Aria-live notifications

### Icons & UI
- **Lucide React** `0.545.0` - Icon library (50+ icons, PascalCase naming)
- **Recharts** `3.2.1` - Charts for reports (line, bar, pie)
- **React Hook Form** `7.64.0` - Form validation and handling

### HTTP Client
- **Built-in Fetch API** - Native browser API with Next.js enhancements

---

## Backend (NestJS)

### Core Framework
- **NestJS** `11.0.1` - Progressive Node.js framework
- **TypeScript** `5.x` - Type-safe backend development
- **Node.js** `20.x` (Alpine in Docker)

### Database
- **PostgreSQL** `17-alpine` - Relational database
- **Prisma ORM** `6.17.0` - Type-safe database client
  - Migrations management
  - Schema-first development
  - Auto-generated TypeScript types

### Authentication
- **Passport.js** `0.7.0` - Authentication middleware
- **passport-jwt** `4.0.1` - JWT strategy implementation
- **@nestjs/jwt** `11.0.0` - JWT token generation
- **bcrypt** `6.0.0` - Password hashing (10 salt rounds)

### Email & PDF
- **nodemailer** `7.0.9` - Email service (password reset)
- **pdfkit** `0.17.2` - PDF generation for reports
- **Liberation Sans** - UTF-8 font for Polish characters

### Validation
- **class-validator** `0.14.2` - DTO validation decorators
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
  "react": "19.2.0",
  "zustand": "5.0.8",
  "lucide-react": "0.545.0",
  "recharts": "3.2.1",
  "framer-motion": "12.23.22",
  "react-hook-form": "7.64.0"
}
```

### Backend Key Dependencies
```json
{
  "@nestjs/core": "11.0.1",
  "@nestjs/common": "11.0.1",
  "@nestjs/jwt": "11.0.0",
  "@prisma/client": "6.17.0",
  "prisma": "6.17.0",
  "passport": "0.7.0",
  "passport-jwt": "4.0.1",
  "bcrypt": "6.0.0",
  "class-validator": "0.14.2",
  "nodemailer": "7.0.9",
  "pdfkit": "0.17.2"
}
```

---

## Browser Support

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari 12+, Chrome Android
- **Accessibility:** WCAG 2.1 AA compliant (95%)

---

## Future Additions (Roadmap)

- **v1.1:** Split Transactions, CSV Import, Rules Engine, Recurring Transactions, Tags, Attachments, Multi-currency, i18n (EN/PL)
- **v1.2:** Goals/Savings tracking, OFX/QFX import
- **v1.3:** Public API (Swagger), Enhanced Rules
- **v2.0:** Bank sync, Mobile app, Advanced reporting

---

**Last Updated:** October 9, 2025  
**Version:** v1.0.1
