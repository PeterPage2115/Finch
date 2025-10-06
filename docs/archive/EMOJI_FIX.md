# Emoji Fix - PostgreSQL UTF-8 Encoding

## Problem
Emoji w kolumnie `categories.icon` były wyświetlane jako `????` w aplikacji i terminalu PostgreSQL.

## Przyczyna
Podczas seedowania bazy danych (`npm run seed`), emoji nie były poprawnie zapisywane pomimo:
- Baza używa `UTF8` encoding ✅
- Seed script używa prawdziwych emoji (np. `icon: '🍔'`) ✅

Problem: **Terminal encoding** podczas `npm run seed` w Windows PowerShell nie obsługiwał emoji.

## Rozwiązanie
Użycie hex encoding UTF-8 w PostgreSQL `UPDATE` statements:

```sql
-- 🍔 Jedzenie (U+1F354)
UPDATE categories SET icon = E'\\xF0\\x9F\\x8D\\x94' WHERE name = 'Jedzenie' AND type = 'EXPENSE';

-- 🚗 Transport (U+1F697)
UPDATE categories SET icon = E'\\xF0\\x9F\\x9A\\x97' WHERE name = 'Transport' AND type = 'EXPENSE';

-- 🎮 Rozrywka (U+1F3AE)
UPDATE categories SET icon = E'\\xF0\\x9F\\x8E\\xAE' WHERE name = 'Rozrywka' AND type = 'EXPENSE';

-- 💰 Wynagrodzenie (U+1F4B0)
UPDATE categories SET icon = E'\\xF0\\x9F\\x92\\xB0' WHERE name = 'Wynagrodzenie' AND type = 'INCOME';

-- 🧾 Rachunki (U+1F9FE)
UPDATE categories SET icon = E'\\xF0\\x9F\\xA7\\xBE' WHERE name = 'Rachunki' AND type = 'EXPENSE';
```

## Prewencja
Dla przyszłych seedów:
1. Rozważ użycie migration files z hex encoding zamiast seed scripts
2. Lub użyj `pgAdmin` / GUI tools do seedowania z emoji
3. Lub ustaw `$OutputEncoding = [System.Text.Encoding]::UTF8` w PowerShell przed `npm run seed`

## Weryfikacja
```bash
docker exec tracker_kasy_db psql -U tracker_user -d tracker_kasy -c "SELECT name, icon FROM categories WHERE icon IS NOT NULL LIMIT 5;"
```

Backend API `/categories` powinien zwracać emoji jako prawidłowe UTF-8 strings.
