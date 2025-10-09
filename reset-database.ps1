# Reset Database Script
# Drops all tables, re-runs migrations, and seeds the database.

Write-Host "[*] Resetting Finch database..." -ForegroundColor Yellow
Write-Host ""

# Stop containers
Write-Host "[*] Stopping Docker containers..." -ForegroundColor Cyan
docker compose down

# Rebuild backend image with latest code
Write-Host "[*] Rebuilding backend image with latest code..." -ForegroundColor Cyan
docker compose build backend

# Remove the correct database volume (name from docker-compose.yml)
Write-Host "[*] Removing database volume (Finch_pgdata)..." -ForegroundColor Cyan
docker volume rm Finch_pgdata -f

# Start the database container only
Write-Host "[*] Starting a fresh database..." -ForegroundColor Cyan
docker compose up -d db

# Wait for the database to become healthy, checking its status
Write-Host "[*] Waiting for the database to be ready..." -ForegroundColor Cyan
$maxRetries = 15
$retryInterval = 2 # seconds
$retries = 0

while ($retries -lt $maxRetries) {
    # Inspect the health status of the 'db' container
    $healthStatus = docker inspect --format='{{.State.Health.Status}}' Finch_db 2>$null
    
    if ($healthStatus -eq "healthy") {
        Write-Host "[OK] Database is healthy and ready!" -ForegroundColor Green
        break
    }
    
    Write-Host "    (status: $healthStatus, waiting $retryInterval seconds...)" -ForegroundColor DarkGray
    Start-Sleep -Seconds $retryInterval
    $retries++
}

if ($retries -eq $maxRetries) {
    Write-Host "[ERROR] Database failed to become healthy. Aborting." -ForegroundColor Red
    exit 1
}

# Start backend to run migrations
Write-Host "[*] Starting backend service..." -ForegroundColor Cyan
docker compose up -d backend

# Wait a bit for backend to be ready
Write-Host "[*] Waiting for backend to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Run Prisma migrations
Write-Host "[*] Running Prisma migrations..." -ForegroundColor Cyan
docker compose exec backend npx prisma migrate deploy

# Seed is not needed - categories are created automatically on user registration
Write-Host ""
Write-Host "[SUCCESS] Database reset successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start frontend: docker compose up -d frontend" -ForegroundColor White
Write-Host "  2. Register a new account at http://localhost:3000/register" -ForegroundColor White
Write-Host "  3. The new account will have default English categories:" -ForegroundColor White
Write-Host "     - Food, Transport, Entertainment, Health, Bills" -ForegroundColor DarkGray
Write-Host "     - Salary, Other Income" -ForegroundColor DarkGray
Write-Host ""
