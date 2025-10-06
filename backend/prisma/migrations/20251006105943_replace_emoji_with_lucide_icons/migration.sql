/*
  Warnings:

  - Made the column `color` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/

-- Step 1: Update existing categories with lucide-react icon names and colors
UPDATE "categories" SET icon = 'UtensilsCrossed', color = '#ef4444' WHERE name = 'Jedzenie' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'Car', color = '#3b82f6' WHERE name = 'Transport' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'Gamepad2', color = '#a855f7' WHERE name = 'Rozrywka' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'Receipt', color = '#f59e0b' WHERE name = 'Rachunki' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'ShoppingBag', color = '#ec4899' WHERE name = 'Zakupy' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'Heart', color = '#10b981' WHERE name = 'Zdrowie' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'MoreHorizontal', color = '#6b7280' WHERE name = 'Inne wydatki' AND type = 'EXPENSE';
UPDATE "categories" SET icon = 'Wallet', color = '#22c55e' WHERE name = 'Wynagrodzenie' AND type = 'INCOME';
UPDATE "categories" SET icon = 'TrendingUp', color = '#14b8a6' WHERE name = 'Inne przychody' AND type = 'INCOME';

-- Step 2: Set default values for any remaining NULL values (fallback for custom categories)
UPDATE "categories" SET icon = 'HelpCircle' WHERE icon IS NULL;
UPDATE "categories" SET color = '#6b7280' WHERE color IS NULL;

-- Step 3: Now make the columns required
ALTER TABLE "categories" ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "icon" SET NOT NULL;

