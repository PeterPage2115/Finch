# 🐳 Docker - Dokumentacja

Ten dokument zawiera szczegółowe informacje o konfiguracji Docker i orkiestracji aplikacji Tracker Kasy.

## 📋 Spis Treści

- [Architektura](#architektura)
- [Konfiguracja](#konfiguracja)
- [Volumes i Dane](#volumes-i-dane)
- [Sieci](#sieci)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)

## Architektura

Aplikacja składa się z trzech głównych kontenerów:

### 1. **db** - PostgreSQL Database
- **Obraz:** `postgres:16-alpine`
- **Port:** 5432
- **Volume:** `tracker_kasy_pgdata`
- **Rola:** Przechowywanie wszystkich danych aplikacji

### 2. **backend** - NestJS API
- **Build:** `./backend/Dockerfile`
- **Port:** 3001
- **Zależności:** Czeka na `db` (health check)
- **Rola:** REST API, logika biznesowa, autoryzacja

### 3. **frontend** - Next.js App
- **Build:** `./frontend/Dockerfile`
- **Port:** 3000
- **Zależności:** Czeka na `backend`
- **Rola:** Interfejs użytkownika, SSR

## Konfiguracja

### Zmienne Środowiskowe

#### Database (db)
```yaml
POSTGRES_USER: tracker_user
POSTGRES_PASSWORD: tracker_password
POSTGRES_DB: tracker_kasy
```

#### Backend
```yaml
DATABASE_URL: postgresql://tracker_user:tracker_password@db:5432/tracker_kasy?schema=public
JWT_SECRET: ${JWT_SECRET}  # Odczytywane z pliku .env
JWT_EXPIRATION: 7d
PORT: 3001
NODE_ENV: production
FRONTEND_URL: http://localhost:3000
```

#### Frontend
```yaml
NEXT_PUBLIC_API_URL: http://localhost:3001
NODE_ENV: production
```

### Bezpieczeństwo

**WAŻNE:** W produkcji:
1. Zmień `JWT_SECRET` na silny, losowy ciąg znaków (min. 32 znaki)
2. Zmień hasło do bazy danych (`POSTGRES_PASSWORD`)
3. Użyj secrets zamiast zmiennych środowiskowych dla wrażliwych danych
4. Rozważ użycie HTTPS (reverse proxy jak Nginx/Traefik)

Generowanie bezpiecznego JWT_SECRET:
```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## Volumes i Dane

### Volume dla PostgreSQL

```yaml
volumes:
  pgdata:
    driver: local
    name: tracker_kasy_pgdata
```

Dane są przechowywane w Docker volume `tracker_kasy_pgdata`. Lokalizacja:
- **Linux:** `/var/lib/docker/volumes/tracker_kasy_pgdata/_data`
- **Windows:** `\\wsl$\docker-desktop-data\data\docker\volumes\tracker_kasy_pgdata\_data`
- **macOS:** `~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/volumes/tracker_kasy_pgdata/_data`

### Backup i Restore

#### Backup bazy danych
```bash
# Prosty backup
docker-compose exec db pg_dump -U tracker_user tracker_kasy > backup.sql

# Backup z kompresją
docker-compose exec db pg_dump -U tracker_user tracker_kasy | gzip > backup.sql.gz

# Backup z timestampem
docker-compose exec db pg_dump -U tracker_user tracker_kasy > "backup_$(date +%Y%m%d_%H%M%S).sql"
```

#### Restore bazy danych
```bash
# Restore z pliku
docker-compose exec -T db psql -U tracker_user tracker_kasy < backup.sql

# Restore z kompresją
gunzip < backup.sql.gz | docker-compose exec -T db psql -U tracker_user tracker_kasy

# Uwaga: Restore nadpisze istniejące dane!
```

#### Pełny backup Docker volume
```bash
# Backup całego volume
docker run --rm -v tracker_kasy_pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pgdata_full_backup.tar.gz -C /data .

# Restore volume
docker run --rm -v tracker_kasy_pgdata:/data -v $(pwd):/backup alpine tar xzf /backup/pgdata_full_backup.tar.gz -C /data
```

## Sieci

### Sieć Docker

```yaml
networks:
  tracker_network:
    driver: bridge
    name: tracker_kasy_network
```

Wszystkie kontenery komunikują się w izolowanej sieci `tracker_kasy_network`:
- **db** dostępny jako `db:5432` (wewnątrz sieci)
- **backend** dostępny jako `backend:3001` (wewnątrz sieci)
- **frontend** dostępny jako `frontend:3000` (wewnątrz sieci)

### Komunikacja

```
frontend:3000  -->  backend:3001  -->  db:5432
     ↓                   ↓                ↓
localhost:3000    localhost:3001    localhost:5432
```

## Health Checks

### Database Health Check
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U tracker_user -d tracker_kasy"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Sprawdza czy PostgreSQL jest gotowy do przyjmowania połączeń.

### Backend Health Check
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

Sprawdza czy backend odpowiada na żądania HTTP.

### Frontend Health Check
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

Sprawdza czy frontend odpowiada na żądania HTTP.

### Sprawdzenie statusu health checks
```bash
docker-compose ps
# Status: healthy (zdrowy) lub unhealthy (niezdrowy)
```

## Troubleshooting

### Problem: Kontenery nie startują

**Diagnoza:**
```bash
docker-compose logs -f
```

**Częste przyczyny:**
1. Porty zajęte (3000, 3001, 5432)
2. Niewystarczająca ilość pamięci
3. Błędy w zmiennych środowiskowych

**Rozwiązanie:**
```bash
# Sprawdź zajęte porty (Windows)
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
netstat -ano | findstr ":5432"

# Zmień porty w docker-compose.yml jeśli zajęte
```

### Problem: Backend nie może połączyć się z bazą

**Diagnoza:**
```bash
docker-compose logs backend
```

**Sprawdź:**
1. Czy kontener `db` jest `healthy`: `docker-compose ps`
2. Czy `DATABASE_URL` jest poprawny
3. Czy użytkownik i hasło się zgadzają

**Rozwiązanie:**
```bash
# Zrestartuj bazę danych
docker-compose restart db

# Sprawdź czy baza danych działa
docker-compose exec db psql -U tracker_user -d tracker_kasy -c "SELECT 1;"
```

### Problem: Frontend nie może połączyć się z backendem

**Sprawdź:**
1. Czy backend jest `healthy`: `docker-compose ps`
2. Czy `NEXT_PUBLIC_API_URL` wskazuje na `http://localhost:3001`

**Rozwiązanie:**
```bash
# Sprawdź czy backend odpowiada
curl http://localhost:3001/

# Zrestartuj frontend
docker-compose restart frontend
```

### Problem: Migracje Prisma nie wykonują się

**Diagnoza:**
```bash
docker-compose logs backend | grep -i prisma
```

**Rozwiązanie:**
```bash
# Ręczne wykonanie migracji
docker-compose exec backend npx prisma migrate deploy

# Reset bazy (UWAGA: usuwa dane!)
docker-compose exec backend npx prisma migrate reset
```

### Problem: Wolne budowanie obrazów

**Optymalizacja:**
```bash
# Build z cache
docker-compose build --parallel

# Build bez cache (czysty build)
docker-compose build --no-cache --parallel

# Usuń nieużywane obrazy
docker image prune -a
```

### Problem: Brak miejsca na dysku

**Czyszczenie:**
```bash
# Usuń nieużywane obrazy, kontenery, sieci
docker system prune -a

# Usuń wszystkie volume (UWAGA: usuwa dane!)
docker volume prune
```

## Komendy Pomocnicze

### Przydatne aliasy
```bash
# Dodaj do ~/.bashrc lub ~/.zshrc (Linux/macOS)
alias tk-up='docker-compose up -d'
alias tk-down='docker-compose down'
alias tk-restart='docker-compose restart'
alias tk-logs='docker-compose logs -f'
alias tk-ps='docker-compose ps'
```

```powershell
# Dodaj do $PROFILE (PowerShell)
function tk-up { docker-compose up -d }
function tk-down { docker-compose down }
function tk-restart { docker-compose restart }
function tk-logs { docker-compose logs -f }
function tk-ps { docker-compose ps }
```

### Monitorowanie zasobów
```bash
# Użycie CPU i pamięci
docker stats

# Logi w czasie rzeczywistym
docker-compose logs -f --tail=100

# Sprawdzenie rozmiary obrazów
docker images | grep tracker_kasy
```

## Produkcja

### Rekomendacje dla produkcji:

1. **Użyj Docker Secrets**
   ```yaml
   secrets:
     db_password:
       file: ./secrets/db_password.txt
   ```

2. **Dodaj Reverse Proxy (Nginx/Traefik)**
   - HTTPS/SSL
   - Load balancing
   - Rate limiting

3. **Monitorowanie**
   - Prometheus + Grafana
   - Loki dla logów
   - Alertmanager

4. **Backup automatyczny**
   - Cron job dla regularnych backupów
   - Przechowywanie w cloud (S3, Azure Blob)

5. **Ograniczenia zasobów**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

## Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź [Issues na GitHubie](https://github.com/[user]/Tracker_kasy/issues)
2. Przeczytaj [FAQ](./FAQ.md)
3. Stwórz nowy Issue z logami: `docker-compose logs > logs.txt`

---

**Ostatnia aktualizacja:** 2 października 2025
