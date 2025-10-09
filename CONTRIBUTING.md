# Contributing to Finch 💰

Dziękujemy za zainteresowanie wkładem w projekt Finch! 

## 📋 Spis Treści

- [Code of Conduct](#code-of-conduct)
- [Jak mogę pomóc?](#jak-mogę-pomóc)
- [Proces developmentu](#proces-developmentu)
- [Conventional Commits](#conventional-commits)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

Projekt jest open-source i mile widziany jest każdy konstruktywny wkład. Prosimy o szacunek wobec innych contributors i maintainers.

---

## Jak mogę pomóc?

### 🐛 Zgłaszanie błędów
1. Sprawdź czy issue już nie istnieje
2. Użyj Issue Template
3. Dodaj szczegóły: kroki reprodukcji, oczekiwane vs faktyczne zachowanie
4. Załącz logi (jeśli możliwe)

### ✨ Proponowanie nowych funkcji
1. Najpierw otwórz Issue z tagiem "feature request"
2. Opisz use case i benefity
3. Poczekaj na feedback od maintainers

### 💻 Pull Requests
1. Fork repozytorium
2. Stwórz branch z feature/bugfix
3. Implementuj zmiany
4. Napisz/zaktualizuj testy
5. Otwórz Pull Request

---

## Proces Developmentu

### Setup środowiska

```bash
# 1. Sklonuj repo
git clone https://github.com/PeterPage2115/Finch_kasy.git Finch
cd Finch

# 2. Skopiuj .env
cp .env.example .env

# 3. Uruchom Docker
docker-compose up -d

# 4. Sprawdź czy działa
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

### Struktura branchy

- `main` - stabilny kod produkcyjny
- `feature/*` - nowe funkcjonalności
- `fix/*` - poprawki błędów
- `docs/*` - zmiany w dokumentacji

---

## Conventional Commits

**Format:** `<type>: <description>`

### Typy commitów:

| Typ | Opis | Przykład |
|-----|------|----------|
| `feat` | Nowa funkcjonalność | `feat: add budget alerts` |
| `fix` | Naprawa błędu | `fix: category deletion validation` |
| `docs` | Dokumentacja | `docs: update README` |
| `style` | Formatowanie (nie zmienia logiki) | `style: fix indentation` |
| `refactor` | Refaktoryzacja | `refactor: extract validation logic` |
| `test` | Testy | `test: add categories e2e tests` |
| `chore` | Build/narzędzia | `chore: update dependencies` |

### Zasady:
- **Max 50 znaków** w subject line
- Imperative mood: "add" nie "added"
- Bez kropki na końcu
- Body (opcjonalnie) z więcej szczegółów

**Przykłady:**
```
✅ feat: add CSV export
✅ fix: resolve hydration issue
✅ docs: add API documentation
❌ Added new feature for budgets (za długie, past tense)
❌ fix bug (zbyt ogólne)
```

---

## Code Style

### TypeScript/JavaScript

- **ESLint:** Używamy konfiguracji z `eslint.config.mjs`
- **Prettier:** Auto-format przed commitem
- **TypeScript:** Silne typowanie, **unikaj `any`**

### Naming Conventions

```typescript
// ✅ Dobre
const userCategories = [...];
function calculateBudgetProgress() {}
interface CreateTransactionDto {}

// ❌ Złe
const x = [...];
function calc() {}
interface data {}
```

### Imports

```typescript
// ✅ Grupuj importy
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

# Coverage
npm run test:cov
```

### Wymagania:
- ✅ Każda nowa feature = testy
- ✅ Każdy bugfix = test reprodukujący problem
- ✅ Minimum 80% coverage dla nowego kodu

### Przykład testu:

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

### Checklist przed PR:

- [ ] Kod działa lokalnie (`docker-compose up`)
- [ ] Wszystkie testy przechodzą (`npm run test`)
- [ ] Brak błędów TypeScript
- [ ] Commity w Conventional Commits format
- [ ] Dokumentacja zaktualizowana (jeśli potrzebne)
- [ ] CHANGELOG.md zaktualizowany (dla większych zmian)

### PR Template:

```markdown
## Opis
Krótki opis co zmienia ten PR.

## Typ zmiany
- [ ] 🐛 Bugfix
- [ ] ✨ Nowa funkcjonalność
- [ ] 📝 Dokumentacja
- [ ] ♻️ Refaktoryzacja

## Testing
Jak przetestować te zmiany?

## Screenshots (jeśli UI)
(dodaj jeśli to zmiana w UI)

## Checklist
- [ ] Testy dodane/zaktualizowane
- [ ] Dokumentacja zaktualizowana
- [ ] Conventional commits
```

### Review process:

1. Otwórz PR z opisem
2. Poczekaj na CI/CD (jak będzie) ⏳
3. Maintainer review + feedback
4. Popraw jeśli trzeba
5. Merge po approve ✅

---

## Dodatkowe Zasoby

- **Architecture:** Zobacz `docs/PROJECT_STATUS.md`
- **Code Review:** `docs/CODE_REVIEW_REPORT.md`
- **Changelog:** `CHANGELOG.md`
- **Roadmap:** `TODO.md`

---

## Pytania?

Jeśli masz pytania:
1. Sprawdź istniejące Issues
2. Otwórz nowe Issue z pytaniem
3. Napisz do maintainers

---

**Dziękujemy za wkład w Finch! 🎉**
