# Frontend - Tracker Kasy

Frontend aplikacji zbudowany z Next.js 14+, TypeScript i Tailwind CSS.

## 🚀 Szybki Start

### Lokalne Uruchomienie (bez Dockera)

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Skonfiguruj zmienne środowiskowe:**
   ```bash
   cp .env.example .env.local
   # Edytuj .env.local i ustaw NEXT_PUBLIC_API_URL
   ```

3. **Uruchom serwer deweloperski:**
   ```bash
   npm run dev
   ```

Frontend będzie dostępny pod adresem: `http://localhost:3000`

## 📁 Struktura Projektu

```
app/
├── (auth)/         # Strony autentykacji (login, register)
├── (dashboard)/    # Strony chronione (dashboard, transakcje, etc.)
├── layout.tsx      # Główny layout aplikacji
└── page.tsx        # Strona główna

components/
├── ui/             # Komponenty UI (Button, Input, Card, etc.)
├── forms/          # Formularze (TransactionForm, CategoryForm, etc.)
├── charts/         # Komponenty wykresów
└── layout/         # Komponenty layoutu (Header, Sidebar, etc.)

lib/
├── api/            # API client i funkcje komunikacji z backendem
├── stores/         # Zustand stores (auth, transactions, etc.)
└── utils.ts        # Utility functions

types/
└── index.ts        # TypeScript types i interfaces

hooks/              # Custom React hooks
```

## 🎨 Style i UI

Projekt używa **Tailwind CSS** do stylowania. Wszystkie komponenty są responsywne i dostosowane do urządzeń mobilnych.

### Kolory (do dostosowania w tailwind.config.ts):
- Primary: Niebieski
- Success: Zielony (przychody)
- Danger: Czerwony (wydatki)
- Neutralne: Szarości

## 📦 Główne Biblioteki

- **Next.js 14+**: Framework React z SSR
- **TypeScript**: Silne typowanie
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lekkie zarządzanie stanem
- **React Hook Form**: Obsługa formularzy
- **Recharts**: Biblioteka do wykresów

## 🔧 Skrypty NPM

```bash
# Uruchomienie w trybie deweloperskim
npm run dev

# Budowanie produkcyjne
npm run build

# Start produkcyjny
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🌐 Zmienne Środowiskowe

Zobacz `.env.example` dla pełnej listy wymaganych zmiennych.

Kluczowe zmienne:
- `NEXT_PUBLIC_API_URL`: URL backendu API

## 🐳 Docker

Frontend jest automatycznie budowany jako część `docker-compose.yml` w głównym katalogu projektu.

## 🧪 Testowanie

```bash
# Testy jednostkowe (do skonfigurowania)
npm run test

# Testy E2E (do skonfigurowania)
npm run test:e2e
```

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa na:
- Desktopach (1920px+)
- Laptopach (1024px - 1920px)
- Tabletach (768px - 1024px)
- Telefonach (320px - 768px)
