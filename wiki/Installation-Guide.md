# Installation Guide

Complete guide to installing and setting up Finch on your own server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** 20.10 or higher
- **Docker Compose** 2.0 or higher
- **Git** (to clone the repository)

### System Requirements

**Minimum:**
- 2 CPU cores
- 2 GB RAM
- 10 GB disk space

**Recommended:**
- 4 CPU cores
- 4 GB RAM
- 20 GB disk space

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/PeterPage2115/Finch.git
cd Finch
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your preferred text editor:

```bash
nano .env
```

**Required Configuration:**

```env
# Database
POSTGRES_USER=finch_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=finch_db

# Backend
DATABASE_URL="postgresql://finch_user:your_secure_password_here@db:5432/finch_db?schema=public"
JWT_SECRET=your_jwt_secret_min_32_characters_long
JWT_EXPIRES_IN=7d
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**⚠️ Security Note:** Change ALL default passwords and secrets!

### 3. Generate Secure Secrets

Generate a secure JWT secret:

```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 4. Start the Application

```bash
docker-compose up -d
```

This will:
- Download necessary Docker images
- Create and start all containers (database, backend, frontend)
- Run database migrations
- Seed initial data (optional)

### 5. Verify Installation

Check that all containers are running:

```bash
docker-compose ps
```

You should see 3 containers:
- `finch_db` (PostgreSQL)
- `finch_backend` (NestJS API)
- `finch_frontend` (Next.js)

### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 🔐 First Login

Create your account:
1. Click "Sign Up" on the homepage
2. Enter your email and password
3. Start tracking your finances!

## 📊 Database Seeding (Optional)

To populate the database with sample data for testing:

```bash
docker-compose exec backend npm run seed
```

**Test Credentials:**
- Email: `test@example.com`
- Password: `Test123!`

## 🔄 Updates

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000, 3001, or 5432 are already in use:

1. Edit `docker-compose.yml`
2. Change the port mappings:

```yaml
services:
  frontend:
    ports:
      - "8080:3000"  # Change 3000 to 8080
```

### Database Connection Issues

If the backend can't connect to the database:

1. Check `DATABASE_URL` in `.env` matches your credentials
2. Ensure the database container is healthy:

```bash
docker-compose logs db
```

### Permission Issues

On Linux, you may need to fix file permissions:

```bash
sudo chown -R $USER:$USER .
```

## 📖 Next Steps

- [Configuration Guide](Configuration) - Customize your installation
- [Backup & Restore](Backup-Restore) - Protect your data
- [Docker Configuration](Docker-Configuration) - Advanced setup

## 🆘 Need Help?

- [FAQ](FAQ) - Common questions
- [Troubleshooting](Troubleshooting) - Detailed solutions
- [GitHub Issues](https://github.com/PeterPage2115/Finch/issues) - Report problems

---

**Last Updated:** October 8, 2025
