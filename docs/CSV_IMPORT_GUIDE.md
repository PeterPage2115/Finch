# CSV Import Guide

## Overview

Finch supports bulk importing transactions from CSV (Comma-Separated Values) files. This feature allows you to quickly migrate data from other financial apps or import bank statements.

## CSV File Format

### Required Columns

Your CSV file must contain the following columns (in any order):

| Column | Description | Format | Example |
|--------|-------------|--------|---------|
| `date` | Transaction date | `YYYY-MM-DD` (ISO 8601) | `2025-01-15` |
| `amount` | Transaction amount | Positive number | `50.00` or `50` |
| `type` | Transaction type | `INCOME` or `EXPENSE` | `EXPENSE` |
| `category` | Category name | Text (case-insensitive) | `Food` |
| `description` | Description (optional) | Text | `Grocery shopping` |

### Sample CSV File

```csv
date,amount,type,category,description
2025-01-15,50.00,EXPENSE,Food,Grocery shopping
2025-01-16,1500.00,INCOME,Salary,Monthly paycheck
2025-01-17,30.50,EXPENSE,Transport,Bus tickets
2025-01-18,120.00,EXPENSE,Entertainment,Concert tickets
2025-01-19,25.75,EXPENSE,Food,Restaurant dinner
```

### Important Notes

1. **Header Row Required**: First row must contain column names
2. **Date Format**: Use ISO 8601 format (`YYYY-MM-DD`) only
3. **Amount**: Use numbers with optional decimal point (`.` not `,`)
4. **Type**: Must be exactly `INCOME` or `EXPENSE` (case-sensitive)
5. **Category**: Can be existing or new (auto-created if not found)
6. **File Size**: Maximum 5 MB per file
7. **Encoding**: UTF-8 encoding (supports international characters)

## How to Import

### Step 1: Prepare Your CSV File

1. Create or export your transactions to a CSV file
2. Ensure column names match exactly: `date`, `amount`, `type`, `category`, `description`
3. Verify date format is `YYYY-MM-DD`
4. Check file size is under 5 MB

### Step 2: Upload to Finch

1. Log in to your Finch account
2. Go to the **Dashboard** page
3. Click the **"Import CSV"** button (green button next to "Add transaction")
4. Select your CSV file
5. Wait for upload and processing (typically 1-5 seconds)

### Step 3: Review Results

After import, you'll see a results modal showing:

- ✅ **Successfully Imported**: Number of transactions added
- ❌ **Failed Rows**: Number of rows with errors
- 🏷️ **Auto-created Categories**: New categories created during import
- 📋 **Error Details**: Specific validation errors for failed rows (if any)

## Features

### Duplicate Detection

Finch automatically detects and skips duplicate transactions based on:
- Transaction date
- Amount
- Description

If a transaction with the same date, amount, and description already exists for your account, it will be skipped to prevent duplicates.

### Auto-Create Categories

If a category name in your CSV doesn't exist in your account:
- Finch will automatically create it
- Category type (INCOME/EXPENSE) will match the transaction type
- Case-insensitive matching (e.g., "food", "Food", "FOOD" are the same)
- New categories will appear in the results modal

### Partial Imports

If some rows have errors:
- Valid rows will be imported successfully
- Invalid rows will be skipped
- You'll see detailed error messages for each failed row
- You can fix the CSV and re-import failed rows

### UTF-8 Support

Finch supports international characters (UTF-8 encoding):
- Polish: Żywność, Różą
- German: Übung, Größe
- Spanish: Niño, Año
- And many more!

## Common Validation Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `Invalid date format` | Date not in `YYYY-MM-DD` format | Use `2025-01-15` format |
| `Amount must be a positive number` | Amount is zero or negative | Use positive numbers only |
| `Invalid transaction type` | Type is not `INCOME` or `EXPENSE` | Use exact values (case-sensitive) |
| `Category name cannot be empty` | Missing category value | Add category name |
| `Duplicate transaction detected` | Transaction already exists | Skip or modify to make unique |

## Tips & Best Practices

### ✅ Do

- Use a spreadsheet program (Excel, Google Sheets) to prepare data
- Save/export as CSV with UTF-8 encoding
- Keep file size under 5 MB (split large files if needed)
- Verify date format before uploading
- Test with a small sample first (5-10 rows)

### ❌ Don't

- Use Excel date format (e.g., `15/01/2025` or `01-15-2025`)
- Include currency symbols in amounts (e.g., `$50.00` or `50 PLN`)
- Use comma as decimal separator (e.g., `50,00` → use `50.00`)
- Upload files larger than 5 MB
- Include extra columns (they'll be ignored, but keep it clean)

## Example: Converting from Bank Statement

### Before (Bank Export)

```csv
Date,Description,Debit,Credit
15/01/2025,Grocery Store,50.00,
16/01/2025,Salary Deposit,,1500.00
```

### After (Finch Format)

```csv
date,amount,type,category,description
2025-01-15,50.00,EXPENSE,Food,Grocery Store
2025-01-16,1500.00,INCOME,Salary,Salary Deposit
```

**Changes made:**
1. Converted date format: `15/01/2025` → `2025-01-15`
2. Added `type` column: Debit = EXPENSE, Credit = INCOME
3. Added `category` column
4. Combined Debit/Credit into single `amount` column
5. Renamed columns to match Finch format

## Troubleshooting

### Import Button Disabled

**Problem**: Import button is grayed out or not working.

**Solution**: Ensure you're logged in and have a valid authentication token.

---

### "Only CSV files are allowed"

**Problem**: File upload rejected.

**Solution**: 
- Ensure file extension is `.csv` (not `.xlsx`, `.txt`, etc.)
- Re-save file as CSV format from your spreadsheet program

---

### "File size must be less than 5MB"

**Problem**: File is too large.

**Solution**:
- Split CSV into multiple smaller files
- Remove unnecessary columns
- Compress transactions (combine similar ones)

---

### All Rows Failed

**Problem**: Import shows 0 successful, all failed.

**Solution**:
- Check CSV format matches exactly (column names, date format)
- Verify file has header row
- Open CSV in text editor to check for hidden characters
- Ensure UTF-8 encoding (not Windows-1252 or other)

---

### Some Transactions Duplicated

**Problem**: Same transaction imported multiple times.

**Solution**:
- Check for slight differences in description
- Verify dates are identical
- Review import results modal for "auto-created categories" (may indicate issue)

---

## Security & Privacy

- ✅ CSV files are processed server-side and **not stored**
- ✅ Only authenticated users can import transactions
- ✅ Transactions are associated with your user account only
- ✅ File upload uses secure HTTPS connection
- ✅ No data is shared with third parties

## API Documentation

For developers integrating CSV import:

**Endpoint**: `POST /api/import/transactions`

**Authentication**: Bearer token (JWT)

**Content-Type**: `multipart/form-data`

**Request Body**:
```
file: <CSV file> (max 5MB)
```

**Response**: `ImportResultDto`
```json
{
  "successCount": 2,
  "failedCount": 1,
  "autoCreatedCategories": ["Food", "Transport"],
  "failedRows": [
    {
      "rowNumber": 3,
      "errors": ["Invalid date format. Use ISO 8601 (YYYY-MM-DD)"]
    }
  ]
}
```

## Changelog

- **v1.0.0** (2025-01-10): Initial CSV Import release
  - Support for basic CSV format with 5 columns
  - Duplicate detection by date + amount + description
  - Auto-create categories
  - UTF-8 encoding support
  - 5MB file size limit
  - Partial import with row-level error reporting

---

**Need help?** [Open an issue](https://github.com/PeterPage2115/Finch/issues) or check [FAQ](https://github.com/PeterPage2115/Finch/wiki/FAQ).
