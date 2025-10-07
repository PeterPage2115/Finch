-- Skrypt do dodania domyślnych kategorii dla istniejących użytkowników
-- Użytkownicy: test@test.pl i testapi@example.com

-- test@test.pl (userId: c6160f09-2d34-4968-bbf3-b62b9077143f)
-- Updated to use Lucide icon names instead of emoji (2025-10-08)
INSERT INTO categories (id, name, type, icon, color, "userId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Jedzenie', 'EXPENSE', 'UtensilsCrossed', '#10B981', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Transport', 'EXPENSE', 'Car', '#3B82F6', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Rozrywka', 'EXPENSE', 'Gamepad2', '#8B5CF6', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Zdrowie', 'EXPENSE', 'Heart', '#EF4444', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Rachunki', 'EXPENSE', 'Receipt', '#F59E0B', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Wynagrodzenie', 'INCOME', 'Wallet', '#10B981', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Inne przychody', 'INCOME', 'DollarSign', '#06B6D4', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW());

-- testapi@example.com (userId: adf6c586-0736-462e-84e9-37acca6f0ce3)
-- Updated to use Lucide icon names instead of emoji (2025-10-08)
INSERT INTO categories (id, name, type, icon, color, "userId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Jedzenie', 'EXPENSE', 'UtensilsCrossed', '#10B981', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Transport', 'EXPENSE', 'Car', '#3B82F6', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Rozrywka', 'EXPENSE', 'Gamepad2', '#8B5CF6', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Zdrowie', 'EXPENSE', 'Heart', '#EF4444', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Rachunki', 'EXPENSE', 'Receipt', '#F59E0B', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Wynagrodzenie', 'INCOME', 'Wallet', '#10B981', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Inne przychody', 'INCOME', 'DollarSign', '#06B6D4', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW());
