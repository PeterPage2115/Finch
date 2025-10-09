# Contributing to Finch 💰

Thank you for your interest in contributing to the Finch project!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Help?](#how-can-i-help)
- [Development Process](#development-process)
- [Conventional Commits](#conventional-commits)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

The project is open-source and any constructive contribution is welcome. Please be respectful towards other contributors and maintainers.

---

## How Can I Help?

### 🐛 Reporting Bugs
1. Check if the issue already exists
2. Use the Issue Template
3. Add details: reproduction steps, expected vs. actual behavior
4. Attach logs (if possible)

### ✨ Proposing New Features
1. First, open an Issue with the "feature request" tag
2. Describe the use case and benefits
3. Wait for feedback from maintainers

### 💻 Pull Requests
1. Fork the repository
2. Create a branch for the feature/bugfix
3. Implement the changes
4. Write/update tests
5. Open a Pull Request

---

## Development Process

### Environment Setup

```bash
# 1. Clone the repo
git clone https://github.com/PeterPage2115/Finch.git
cd Finch

# 2. Copy .env
cp .env.example .env

# 3. Run Docker
docker-compose up -d

# 4. Check if it's working
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

### Branch Structure

- `main` - stable production code
- `feature/*` - new functionalities
- `fix/*` - bug fixes
- `docs/*` - documentation changes

---

## Conventional Commits

**Format:** `<type>: <description>`

### Commit Types:

| Type | Description | Example |
|---|---|---|
| `feat` | A new feature | `feat: add budget alerts` |
| `fix` | A bug fix | `fix: category deletion validation` |
| `docs` | Documentation only changes | `docs: update README` |
| `style` | Formatting (does not affect logic) | `style: fix indentation` |
| `refactor` | Code refactoring | `refactor: extract validation logic` |
| `test` | Adding missing tests or correcting existing tests | `test: add categories e2e tests` |
| `chore` | Build process or auxiliary tools and libraries | `chore: update dependencies` |

### Rules:
- **Max 50 characters** in the subject line
- Use imperative mood: "add" not "added"
- No period at the end
- Body (optional) with more details

**Examples:**
```
✅ feat: add CSV export
✅ fix: resolve hydration issue
✅ docs: add API documentation
❌ Added new feature for budgets (too long, past tense)
❌ fix bug (too generic)
```

---

## Code Style

### TypeScript/JavaScript

- **ESLint:** We use the configuration from `eslint.config.mjs`
- **Prettier:** Auto-formats before commit
- **TypeScript:** Strong typing, **avoid `any`**

### Naming Conventions

```typescript
// ✅ Good
const userCategories = [...];
function calculateBudgetProgress() {}
interface CreateTransactionDto {}

// ❌ Bad
const x = [...];
function calc() {}
interface data {}
```

### Imports

```typescript
// ✅ Group imports
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { CreateCategoryDto } from './dto';
```

---

## Testing

### Backend (Jest)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

**Requirements:**
- All new features must have tests
- Maintain >90% coverage
- Tests must pass before PR approval

### Frontend (Vitest)

```bash
# Run tests
npm test run

# Watch mode
npm test

# Coverage
npm run test:coverage
```

---

## Development Utilities

### Database Reset Script

When you need a fresh database with latest code changes:

**Windows (PowerShell):**
```powershell
.\reset-database.ps1
```

**What it does:**
1. Stops all Docker containers
2. Rebuilds backend image with latest code
3. Removes database volume (⚠️ deletes all data)
4. Creates fresh database with migrations
5. Starts backend service

**Use when:**
- After pulling new migrations
- After changing backend code (categories, default data)
- Testing needs clean slate
- Database is in inconsistent state

**⚠️ Warning:** This deletes ALL data! Only use in development.

See [Database Reset Guide](./docs/DATABASE_RESET.md) for detailed documentation.

### Seed Test Data

Generate sample transactions for testing:

**Windows (PowerShell):**
```powershell
.\backend\scripts\seed-test-data.ps1
```

**Prerequisites:**
- Application running
- User account created (demo@tracker.com)

**What it creates:**
- 90 transactions (3 months of data)
- Realistic income/expense patterns
- Uses existing user categories

See `backend/scripts/README.md` for more details.

---

# Coverage
npm run test:cov
```

### Requirements:
- ✅ Every new feature = tests
- ✅ Every bugfix = a test reproducing the problem
- ✅ Minimum 80% coverage for new code

### Example Test:

```typescript
describe('CategoriesService', () => {
  it('should create a category', async () => {
    const dto: CreateCategoryDto = {
      name: 'Test',
      type: 'EXPENSE',
      color: '#3B82F6',
      icon: '🧪'
    };
    
    const result = await service.create(userId, dto);
    expect(result.name).toBe('Test');
  });
});
```

---

## Pull Request Process

### Pre-PR Checklist:

- [ ] The code works locally (`docker-compose up`)
- [ ] All tests pass (`npm run test`)
- [ ] No TypeScript errors
- [ ] Commits are in Conventional Commits format
- [ ] Documentation updated (if necessary)
- [ ] CHANGELOG.md updated (for major changes)

### PR Template:

```markdown
## Description
A brief description of what this PR changes.

## Type of change
- [ ] 🐛 Bugfix
- [ ] ✨ New feature
- [ ] 📝 Documentation
- [ ] ♻️ Refactor

## Testing
How to test these changes?

## Screenshots (if UI)
(add if this is a UI change)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Conventional commits
```

### Review process:

1. Open a PR with a description
2. Wait for CI/CD (when available) ⏳
3. Maintainer review + feedback
4. Make corrections if needed
5. Merge after approval ✅

---

## Additional Resources

- **Architecture:** See `docs/PROJECT_STATUS.md`
- **Code Review:** `docs/CODE_REVIEW_REPORT.md`
- **Changelog:** `CHANGELOG.md`
- **Roadmap:** `TODO.md`

---

## Questions?

If you have questions:
1. Check existing Issues
2. Open a new Issue with your question
3. Contact the maintainers

---

**Thank you for contributing to Finch! 🎉**