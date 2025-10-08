# Plan Testowania i Dokumentacji - 2025-01-08

## 🎯 Cel
Przygotowanie projektu do publikacji na GitHub:
1. Automated testing (backend + frontend)
2. Documentation updates
3. Code review & cleanup

---

## 📋 Phase 1: Backend Testing

### Current Status
- ✅ Unit tests exist dla: categories, budgets, transactions, reports
- ❌ Auth tests broken (missing EmailService mock)
- ❌ Brak testów dla nowego endpointu: getCategoryDetails
- ❌ E2E tests nie pokrywają nowych features

### Tasks

#### 1.1 Fix Existing Tests
- [ ] Fix auth.service.spec.ts (add EmailService mock)
- [ ] Run all unit tests: `npm test`
- [ ] Verify all pass

#### 1.2 Add Tests for New Features
- [ ] reports.service.spec.ts - test getCategoryDetails()
- [ ] reports.controller.spec.ts - test getCategoryDetails endpoint
- [ ] Test coverage > 80%

#### 1.3 E2E Tests
- [ ] Add e2e test: GET /reports/category/:id/details
- [ ] Test authorization (401 without token)
- [ ] Test with valid data
- [ ] Test with invalid categoryId

#### 1.4 Run Coverage Report
```bash
npm test -- --coverage
```

---

## 📋 Phase 2: Frontend Testing

### Current Status
- ❌ Brak automated tests
- ✅ Playwright configured (używany wcześniej dla screenshots)
- ❌ Brak React Testing Library setup

### Tasks

#### 2.1 Setup Testing Infrastructure
- [ ] Install dependencies:
  ```bash
  npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
  npm install --save-dev jest jest-environment-jsdom @types/jest
  ```
- [ ] Create jest.config.js
- [ ] Create jest.setup.js
- [ ] Update package.json scripts

#### 2.2 Component Tests (Priority)
- [ ] CategoryDetailsModal.test.tsx
  - Test opens/closes
  - Test fetches data
  - Test error handling
  - Test loading state
- [ ] AppNavbar.test.tsx
  - Test theme toggle
  - Test icons render
- [ ] EnhancedCategoryPieChart.test.tsx
  - Test legend spacing
  - Test click handlers

#### 2.3 Integration Tests
- [ ] Login flow
- [ ] Register flow
- [ ] Reports page rendering

#### 2.4 E2E Tests (Playwright)
- [ ] Update existing Playwright tests
- [ ] Test critical user journeys:
  - Login → Dashboard → Reports → Click category
  - Register → Setup → Dashboard

---

## 📋 Phase 3: Documentation Updates

### 3.1 CHANGELOG.md
- [ ] Add section for 2025-01-08 changes
- [ ] List all 6 commits with descriptions
- [ ] Categorize: Bug Fixes, Features, Refactoring

### 3.2 TODO.md
- [ ] Remove completed items:
  - ~~Fix emoji on theme toggle~~
  - ~~Fix emoji on homepage~~
  - ~~Add theme toggle to register~~
  - ~~Fix pie chart legend overlap~~
  - ~~Fix category details modal~~
- [ ] Update in-progress items

### 3.3 README.md
- [ ] Update features list
- [ ] Add screenshots (if available)
- [ ] Update setup instructions
- [ ] Add testing section
- [ ] Update tech stack (mention Zustand, Recharts)

### 3.4 API Documentation (docs/API.md)
- [ ] Add getCategoryDetails endpoint
- [ ] Document request/response format
- [ ] Add example usage

### 3.5 Testing Documentation (NEW)
Create: `docs/TESTING.md`
- [ ] Backend testing guide
- [ ] Frontend testing guide
- [ ] E2E testing guide
- [ ] Coverage requirements
- [ ] CI/CD integration (future)

---

## 📋 Phase 4: Code Review & Cleanup

### 4.1 ESLint Check
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```
- [ ] Fix all errors
- [ ] Fix critical warnings
- [ ] Document suppressed warnings

### 4.2 TypeScript Strict Mode
- [ ] Check for `any` types
- [ ] Add proper interfaces where missing
- [ ] Fix type errors

### 4.3 Code Cleanup
- [ ] Remove unused imports
- [ ] Remove commented code
- [ ] Remove console.logs (production)
- [ ] Standardize formatting
- [ ] Check for TODO comments

### 4.4 Security Audit
```bash
# Backend
cd backend
npm audit

# Frontend  
cd frontend
npm audit
```
- [ ] Review vulnerabilities
- [ ] Update packages if needed
- [ ] Document known issues

### 4.5 Performance Check
- [ ] Bundle size analysis (frontend)
- [ ] Database query optimization check
- [ ] N+1 query prevention
- [ ] Proper indexing in Prisma schema

---

## 📋 Phase 5: GitHub Preparation

### 5.1 Repository Setup
- [ ] Create .github/workflows/ (future CI/CD)
- [ ] Create CONTRIBUTING.md
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Update LICENSE (if needed)

### 5.2 README Enhancement
- [ ] Add badges (build status, coverage, license)
- [ ] Add demo screenshots/GIFs
- [ ] Add architecture diagram
- [ ] Add quick start guide

### 5.3 Git Cleanup
- [ ] Check .gitignore completeness
- [ ] Remove sensitive data from history (if any)
- [ ] Squash commits if needed (optional)
- [ ] Create release tag v1.0.0

---

## ⏱️ Time Estimates

| Phase | Estimated Time |
|-------|----------------|
| Backend Testing | 1-2 hours |
| Frontend Testing | 2-3 hours |
| Documentation | 1 hour |
| Code Review & Cleanup | 1-2 hours |
| GitHub Prep | 30 min |
| **TOTAL** | **5.5-8.5 hours** |

---

## 🎯 Priority Order (For Today)

### High Priority (Must Do)
1. ✅ Fix backend tests (auth.service.spec.ts)
2. ✅ Add test for getCategoryDetails
3. ✅ Update CHANGELOG.md
4. ✅ Update TODO.md
5. ✅ ESLint check & fix critical issues

### Medium Priority (Should Do)
6. ⏳ Setup frontend testing infrastructure
7. ⏳ Write CategoryDetailsModal tests
8. ⏳ Update README.md
9. ⏳ Security audit

### Low Priority (Nice to Have)
10. 🔜 E2E tests
11. 🔜 Performance optimization
12. 🔜 GitHub workflows
13. 🔜 Coverage badges

---

## 📝 Notes

- Focus on automation since manual testing not possible today
- Playwright already configured - leverage it!
- Jest for backend is ready - just fix broken tests
- Frontend needs testing setup from scratch
- Documentation is quick wins - prioritize

**Next Step:** Start with Phase 1.1 - Fix auth.service.spec.ts
