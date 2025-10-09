# Database Reset Guide

This guide explains how to reset the Finch database to start fresh with English default categories.

## When to Reset

Reset the database when you need to:
- Clear all test data
- Start fresh with English category names
- Test the application from scratch with a clean state

## Prerequisites

- Docker and Docker Compose installed
- PowerShell (Windows) or Bash (Linux/macOS)

## Reset Procedure

### Windows (PowerShell)

```powershell
# Run the reset script
.\reset-database.ps1
```

### Linux/macOS (Manual Steps)

```bash
# 1. Stop all containers
docker compose down

# 2. Remove database volume
docker volume rm finch_postgres_data

# 3. Start database
docker compose up -d db

# 4. Wait for database to be ready
sleep 5

# 5. Run migrations
docker compose exec backend npx prisma migrate deploy

# 6. Start all services
docker compose up -d
```

## What Happens During Reset

1. **Stops all Docker containers** - Gracefully shuts down the application
2. **Removes database volume** - Deletes all existing data (users, categories, transactions, budgets)
3. **Recreates database** - Starts with a clean PostgreSQL instance
4. **Runs migrations** - Applies all Prisma migrations to create tables
5. **Ready for use** - Application is ready with empty database

## After Reset

1. **Register a new user** - Create a test account at `/register`
2. **Default categories created** - New users automatically get these English categories:
   
   **Expenses:**
   - 🍽️ Food (UtensilsCrossed icon)
   - 🚗 Transport (Car icon)
   - 🎮 Entertainment (Gamepad2 icon)
   - ❤️ Health (Heart icon)
   - 📄 Bills (FileText icon)
   
   **Income:**
   - 💰 Salary (Wallet icon)
   - 💵 Other Income (DollarSign icon)

3. **Add transactions** - Start tracking your finances!

## Troubleshooting

### Database volume won't delete

If you get an error removing the volume:

```powershell
# Force stop all containers
docker compose kill

# Remove volume with force
docker volume rm finch_postgres_data -f
```

### Backend can't connect to database

Wait longer for the database to be ready:

```powershell
# Check database logs
docker compose logs db

# Restart backend
docker compose restart backend
```

### Migrations fail

Check if database is actually running:

```powershell
# Check container status
docker compose ps

# Check database logs
docker compose logs db -f
```

## Important Notes

⚠️ **Warning**: This operation is **irreversible**. All data will be permanently deleted:
- User accounts
- Categories
- Transactions
- Budgets
- Reports history

✅ **Safe for development**: This is intended for development and testing environments only.

🔒 **Production**: Never run this on a production database! Always backup before any major operations.

## Alternative: Manual Database Management

If you prefer manual control:

```powershell
# Access database shell
docker compose exec db psql -U Finch_user_db -d Finch_db

# List all tables
\dt

# Truncate specific tables (keeps structure)
TRUNCATE TABLE "Transaction" CASCADE;
TRUNCATE TABLE "Category" CASCADE;
TRUNCATE TABLE "Budget" CASCADE;
TRUNCATE TABLE "User" CASCADE;

# Exit
\q
```

## See Also

- [Docker Documentation](../DOCKER.md)
- [Database Schema](../docs/DATABASE.md)
- [Development Guide](../docs/technical/DEVELOPMENT_GUIDE.md)
