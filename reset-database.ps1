# Reset Database Script
# Drops all tables and re-runs migrations with English default categories

Write-Host "🗑️  Resetting Finch database..." -ForegroundColor Yellow
Write-Host ""

# Stop containers
Write-Host "⏸️  Stopping Docker containers..." -ForegroundColor Cyan
docker compose down

# Remove database volume
Write-Host "🗑️  Removing database volume..." -ForegroundColor Cyan
docker volume rm finch_postgres_data -ErrorAction SilentlyContinue

# Start database
Write-Host "🚀 Starting fresh database..." -ForegroundColor Cyan
docker compose up -d db

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Run migrations
Write-Host "🔄 Running Prisma migrations..." -ForegroundColor Cyan
docker compose exec backend npx prisma migrate deploy

Write-Host ""
Write-Host "✅ Database reset complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Start all services: docker compose up -d" -ForegroundColor White
Write-Host "   2. Register new test user to get English categories" -ForegroundColor White
Write-Host ""
