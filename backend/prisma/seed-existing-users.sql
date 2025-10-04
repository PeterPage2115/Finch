-- Skrypt do dodania domyślnych kategorii dla istniejących użytkowników
-- Użytkownicy: test@test.pl i testapi@example.com

-- test@test.pl (userId: c6160f09-2d34-4968-bbf3-b62b9077143f)
INSERT INTO categories (id, name, type, icon, color, "userId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Jedzenie', 'EXPENSE', '🍔', '#10B981', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Transport', 'EXPENSE', '🚗', '#3B82F6', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Rozrywka', 'EXPENSE', '🎮', '#8B5CF6', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Zdrowie', 'EXPENSE', '⚕️', '#EF4444', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Rachunki', 'EXPENSE', '📄', '#F59E0B', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Wynagrodzenie', 'INCOME', '💰', '#10B981', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW()),
  (gen_random_uuid(), 'Inne przychody', 'INCOME', '💵', '#06B6D4', 'c6160f09-2d34-4968-bbf3-b62b9077143f', NOW(), NOW());

-- testapi@example.com (userId: adf6c586-0736-462e-84e9-37acca6f0ce3)
INSERT INTO categories (id, name, type, icon, color, "userId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Jedzenie', 'EXPENSE', '🍔', '#10B981', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Transport', 'EXPENSE', '🚗', '#3B82F6', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Rozrywka', 'EXPENSE', '🎮', '#8B5CF6', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Zdrowie', 'EXPENSE', '⚕️', '#EF4444', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Rachunki', 'EXPENSE', '📄', '#F59E0B', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Wynagrodzenie', 'INCOME', '💰', '#10B981', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW()),
  (gen_random_uuid(), 'Inne przychody', 'INCOME', '💵', '#06B6D4', 'adf6c586-0736-462e-84e9-37acca6f0ce3', NOW(), NOW());
