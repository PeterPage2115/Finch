# Dostęp do Bazy Danych - Tracker Kasy

## 🗄️ Informacje o Bazie Danych

- **System:** PostgreSQL 16
- **Nazwa bazy:** `tracker_kasy`
- **Użytkownik:** `tracker_user`
- **Hasło:** `tracker_password` *(zmień w produkcji!)*
- **Host:** `localhost` (z hosta) lub `db` (z innych kontenerów)
- **Port:** `5432`

---

## Metoda 1: CLI - PostgreSQL psql (Terminal) 🖥️

### Podstawowe Komendy

**1. Wyświetlenie wszystkich użytkowników:**
```bash
docker exec tracker_kasy_db psql -U tracker_user tracker_kasy -c 'TABLE users'
```

**2. Wyświetlenie tylko wybranych kolumn:**
```bash
docker exec tracker_kasy_db psql -U tracker_user tracker_kasy -c "SELECT id, email, name FROM users"
```

**3. Liczba użytkowników:**
```bash
docker exec tracker_kasy_db psql -U tracker_user tracker_kasy -c 'SELECT COUNT(*) FROM users'
```

**4. Interaktywna sesja psql (pełna kontrola):**
```bash
docker exec -it tracker_kasy_db psql -U tracker_user -d tracker_kasy
```

W interaktywnej sesji możesz używać pełnego SQL:
```sql
-- Lista tabel
\dt

-- Struktura tabeli users
\d users

-- Zapytanie SQL
SELECT * FROM users WHERE email LIKE '%gmail.com';

-- Wyjście
\q
```

### Przydatne Zapytania SQL

**Ostatnio zarejestrowani użytkownicy:**
```sql
SELECT id, email, name, "createdAt" 
FROM users 
ORDER BY "createdAt" DESC 
LIMIT 5;
```

**Użytkownicy zalogowani dzisiaj:** *(wymaga dodania tabeli sessions w przyszłości)*
```sql
-- Obecnie brak implementacji śledzenia logowań
```

**Statystyki:**
```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(name) as users_with_name,
  COUNT(CASE WHEN "createdAt" > NOW() - INTERVAL '7 days' THEN 1 END) as new_last_7_days
FROM users;
```

---

## Metoda 2: GUI - DBeaver / pgAdmin (Graficzny Klient) 🎨

### Zalecany Klient: DBeaver Community (Darmowy)

**Pobierz:** https://dbeaver.io/download/

### Konfiguracja Połączenia w DBeaver

1. **Otwórz DBeaver** i kliknij `Database` → `New Database Connection`

2. **Wybierz PostgreSQL** i kliknij `Next`

3. **Wprowadź dane połączenia:**

   | Pole | Wartość |
   |------|---------|
   | **Host** | `localhost` |
   | **Port** | `5432` |
   | **Database** | `tracker_kasy` |
   | **Username** | `tracker_user` |
   | **Password** | `tracker_password` |
   | **Show all databases** | ☐ (odznacz) |

4. **Test Connection** - kliknij, aby sprawdzić połączenie
   - Jeśli DBeaver poprosi o pobranie sterownika PostgreSQL, zatwierdź

5. **Finish** - zapisz połączenie

### Nawigacja w DBeaver

```
tracker_kasy (połączenie)
 └── Databases
      └── tracker_kasy
           └── Schemas
                └── public
                     └── Tables
                          ├── users           ← Tabela użytkowników
                          ├── transactions    ← (do dodania w Fazie 4)
                          ├── categories      ← (do dodania w Fazie 5)
                          └── budgets         ← (do dodania w Fazie 6)
```

### Podstawowe Operacje w DBeaver

**Podgląd danych:**
- Kliknij prawym przyciskiem na tabelę `users`
- Wybierz `View Data` → `All Rows`

**Edycja wiersza:** *(ostrożnie w produkcji!)*
- Kliknij dwukrotnie na komórkę
- Edytuj wartość
- Naciśnij `Ctrl+S` aby zapisać

**Uruchomienie zapytania SQL:**
- Kliknij `SQL Editor` → `New SQL Script`
- Wpisz zapytanie:
  ```sql
  SELECT * FROM users WHERE email = 'piotr.paz04@gmail.com';
  ```
- Naciśnij `Ctrl+Enter` lub kliknij ikonę ▶️

**Eksport danych:**
- Zaznacz wiersze w widoku danych
- Kliknij prawym → `Export Data`
- Wybierz format: CSV, JSON, SQL, Excel, etc.

---

## Metoda 3: Alternatywne GUI - pgAdmin 4 (Dedykowany dla PostgreSQL) 🐘

### Dodanie pgAdmin do docker-compose.yml *(opcjonalne)*

Jeśli chcesz mieć pgAdmin w kontenerze:

```yaml
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: tracker_kasy_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@tracker-kasy.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks:
      - tracker_kasy_network
    depends_on:
      - db
```

**Uruchomienie:**
```bash
docker-compose up -d pgadmin
```

**Dostęp:**
- URL: http://localhost:5050
- Email: `admin@tracker-kasy.local`
- Hasło: `admin`

**Dodanie połączenia w pgAdmin:**
1. Kliknij `Add New Server`
2. **General** → Name: `Tracker Kasy`
3. **Connection:**
   - Host: `db` *(nazwa serwisu w docker-compose)*
   - Port: `5432`
   - Database: `tracker_kasy`
   - Username: `tracker_user`
   - Password: `tracker_password`
4. Save

---

## 🔒 Bezpieczeństwo

### ⚠️ **NIGDY w produkcji:**

❌ Nie używaj domyślnych haseł (`tracker_password`)
❌ Nie eksponuj portu 5432 publicznie
❌ Nie udostępniaj danych dostępowych w repozytoriach Git

### ✅ **W produkcji:**

✅ Zmień hasło w pliku `.env`:
```env
POSTGRES_PASSWORD=<silne_hasło_min_32_znaki>
```

✅ Ograniczenia portów w `docker-compose.yml`:
```yaml
ports:
  - "127.0.0.1:5432:5432"  # Tylko localhost
```

✅ Używaj zmiennych środowiskowych z tajnych magazynów (AWS Secrets Manager, Azure Key Vault)

✅ Regularnie twórz backupy:
```bash
docker exec tracker_kasy_db pg_dump -U tracker_user tracker_kasy > backup_$(date +%Y%m%d).sql
```

---

## 📚 Przydatne Linki

- **PostgreSQL Dokumentacja:** https://www.postgresql.org/docs/16/
- **Prisma Studio** *(alternatywne GUI)*: `npx prisma studio` w folderze `/backend`
- **DBeaver:** https://dbeaver.io/
- **pgAdmin:** https://www.pgadmin.org/

---

## 🧪 Testowe Zapytania

### Czyszczenie danych testowych *(UWAGA: nieodwracalne!)*

```sql
-- Usuń wszystkich użytkowników (DANGER!)
TRUNCATE TABLE users CASCADE;

-- Usuń konkretnego użytkownika
DELETE FROM users WHERE email = 'test@example.com';
```

### Dodanie testowego użytkownika (bez API)

```sql
INSERT INTO users (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'test@example.com',
  '$2b$10$test_hashed_password',  -- To nie zadziała do logowania!
  'Test User',
  NOW(),
  NOW()
);
```

**Uwaga:** Hasło musi być zahashowane przez bcrypt. Lepiej używać endpointu `/auth/register` z API.

---

## 🎯 Podsumowanie

| Metoda | Najlepsze Dla | Zalety | Wady |
|--------|---------------|--------|------|
| **psql (CLI)** | Szybkich zapytań, CI/CD, skryptów | Szybki, lekki, skryptowalny | Brak GUI, trudniejsze dla początkujących |
| **DBeaver** | Codziennej pracy, eksploracji danych | Uniwersalny (wiele baz), darmowy, intuicyjny | Wymaga instalacji |
| **pgAdmin** | Zaawansowanego zarządzania PostgreSQL | Dedykowany dla PostgreSQL, funkcjonalny | Cięższy, mniej intuicyjny |
| **Prisma Studio** | Deweloperów używających Prisma | Integracja z ORM, widok relacji | Wymaga `npx`, wolniejszy |

**Rekomendacja dla Ciebie:**
- **Szybki podgląd:** `docker exec tracker_kasy_db psql -U tracker_user tracker_kasy -c 'TABLE users'`
- **Codzienna praca:** DBeaver Community
- **Zaawansowane:** pgAdmin 4 (w kontenerze lub lokalnie)
