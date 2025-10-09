# 🐳 Docker - Documentation

This document contains detailed information about the Docker configuration and orchestration of the Finch application.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Configuration](#configuration)
- [Volumes and Data](#volumes-and-data)
- [Networking](#networking)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)

## Architecture

The application consists of three main containers:

### 1. **db** - PostgreSQL Database
- **Image:** `postgres:16-alpine`
- **Port:** 5432
- **Volume:** `Finch_pgdata`
- **Role:** Stores all application data

### 2. **backend** - NestJS API
- **Build:** `./backend/Dockerfile`
- **Port:** 3001
- **Dependencies:** Waits for `db` (health check)
- **Role:** REST API, business logic, authorization

### 3. **frontend** - Next.js App
- **Build:** `./frontend/Dockerfile`
- **Port:** 3000
- **Dependencies:** Waits for `backend`
- **Role:** User interface, SSR

## Configuration

### Environment Variables

#### Database (db)
```yaml
POSTGRES_USER: Finch_user_db
POSTGRES_PASSWORD: Finch_password_db
POSTGRES_DB: Finch_db
```

#### Backend
```yaml
DATABASE_URL: postgresql://Finch_user_db:Finch_password_db@db:5432/Finch_db?schema=public
JWT_SECRET: ${JWT_SECRET}  # Read from the .env file
JWT_EXPIRATION: 7d
PORT: 3001
NODE_ENV: production
FRONTEND_URL: http://localhost:3000
```

#### Frontend
```yaml
# Backend URL used by Next.js API Routes (server-side only)
BACKEND_API_URL: http://backend:3001
NODE_ENV: development  # or production
```

**Note:** The frontend uses Next.js API Routes as a proxy to the backend.
- The browser connects to `/api/*` (same origin, no CORS)
- Next.js API Routes make requests to `BACKEND_API_URL`
- We do not use `NEXT_PUBLIC_*` for the backend URL (as it would be embedded in the browser bundle)

### Security

**IMPORTANT:** In production:
1. Change `JWT_SECRET` to a strong, random string (min. 32 characters)
2. Change the database password (`POSTGRES_PASSWORD`)
3. Use secrets instead of environment variables for sensitive data
4. Consider using HTTPS (reverse proxy like Nginx/Traefik)

Generating a secure JWT_SECRET:
```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## Volumes and Data

### Volume for PostgreSQL

```yaml
volumes:
  pgdata:
    driver: local
    name: Finch_pgdata
```

Data is stored in the Docker volume `Finch_pgdata`. Location:
- **Linux:** `/var/lib/docker/volumes/Finch_pgdata/_data`
- **Windows:** `\\wsl$\docker-desktop-data\data\docker\volumes\Finch_pgdata\_data`
- **macOS:** `~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/volumes/Finch_pgdata/_data`

### Backup and Restore

#### Database Backup
```bash
# Simple backup
docker-compose exec db pg_dump -U Finch_user_db Finch > backup.sql

# Backup with compression
docker-compose exec db pg_dump -U Finch_user_db Finch | gzip > backup.sql.gz

# Backup with a timestamp
docker-compose exec db pg_dump -U Finch_user_db Finch > "backup_$(date +%Y%m%d_%H%M%S).sql"
```

#### Database Restore
```bash
# Restore from a file
docker-compose exec -T db psql -U Finch_user_db Finch < backup.sql

# Restore from a compressed file
gunzip < backup.sql.gz | docker-compose exec -T db psql -U Finch_user_db Finch

# Note: Restore will overwrite existing data!
```

#### Full Docker volume backup
```bash
# Backup the entire volume
docker run --rm -v Finch_pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pgdata_full_backup.tar.gz -C /data .

# Restore the volume
docker run --rm -v Finch_pgdata:/data -v $(pwd):/backup alpine tar xzf /backup/pgdata_full_backup.tar.gz -C /data
```

## Networking

### Docker Network

```yaml
networks:
  Finch_network:
    driver: bridge
    name: Finch_network
```

All containers communicate within the isolated `Finch_network`:
- **db** is accessible as `db:5432` (inside the network)
- **backend** is accessible as `backend:3001` (inside the network)
- **frontend** is accessible as `frontend:3000` (inside the network)

### Communication

```
frontend:3000  -->  backend:3001  -->  db:5432
     ↓                   ↓                ↓
localhost:3000    localhost:3001    localhost:5432
```

## Health Checks

### Database Health Check
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U Finch_user_db -d Finch"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Checks if PostgreSQL is ready to accept connections.

### Backend Health Check
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

Checks if the backend is responding to HTTP requests.

### Frontend Health Check
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

Checks if the frontend is responding to HTTP requests.

### Checking health check status
```bash
docker-compose ps
# Status: healthy or unhealthy
```

## Troubleshooting

### Problem: Containers won't start

**Diagnosis:**
```bash
docker-compose logs -f
```

**Common causes:**
1. Ports are already in use (3000, 3001, 5432)
2. Insufficient memory
3. Errors in environment variables

**Solution:**
```bash
# Check for used ports (Windows)
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
netstat -ano | findstr ":5432"

# Change ports in docker-compose.yml if they are occupied
```

### Problem: Backend cannot connect to the database

**Diagnosis:**
```bash
docker-compose logs backend
```

**Check:**
1. If the `db` container is `healthy`: `docker-compose ps`
2. If the `DATABASE_URL` is correct
3. If the username and password match

**Solution:**
```bash
# Restart the database
docker-compose restart db

# Check if the database is working
docker-compose exec db psql -U Finch_user_db -d Finch -c "SELECT 1;"
```

### Problem: Frontend cannot connect to the backend

**Symptoms:**
- NetworkError in the browser
- 500/502 errors in API calls

**Check:**
1. If the backend is `healthy`: `docker-compose ps`
2. If Next.js API Routes are working: `curl http://localhost:3000/api/auth/me` (should return 401)
3. If `BACKEND_API_URL` is set correctly in `.env.local` (Docker: `http://backend:3001`)

**Architecture (as of October 2025):**
```
Browser → /api/* (Next.js API Route, localhost:3000)
         ↓
Next.js Server → http://backend:3001 (Docker internal)
```

**Solution:**
```bash
# Check if the backend is responding from within the frontend container
docker exec Finch_frontend wget -O- http://backend:3001/

# Check the API Routes logs
docker logs Finch_frontend --tail 50

# Restart the frontend
docker-compose restart frontend
```

### Problem: Prisma migrations do not run

**Diagnosis:**
```bash
docker-compose logs backend | grep -i prisma
```

**Solution:**
```bash
# Manually run migrations
docker-compose exec backend npx prisma migrate deploy

# Reset the database (WARNING: deletes data!)
docker-compose exec backend npx prisma migrate reset
```

### Problem: Slow image builds

**Optimization:**
```bash
# Build with cache
docker-compose build --parallel

# Build without cache (clean build)
docker-compose build --no-cache --parallel

# Remove unused images
docker image prune -a
```

### Problem: Not enough disk space

**Cleanup:**
```bash
# Remove unused images, containers, networks
docker system prune -a

# Remove all volumes (WARNING: deletes data!)
docker volume prune
```

## Helper Commands

### Useful aliases
```bash
# Add to ~/.bashrc or ~/.zshrc (Linux/macOS)
alias tk-up='docker-compose up -d'
alias tk-down='docker-compose down'
alias tk-restart='docker-compose restart'
alias tk-logs='docker-compose logs -f'
alias tk-ps='docker-compose ps'
```

```powershell
# Add to $PROFILE (PowerShell)
function tk-up { docker-compose up -d }
function tk-down { docker-compose down }
function tk-restart { docker-compose restart }
function tk-logs { docker-compose logs -f }
function tk-ps { docker-compose ps }
```

### Resource Monitoring
```bash
# CPU and memory usage
docker stats

# Real-time logs
docker-compose logs -f --tail=100

# Check image sizes
docker images | grep Finch
```

## Production

### Production Recommendations:

1. **Use Docker Secrets**
   ```yaml
   secrets:
     db_password:
       file: ./secrets/db_password.txt
   ```

2. **Add a Reverse Proxy (Nginx/Traefik)**
   - HTTPS/SSL
   - Load balancing
   - Rate limiting

3. **Monitoring**
   - Prometheus + Grafana
   - Loki for logs
   - Alertmanager

4. **Automatic Backups**
   - Cron job for regular backups
   - Store in the cloud (S3, Azure Blob)

5. **Resource Limits**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

## Support

If you encounter problems:
1. Check the [Issues on GitHub](https://github.com/PeterPage2115/Finch/issues)
2. Read the [FAQ](./FAQ.md)
3. Create a new Issue with logs: `docker-compose logs > logs.txt`

---

**Last updated:** October 2, 2025