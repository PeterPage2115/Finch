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
   # Edytuj .env.local i ustaw BACKEND_API_URL
   ```

3. **Uruchom serwer deweloperski:**
   ```bash
   npm run dev
   ```

Frontend będzie dostępny pod adresem: `http://localhost:3000`

## 📁 Struktura Projektu

```
app/
├── api/            # Next.js API Routes (proxy do backendu)
│   └── auth/       # Auth endpoints (login, register, me)
├── login/          # Strona logowania
├── register/       # Strona rejestracji
├── dashboard/      # Dashboard (chroniony)
├── layout.tsx      # Główny layout aplikacji
├── middleware.ts   # Next.js middleware (ochrona tras)
└── page.tsx        # Strona główna

components/
└── ...             # Komponenty UI (będą dodane w kolejnych fazach)

lib/
├── api/            # API client (komunikacja z Next.js API Routes)
│   ├── client.ts   # Generic API client
│   └── authClient.ts # Auth API wrapper
├── stores/         # Zustand stores
│   └── authStore.ts # Auth state management
└── utils.ts        # Utility functions

types/
└── index.ts        # TypeScript types i interfaces
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

**Kluczowe zmienne:**

- **`BACKEND_API_URL`** (server-side only): URL backendu używany przez Next.js API Routes
  - Lokalnie: `http://localhost:3001`
  - Docker: `http://backend:3001`

**Ważne:** Nie używamy `NEXT_PUBLIC_*` dla backend URL, ponieważ:
- `NEXT_PUBLIC_*` są embedowane w browser bundle
- Browser nie ma dostępu do Docker internal hostnames
- Next.js API Routes działają jako proxy (server-side → backend)

**Architektura:**
```
Browser → /api/auth/* (Next.js API Route, same origin)
         ↓
Next.js Server → http://backend:3001/auth/* (Docker internal)
```

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
