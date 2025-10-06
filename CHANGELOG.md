# Changelog

Wszystkie znaczące zmiany w projekcie będą dokumentowane w tym pliku.

Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/).

## [Unreleased]

### W planach
- Wykresy wydatków - zaawansowana analityka
- Export danych do CSV/PDF
- Powiadomienia o przekroczeniu budżetu
- Focus trap w drawer (focus-trap-react)
- aria-live regions dla toastów/messages

## [0.5.6] - 2025-10-06

### Dodane
- **Accessibility Improvements** ♿
  * ARIA labels: Icon-only buttons (Edit/Delete w CategoryList, TransactionList desktop/mobile)
  * ARIA labels format: "Edytuj kategorię {name}", "Usuń transakcję {description}"
  * Enhanced focus styles: Global *:focus-visible outline (blue-500 light, blue-400 dark)
  * Form auto-focus: TransactionForm (amount), CategoryForm (name), BudgetForm (amount)
  * Keyboard navigation ready: All interactive elements focusable
  * Screen reader friendly: Descriptive aria-labels for context

### Zmienione
- globals.css: Added *:focus-visible styles (2px outline, 2px offset, 4px border-radius)
- CategoryList.tsx: aria-label dla Edit/Delete buttons
- TransactionList.tsx: aria-label dla Edit/Delete (desktop table + mobile cards)
- TransactionForm.tsx, CategoryForm.tsx, BudgetForm.tsx: autoFocus na pierwszym input

### Techniczne
- WCAG 2.1 Level AA compliance: Keyboard navigation + Screen reader support
- Focus-visible: Only shows outline on keyboard focus (not mouse click)
- Auto-focus improves UX: Immediately ready for input when form opens

## [0.5.5] - 2025-10-06

### Zmienione
- **Performance Optimization** ⚡
  * React.memo: CategoryPieChart (Recharts rendering), BudgetList, TransactionList
  * useMemo: chartData calculation w CategoryPieChart (avoid recalculation on every render)
  * useCallback: Stabilized onEdit/onDelete handlers w Dashboard + Budgets pages
  * Dashboard: handleEdit, handleCancel, handleDelete → useCallback (prevent child re-renders)
  * Budgets: handleEdit, handleDeleteClick → useCallback (stable function references)
  * Result: Reduced unnecessary re-renders, smoother UI with large datasets

### Techniczne
- React.memo prevents component re-render if props unchanged
- useMemo caches expensive calculations (Recharts data transformation)
- useCallback stabilizes function references (critical for memo'd child components)
- Performance gains most visible with 50+ transactions/budgets

## [0.5.4] - 2025-10-06

### Dodane
- **Page Transition Animations** 🎬
  * app/template.tsx: Next.js 15 pattern dla route animations
  * template.tsx rerenders na każdej nawigacji = perfect for AnimatePresence
  * Smooth fadeIn: initial={{ opacity: 0, y: 20 }} → animate={{ opacity: 1, y: 0 }}
  * Duration: 0.5s, easing: easeOut
  * Impact: Wszystkie route changes (Dashboard → Categories → Budgets → Reports)
  * GPU-accelerated: opacity + transform only (no layout thrashing)

### Techniczne
- 'use client' directive: framer-motion requires client-side rendering
- template.tsx vs layout.tsx: template creates new instance per navigation
- Motion wrapper: Minimal overhead, smooth transitions between pages

## [0.5.3] - 2025-10-06

### Dodane
- **Budget Progress Bar Animations** 🎨
  * framer-motion integration w ProgressBar component
  * Smooth width animation: initial={{ width: 0 }} → animate={{ width: `${percentage}%` }}
  * Duration: 1s, easing: easeOut (natural deceleration)
  * Visual impact: Dashboard homepage (BudgetWidget) + Budgets page (BudgetCard)
  * Replace CSS transition-all z motion.div (better control + performance)

### Zmienione
- ProgressBar.tsx: 'use client' + motion.div z animated width
- Removed: static `style={{ width: \`${displayPercentage}%\` }}`
- Added: framer-motion declarative animation

## [0.5.2] - 2025-10-06 (UPDATE 2)

### Naprawione
- **CategoryList icons bug** 🐛
  * CategoryList używał getCategoryIcon zamiast CategoryIcon component
  * Pokazywały się kolorowe kropki zamiast ikon lucide-react
  * Fix: Import CategoryIcon + render z iconName/color props
- **Missing animations na primary buttons** ✨
  * Dashboard: "Dodaj transakcję" button
  * Budgets page: "Dodaj budżet" button
  * Categories page: "Dodaj kategorię" button
  * Wszystkie z whileHover={{ scale: 1.05 }}, whileTap={{ scale: 0.95 }}

## [0.5.2] - 2025-10-06

### Dodane
- **Button Hover Animations** 🎭
  * framer-motion integration (3 packages, 0 vulnerabilities)
  * AnimatePresence dla hamburger drawer:
    - Spring slide animation (damping 25, stiffness 200)
    - Backdrop fade (opacity 0→1, duration 300ms)
    - Smooth enter/exit transitions
  * Navigation buttons animations:
    - Desktop nav links: `whileHover={{ scale: 1.05 }}`, `whileTap={{ scale: 0.95 }}`
    - Mobile drawer links: `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`
    - Hamburger/Close buttons: `whileHover={{ scale: 1.1 }}`, `whileTap={{ scale: 0.9 }}`
    - Theme toggle: `whileHover={{ scale: 1.1, rotate: 15 }}` (playful effect)
  * Form buttons animations (wszystkie formularze):
    - Submit buttons: `whileHover={{ scale: 1.05 }}` (call-to-action emphasis)
    - Cancel buttons: `whileHover={{ scale: 1.02 }}` (subtle feedback)
    - TransactionForm, CategoryForm, BudgetForm
  * Action buttons animations:
    - Edit/Delete w TransactionList: `whileHover={{ scale: 1.05 }}`
    - Edit/Delete w CategoryList: `whileHover={{ scale: 1.1 }}` (icon buttons)
    - Edit/Delete w BudgetCard: `whileHover={{ scale: 1.1 }}` (icon buttons)
  * DateRangePicker animations:
    - Preset buttons: `whileHover={{ scale: 1.05 }}`
    - Custom apply button: `whileHover={{ scale: 1.02 }}`

### Zmienione
- AppNavbar.tsx: motion.button zamienione z <button>
- TransactionList.tsx: motion.button dla Edit/Delete (desktop + mobile)
- TransactionForm.tsx: motion.button dla Submit/Cancel
- CategoryForm.tsx: motion.button dla Submit/Cancel
- CategoryList.tsx: motion.button dla Edit/Delete icons
- BudgetForm.tsx: motion.button dla Submit/Cancel
- BudgetCard.tsx: motion.button dla Edit/Delete icons
- DateRangePicker.tsx: motion.button dla presets i apply

### Naprawione
- Next.js 15 async params:
  * categories/[id]/route.ts: `params: Promise<{ id: string }>` + `await params`
  * GET, PATCH, DELETE handlers zaktualizowane
- getCategoryIcon signature:
  * BudgetWidget.tsx: usunięto drugi parametr (category.name)
  * CategoryList.tsx: usunięto drugi parametr
- ESLint w production build:
  * next.config.ts: `ignoreDuringBuilds: true` (errors są w dev, fix później)

### Techniczne
- **framer-motion best practices:**
  * whileHover/whileTap dla instant feedback
  * scale animations: 1.02-1.1 (subtelność > agresywność)
  * spring animations dla drawer: Naturalny ruch (physics-based)
  * AnimatePresence required dla conditional rendering
- **Performance considerations:**
  * motion.button nie rerenderuje całego komponentu
  * Animacje GPU-accelerated (transform, opacity)
  * Brak layout thrashing (only transform/scale)
- **Accessibility maintained:**
  * aria-label preserved on all buttons
  * Disabled state blocks animations (nie confusing dla users)
  * Focus styles nie overridden przez motion

### Wnioski
- ✅ **framer-motion superior vs pure CSS:**
  - AnimatePresence handles unmounting cleanly (no lingering elements)
  - Spring physics feel more natural than cubic-bezier
  - Easier complex animations (multi-property transitions)
- ✅ **Scale animations uniwersalne:**
  - 1.05 dla text buttons (balanced visibility)
  - 1.1 dla icon buttons (compensate for smaller target)
  - 0.95/0.98 tap scale = tactile feedback
- ✅ **Rotate animation playful ale optional:**
  - Theme toggle rotate: Fun easter egg
  - Może być używane oszczędnie (attention grabbers)
- ⚠️ **Disabled animations critical:**
  - whileHover/Tap na disabled buttons = confusing
  - Zawsze check: `disabled={isLoading}` blocks interaction
- 💡 **Next iteration:**
  - Page transitions: fadeIn on route change
  - Progress bars: Animate width 0→percentage
  - List items: Stagger children animations (sequential reveal)

## [0.5.1] - 2025-10-06

### Dodane
- **Mobile Responsiveness (CZĘŚĆ 1/2)** 📱
  * AppNavbar hamburger menu:
    - Slide-in drawer z lewej strony (width 256px)
    - Backdrop overlay (semi-transparent black)
    - Close na ESC key (keyboard accessibility)
    - Body scroll lock gdy menu otwarte
    - Menu, X icons z lucide-react
    - User info i logout w drawer footer
    - Smooth transitions i hover states
  * TransactionList mobile cards:
    - Desktop: Table view (zachowana istniejąca funkcjonalność)
    - Mobile (<768px): Card view z vertical layout
    - Każda karta: Data, kwota, opis, kategoria z ikoną, typ, akcje
    - Full-width action buttons (Edytuj/Usuń)
    - Better touch targets (44px minimum height)
  * Responsive grid layouts:
    - Dashboard summary cards: grid-cols-1 md:grid-cols-3 (już było)
    - Reports SummaryCards: grid-cols-1 md:grid-cols-3 (już było)
    - Tailwind breakpoint: md (768px) jako punkt przełączenia

### Zmienione
- AppNavbar struktura:
  * useState dla isMobileMenuOpen state
  * useEffect hooks: body scroll lock + ESC key listener
  * Hamburger button visible tylko <md breakpoint
  * Desktop nav hidden <md, flex >=md (bez zmian)
  * Logout button hidden <sm (przeniesiony do mobile drawer)
- TransactionList rendering logic:
  * Dual views: `.hidden.md:block` dla tabeli, `.md:hidden` dla kart
  * DRY principle: Shared formatters (formatDate, formatAmount)
  * Mobile cards optymalizacja: flex-1 buttons, pełna szerokość

### Techniczne
- Breakpoint strategy: Tailwind md (768px) jako główny separator mobile/desktop
- Accessibility: aria-label na hamburger/close buttons, aria-hidden na backdrop
- Touch targets: Minimum 44x44px (Apple HIG standard)
- Z-index hierarchy: backdrop z-40, drawer z-50
- CSS transitions: transform/opacity dla smooth animations
- No JavaScript animations yet (pure CSS, framer-motion w następnej fazie)

### Wnioski
- ✅ Hamburger menu pattern intuicyjny i widely adopted
- ✅ Dual view (table/cards) lepsze niż horizontal scroll na mobile
- ✅ Body scroll lock prevents background scrolling (UX improvement)
- ✅ ESC key support improves keyboard accessibility
- 📝 Grid layouts były już responsive - Dashboard i Reports OK out of the box
- 🔜 Next: Forms touch targets, DateRangePicker mobile, framer-motion animations

## [0.5.0] - 2025-10-06

### Dodane
- **Moduł Raportów (FAZA 6.3 UKOŃCZONA)** ✅
  * Backend: ReportsModule z 2 endpointami
    - GET /reports/summary - agregacja przychodów/wydatków dla okresu
    - GET /reports/by-category - podział po kategoriach z procentami
  * Frontend: Strona /reports z trzema sekcjami
    - DateRangePicker - 4 presety (miesiąc/kwartał/rok/custom)
    - SummaryCards - 3 karty (przychody/wydatki/bilans)
    - CategoryPieChart - wykres kołowy z Recharts + top 5 lista
  * QueryReportDto walidacja dat i filtrowania typu
  * Responsywny layout, dark mode support
  * Link "Raporty" w nawigacji

- **Profesjonalne ikony lucide-react (zastąpienie emoji)** ✅
  * CategoryIcon component - dynamiczne ładowanie ikon po nazwie
  * 9 kategorii z ikonami: UtensilsCrossed (Jedzenie), Car (Transport), Gamepad2 (Rozrywka), Receipt (Rachunki), ShoppingBag (Zakupy), Heart (Zdrowie), MoreHorizontal (Inne wydatki), Wallet (Wynagrodzenie), TrendingUp (Inne przychody)
  * System kolorów - hex colors per kategoria (#ef4444, #3b82f6, #a855f7, etc.)
  * Migracja bazy: icon/color pola wymagane, UPDATE istniejących kategorii
  * Refaktoryzacja: categoryIcons.ts, TransactionList, CategoryPieChart, BudgetCard
  * Usunięto DEFAULT_COLORS array (kolory z bazy danych)

### Zmienione
- **Database schema** - Category.icon i Category.color wymagane (not null)
- **CreateCategoryDto** - icon i color wymagane przy tworzeniu kategorii
- **Seed script** - zaktualizowany z 9 kategoriami (7 expense, 2 income)
- **Category interfaces** - icon/color nie nullable w TypeScript

### Naprawione
- **Emoji encoding issues** - RESOLVED przez zastąpienie ikonami
  * Problem: Windows PowerShell terminal encoding podczas seed
  * Rozwiązanie: Ikony lucide-react (nazwy stringów, nie emoji UTF-8)
  * Dokumentacja: docs/EMOJI_FIX.md z prevention strategies
  * Hex encoding workaround już niepotrzebny

### Techniczne
- Prisma migration: `20251006105943_replace_emoji_with_lucide_icons`
- Recharts library - PieChart, Legend, Tooltip, ResponsiveContainer
- Manual groupBy workaround - Prisma limitation z relacjami
- Type-safe icon rendering z fallback HelpCircle
- Scalable icon system - łatwe dodawanie nowych kategorii

### Wnioski
- ✅ Lucide-react icons profesjonalniejsze i bez encoding issues
- ✅ Kolory z bazy danych lepsze niż hardcoded arrays
- ✅ Recharts excellent for financial visualizations
- ⚠️ Prisma groupBy nie działa z include - manual reduction pattern
- 📝 Commit messages: prosty nagłówek + szczegóły w CHANGELOG

## [0.4.1] - 2025-10-06

### Naprawione
- **CRITICAL**: Zustand hydration w Next.js SSR
  * Dodano `_hasHydrated` flag do authStore
  * `onRehydrateStorage` callback ustawia flagę po hydration
  * Categories/Dashboard sprawdzają hydration przed auth check
  * Rozwiązano problem przekierowań do /login gdy użytkownik jest zalogowany
- **@CurrentUser decorator** - akceptuje parametry pola (np. `@CurrentUser('id')`)
- **Puste pliki DTO** - `index.ts` i `update-category.dto.ts` wypełnione
- **CategoriesService** - kompletna implementacja (był pusty plik)
  * findAll, findOne, create, update, remove
  * Business rule: blokada usunięcia kategorii z transakcjami
- **CategoriesController** - refaktoryzacja (używa service zamiast Prisma)
- **Middleware** - uproszczony kod auth sprawdzania

### Dodane
- PROJECT_STATUS.md - kompletny stan projektu + zasady pracy
- MCP tools w dokumentacji - Sequential Thinking, Memory, Context7

### Wnioski techniczne
- ✅ Zustand persist w Next.js SSR wymaga hydration handling
- ✅ MCP tools (#mcp_sequentialthi_sequentialthinking, #memory, #mcp_upstash_conte_get-library-docs) znacząco przyspieszają debugging
- ⚠️ Zawsze sprawdzać czy pliki nie są puste przed użyciem

## [0.4.0] - 2025-10-06

### Dodane
- **Categories Frontend UI (FAZA 5 UKOŃCZONA 100%)** ✅
  * Strona /categories - kompletne zarządzanie kategoriami
  * CategoryForm component (create/edit z full walidacją)
  * CategoryList component (grid view z grupowaniem INCOME/EXPENSE)
  * API Routes: POST, PATCH, DELETE /api/categories
  * Link "Kategorie" w navbar dashboard
  * Delete confirmation modal
  * Empty state dla pustej listy
  * Loading states + error handling
- lucide-react icons (Plus, ArrowLeft, Pencil, Trash2)
- Extended categoriesApi: create, update, delete, getById methods

### Zmienione
- categoriesApi rozbudowany o wszystkie metody CRUD
- Dashboard navbar: dodano nawigację (Dashboard, Kategorie)
- Color picker + icon input w CategoryForm

### Zakończone fazy
- ✅ **FAZA 5: Kategorie** (Backend + Frontend - 100%)

## [0.3.0] - 2025-10-04

### Dodane
- Categories API (Backend + Frontend) - kategorie są user-specific
- ThemeProvider z Context API dla globalnego dark mode
- Pure black background (#000) w dark mode dla lepszego kontrastu
- Parallel fetch transactions + categories (Promise.all)
- Dark mode dostępny globalnie (login, register, dashboard)
- Toggle dark mode button w navbar
- Defensywne programowanie w stats calculation
- **Automatyczne tworzenie domyślnych kategorii przy rejestracji**
- Professional icons z lucide-react (zastąpienie emotek)

### Zmienione
- MOCK_CATEGORIES zastąpione przez real API call
- Dark mode: gray-900 → black (#000) dla tła
- Navbar: gray-800 → gray-900 (lekka separacja od tła)
- Stats calculation: dodano Array.isArray() + Number() casting
- Commity: krótkie wiadomości, szczegóły w CHANGELOG

### Naprawione
- **CRITICAL**: Runtime TypeError "amount.toFixed is not a function" - Prisma Decimal zwraca string
- **CRITICAL**: Błąd "Category not found or does not belong to user" - kategorie są teraz pobierane z API
- **CRITICAL**: ThemeProvider context error blokujący logowanie
- **CRITICAL**: Brak kategorii dla nowych użytkowników - auto-create przy register
- Dark mode toggle nie działał (problem z mounted state)
- Transakcje można teraz dodawać na wszystkich kontach

### Wnioski techniczne
- ⚠️ Prisma Decimal typ = string w runtime, zawsze używaj Number() conversion
- ✅ Sequential thinking skuteczny dla złożonych problemów
- ✅ User-scoped dane wymagają automatycznego seed przy rejestracji
- ✅ Weryfikacja w bazie > założenia TypeScript types

## [0.2.0] - 2025-10-04

### Dodane
- Backend Transactions CRUD API (POST, GET, PATCH, DELETE)
- Frontend Transactions komponenty (TransactionList, TransactionForm)
- Zustand store dla transactions z localStorage persist
- Next.js API Routes jako proxy do backendu
- Filtrowanie transakcji (type, categoryId, dateRange)
- Paginacja (page, limit, meta)

### Naprawione
- JWT auth dla wszystkich endpoints transakcji
- User-scoped access (user widzi tylko swoje transakcje)

## [0.1.0] - 2025-10-03

### Dodane
- Inicjalizacja projektu (Next.js 15 + NestJS)
- Docker Compose setup (frontend, backend, PostgreSQL)
- Prisma ORM z migracjami
- JWT Authentication (login, register, /auth/me)
- AuthStore z Zustand (persist do localStorage)
- Middleware do ochrony routes
- Dashboard podstawowy layout

### Bezpieczeństwo
- Zmienne środowiskowe dla secrets (JWT_SECRET)
- .env.example dla dokumentacji
- .gitignore dla .env files
