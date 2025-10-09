# Frontend - Finch

Frontend application built with Next.js 14+, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Local Development (without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set BACKEND_API_URL
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## 📁 Project Structure

```
app/
├── api/            # Next.js API Routes (proxy to the backend)
│   └── auth/       # Auth endpoints (login, register, me)
├── login/          # Login page
├── register/       # Registration page
├── dashboard/      # Dashboard (protected)
├── layout.tsx      # Application shell
├── middleware.ts   # Next.js middleware (route protection)
└── page.tsx        # Landing page

components/
└── ...             # UI components (added iteratively)

lib/
├── api/            # API client (communication with Next.js API Routes)
│   ├── client.ts   # Generic API client
│   └── authClient.ts # Auth API wrapper
├── stores/         # Zustand stores
│   └── authStore.ts # Auth state management
└── utils.ts        # Utility functions

types/
└── index.ts        # TypeScript types and interfaces
```

## 🎨 Styling and UI

The project uses **Tailwind CSS** for styling. Every component is responsive and mobile-friendly.

### Color palette (configured in `tailwind.config.ts`):
- Primary: Blue
- Success: Green (income)
- Danger: Red (expenses)
- Neutral: Grays

## 📦 Core Libraries

- **Next.js 14+**: React framework with SSR
- **TypeScript**: Strong static typing
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling
- **Recharts**: Charting library

## 🔧 NPM Scripts

```bash
# Development mode
npm run dev

# Production build
npm run build

# Production start
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🌐 Environment Variables

See `.env.example` for the full list of required variables.

**Key variables:**

- **`BACKEND_API_URL`** (server-side only): Backend URL used by Next.js API Routes
  - Local: `http://localhost:3001`
  - Docker: `http://backend:3001`

**Important:** We don't expose the backend URL via `NEXT_PUBLIC_*` because:
- `NEXT_PUBLIC_*` values are embedded in the browser bundle
- The browser cannot resolve Docker internal hostnames
- Next.js API Routes act as a proxy (server-side → backend)

**Architecture:**
```
Browser → /api/auth/* (Next.js API Route, same origin)
         ↓
Next.js Server → http://backend:3001/auth/* (Docker internal)
```

## 🐳 Docker

The frontend is built automatically as part of the project-level `docker-compose.yml`.

## 🧪 Testing

```bash
# Unit tests (to be configured)
npm run test

# E2E tests (to be configured)
npm run test:e2e
```

## 📱 Responsiveness

The application is fully responsive and optimized for:
- Desktops (1920px+)
- Laptops (1024px - 1920px)
- Tablets (768px - 1024px)
- Phones (320px - 768px)
