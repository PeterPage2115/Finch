# Backend Scripts

This directory contains utility scripts for backend development and testing.

---

## 📜 Available Scripts

### `seed-test-data.ps1`

**Purpose:** Seeds the database with sample transactions for testing and demo purposes.

**Usage:**
```powershell
# From project root
.\backend\scripts\seed-test-data.ps1
```

**Prerequisites:**
- Application running (`docker-compose up -d`)
- User account created (demo@tracker.com / Demo123!)
- Backend accessible at http://localhost:3001

**What it does:**
1. Logs in as demo@tracker.com
2. Fetches existing categories for the user
3. Creates 3 months of sample transactions
4. Generates realistic income and expense patterns

**Sample data includes:**
- Monthly salary (income)
- Daily expenses (food, transport, entertainment)
- Weekly expenses (groceries, bills)
- Random amounts and dates

**Use cases:**
- Testing reports with realistic data
- Demo environment setup
- UI/UX testing with populated dashboard
- Performance testing with larger datasets

**Notes:**
- Creates ~90 transactions (30 per month × 3 months)
- Safe to run multiple times (creates new transactions each time)
- Use `reset-database.ps1` to clear data and start fresh

---

## 🔧 Future Scripts

### `migrate-emoji-to-lucide.ts`

Migration script for converting emoji icons to Lucide icon names. Already executed in production.

---

## 📝 Adding New Scripts

When adding new utility scripts:

1. **Name clearly:** Use kebab-case (e.g., `backup-database.ps1`)
2. **Document here:** Add entry to this README
3. **Add comments:** Explain what the script does
4. **Test locally:** Before committing
5. **Consider portability:** PowerShell for Windows, Bash for Linux/macOS

---

**Last Updated:** October 9, 2025
