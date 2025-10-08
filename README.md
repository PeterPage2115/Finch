# Finch - Personal Finance Tracker

> 💡 **Note:** UI is currently in Polish. English internationalization (i18n) coming in v1.1

**Open-source, self-hosted web application for personal finance management**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🎉 What's New in v1.0 (January 2025)

- ✅ **Modern icon system** - Lucide icons for professional look
- ✅ **Full dark mode** - Complete dark theme support
- ✅ **Enhanced charts** - Interactive CategoryPieChart with transaction details
- ✅ **Category details modal** - Click chart segments to view transactions
- ✅ **Optimized architecture** - Zustand store persistence, API client refactoring
- ✅ **Unit tests** - 88 backend tests (100% service coverage)
- ✅ **Zero vulnerabilities** - npm audit clean
- ✅ **Complete documentation** - 800+ lines of docs, CHANGELOG, API reference

📖 **Full changelog:** [CHANGELOG.md](./CHANGELOG.md)

## � Screenshots

<div align="center">
  <img src="screenshots/homepage.png" alt="Homepage" width="800"/>
  <p><em>Clean landing page with key features</em></p>
  
  <img src="screenshots/dashboard.png" alt="Dashboard" width="800"/>
  <p><em>Overview dashboard with statistics and recent transactions</em></p>
</div>

## �📋 About The Project

Finch is a modern web application designed for simplicity and easy self-hosting. Track income, expenses, categorize transactions, set budgets, and generate financial reports.

### ✨ Key Features

- 🔒 **Privacy** - Your data stays with you (self-hosted)
- 🐳 **Easy deployment** - One command: `docker-compose up`
- 📊 **Intuitive interface** - Clean dashboard with charts
- 💼 **Budget management** - Set limits and monitor expenses
- 📈 **Reports** - Analyze your finances over time

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL 17
- **ORM:** Prisma
- **Deployment:** Docker & Docker Compose

📖 **Technical documentation:** [docs/technical/](./docs/technical/)

## 🚀 Quick Start

### Requirements

- Docker 20.10+
- Docker Compose 2.0+
- Git

### Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/PeterPage2115/Finch.git
   cd Finch
   ```

2. **Configure environment (optional):**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # IMPORTANT: Change JWT_SECRET in production!
   # Generate with: openssl rand -base64 32
   ```

3. **Start application:**
   ```bash
   docker-compose up -d
   ```

   First run will:
   - Pull PostgreSQL image
   - Build frontend & backend images
   - Start all containers
   - Run database migrations automatically

   **Takes 2-5 minutes on first run.**

4. **Check status:**
   ```bash
   docker-compose ps
   ```

   All services should be `healthy` or `running`.

5. **Open in browser:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:3001](http://localhost:3001)
   - **Database:** `localhost:5432`

### First Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Register" and create account
3. Log in to the application
4. Start tracking your finances!

<details>
<summary>🛑 Stopping Application</summary>

```bash
# Stop containers (data persists)
docker-compose stop

# Stop and remove containers (data persists in volume)
docker-compose down

# WARNING: This will DELETE ALL DATA!
docker-compose down -v
```
</details>

<details>
<summary>📋 Logs & Debugging</summary>

```bash
# All logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Check health status
docker-compose ps
```
</details>

<details>
<summary>🔄 Updates</summary>

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```
</details>

## 🏗️ Architecture

<details>
<summary>📊 System Components</summary>

```
┌─────────────────────────────────────────────────────────┐
│                        User                              │
│                      (Browser)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP (port 3000)
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Frontend (Next.js)                      │
│  - Server-Side Rendering                                 │
│  - Tailwind CSS, Zustand                                 │
│  - React Hook Form, Recharts                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (port 3001)
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Backend (NestJS)                        │
│  - RESTful API                                           │
│  - JWT Authentication                                    │
│  - Prisma ORM                                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ PostgreSQL Protocol (port 5432)
                     │
┌────────────────────▼────────────────────────────────────┐
│                Database (PostgreSQL)                     │
│  - Users, Transactions                                   │
│  - Categories, Budgets                                   │
└──────────────────────────────────────────────────────────┘
```
</details>

<details>
<summary>📁 Project Structure</summary>

```
Finch/
├── backend/              # Backend (NestJS)
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # User management
│   │   ├── transactions/ # Financial transactions
│   │   ├── categories/   # Categories
│   │   ├── budgets/      # Budgets
│   │   └── prisma.service.ts
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── Dockerfile
│
├── frontend/             # Frontend (Next.js)
│   ├── app/              # App Router (Next.js 15)
│   ├── components/       # React components
│   ├── lib/              # Utilities & stores
│   ├── types/            # TypeScript types
│   └── Dockerfile
│
├── docs/                 # Documentation
├── docker-compose.yml    # Docker orchestration
└── README.md
```
</details>

## 📚 Documentation

Comprehensive documentation available in [`docs/`](./docs/) folder:

- [**API Reference**](./docs/API.md) - Complete REST API endpoints documentation
- [**Database Schema**](./docs/DATABASE.md) - Models, relations, migrations, sample queries
- [**Docker & Orchestration**](./docs/DOCKER.md) - Detailed Docker configuration guide
- [Application Architecture](./docs/architecture.md) *(coming soon)*
- [Developer Guide](./docs/developer-guide.md) *(coming soon)*

<details>
<summary>🔌 Ports & Access</summary>

| Service    | Port  | URL                          | Description                   |
|------------|-------|------------------------------|-------------------------------|
| Frontend   | 3000  | http://localhost:3000        | User interface                |
| Backend    | 3001  | http://localhost:3001        | REST API                      |
| PostgreSQL | 5432  | localhost:5432               | Database                      |

**Default database credentials:**
- Host: `localhost` (or `db` inside Docker network)
- Port: `5432`
- Database: `tracker_kasy`
- User: `tracker_user`
- Password: `tracker_password`
</details>

<details>
<summary>💾 Docker Volumes & Data</summary>

Application data is stored in Docker volume `tracker_kasy_pgdata`. Data persists even after `docker-compose down`.

**Database backup:**
```bash
docker-compose exec db pg_dump -U tracker_user tracker_kasy > backup.sql
```

**Database restore:**
```bash
docker-compose exec -T db psql -U tracker_user tracker_kasy < backup.sql
```
</details>

## 🧪 Local Development

<details>
<summary>⚙️ Setup without Docker</summary>

If you want to develop without Docker:

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
</details>

<details>
<summary>🧪 Running Tests</summary>

```bash
# Backend - Unit Tests
cd backend
npm test                    # All tests
npm test -- --coverage      # With coverage report
npm test -- auth.service    # Specific file

# Backend - E2E Tests
npm run test:e2e

# Backend - Test Results (v1.0)
# ✅ 88 tests passing
# ✅ Coverage: ~27% (focused on business logic)
# ✅ Services: 100% method coverage
```

**Test Suites:**
- `auth.service.spec.ts` - Authentication (11 tests)
- `transactions.service.spec.ts` - Transactions CRUD (21 tests)
- `categories.service.spec.ts` - Categories management (18 tests)
- `budgets.service.spec.ts` - Budgets & progress (21 tests)
- `reports.service.spec.ts` - Reports & analytics (17 tests)
</details>

<details>
<summary>🔒 Security</summary>

- 🔐 **JWT Authentication** - Secure session tokens
- 🛡️ **Password Hashing** - bcrypt with salt rounds
- 🚫 **SQL Injection Protection** - Prisma ORM
- 🔍 **Input Validation** - class-validator DTOs
- 🧹 **XSS Protection** - Next.js auto-escaping
- 📦 **Dependency Audit** - 0 vulnerabilities (npm audit)
- 🎯 **User-scoped queries** - Every endpoint verifies userId
</details>

## 🤝 Contributing

Want to help improve Finch? Great! 

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with these amazing open-source technologies:
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

Questions? Suggestions? Open an [Issue](https://github.com/PeterPage2115/Finch/issues)!

---

**Built with ❤️ for the open-source community**
