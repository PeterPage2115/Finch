# Frontend Authentication - Dokumentacja

## Przegląd

System uwierzytelniania po stronie frontendu zbudowany z **Next.js 14+ App Router**, **Zustand** i **TypeScript**. Zapewnia pełną integrację z backendem Auth API.

---

## Architektura

### Struktura folderów

```
frontend/
├── src/
│   ├── app/
│   │   ├── login/page.tsx          # Strona logowania
│   │   ├── register/page.tsx       # Strona rejestracji
│   │   └── dashboard/page.tsx      # Dashboard (chroniony)
│   ├── lib/
│   │   └── api/
│   │       └── client.ts            # Auth API client
│   └── middleware.ts                # Next.js middleware (ochrona tras)
├── lib/
│   └── stores/
│       └── authStore.ts             # Zustand store
├── types/
│   └── index.ts                     # TypeScript types
└── app/
    └── page.tsx                     # Strona główna
```

---

## Komponenty systemu

### 1. Zustand Store (`lib/stores/authStore.ts`)

**Przechowuje:**
- `user: User | null` - Dane użytkownika
- `token: string | null` - JWT access token
- `isAuthenticated: boolean` - Status autentykacji

**Akcje:**
- `setAuth(user, tokens)` - Zapisz dane po logowaniu/rejestracji
- `logout()` - Wyloguj użytkownika
- `updateUser(userData)` - Aktualizuj dane użytkownika

**Persystencja:**
- Automatycznie zapisywane w `localStorage` pod kluczem `auth-storage`
- Stan przetrwa odświeżenie strony

**Przykład użycia:**
```typescript
import { useAuthStore } from '../lib/stores/authStore';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <p>Zaloguj się</p>;
  }

  return (
    <div>
      <p>Witaj, {user?.name}</p>
      <button onClick={logout}>Wyloguj</button>
    </div>
  );
}
```

---

### 2. API Client (`src/lib/api/client.ts`)

Wrapper dla endpointów autentykacji:

```typescript
import { authApi } from '@/lib/api/client';

// Rejestracja
const response = await authApi.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'Jan Kowalski',
});

// Logowanie
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
});

// Pobranie profilu (wymaga tokenu)
const profile = await authApi.getProfile(token);
```

**Obsługa błędów:**
```typescript
try {
  await authApi.login(credentials);
} catch (error) {
  const err = error as Error;
  console.error(err.message); // "Nieprawidłowy email lub hasło"
}
```

---

### 3. Middleware (`src/middleware.ts`)

Next.js middleware automatycznie chroni trasy wymagające autentykacji.

**Chronione trasy:**
- `/dashboard`
- `/transactions`
- `/budgets`
- `/categories`
- `/profile`

**Zachowanie:**
- ❌ Niezalogowany na chronionej trasie → Przekierowanie na `/login?from=/dashboard`
- ✅ Zalogowany na `/login` lub `/register` → Przekierowanie na `/dashboard`
- ✅ Zalogowany na chronionej trasie → Dostęp

**Uwaga:** Middleware sprawdza cookie `auth-storage` (ustawiane przez Zustand persist)

---

### 4. Strony

#### `/register` - Rejestracja

**Formularz:**
- Imię i nazwisko (wymagane)
- Email (wymagane, format email)
- Hasło (wymagane, min. 8 znaków)

**Flow:**
1. Użytkownik wypełnia formularz
2. Kliknięcie "Załóż konto" → `authApi.register()`
3. Sukces → `setAuth()` + przekierowanie na `/dashboard`
4. Błąd → Wyświetlenie komunikatu

**Walidacja:**
- HTML5 native validation (email, required, minLength)
- Backend validation (format email, długość hasła, duplikat email)

#### `/login` - Logowanie

**Formularz:**
- Email
- Hasło

**Flow:**
1. Użytkownik wypełnia formularz
2. Kliknięcie "Zaloguj się" → `authApi.login()`
3. Sukces → `setAuth()` + przekierowanie na `/dashboard`
4. Błąd → "Nieprawidłowy email lub hasło"

#### `/dashboard` - Dashboard (chroniony)

**Dostęp:** Tylko dla zalogowanych użytkowników

**Funkcjonalności:**
- Wyświetlenie danych użytkownika (imię, email)
- Przycisk wylogowania
- Placeholder dla statystyk (przychody, wydatki, bilans)
- Info "W przygotowaniu" dla przyszłych funkcji

**Wylogowanie:**
```typescript
const handleLogout = () => {
  logout();
  router.push('/login');
};
```

#### `/` - Strona główna

**Auto-redirect:**
- Zalogowany → Przekierowanie na `/dashboard`
- Niezalogowany → Landing page z przyciskami "Zaloguj się" / "Załóż konto"

---

## Flow autentykacji

### 1. Rejestracja nowego użytkownika

```
Użytkownik → /register
    ↓
Wypełnia formularz (name, email, password)
    ↓
Kliknięcie "Załóż konto"
    ↓
POST /auth/register → Backend
    ↓
Backend: Walidacja, haszowanie, zapis do DB
    ↓
Odpowiedź: { accessToken, user: { id, email, name } }
    ↓
Frontend: setAuth(user, { accessToken })
    ↓
Zustand: Zapisanie w store + localStorage
    ↓
Przekierowanie → /dashboard
    ↓
✅ Użytkownik zalogowany
```

### 2. Logowanie istniejącego użytkownika

```
Użytkownik → /login
    ↓
Wypełnia formularz (email, password)
    ↓
Kliknięcie "Zaloguj się"
    ↓
POST /auth/login → Backend
    ↓
Backend: Sprawdzenie hasła, generowanie JWT
    ↓
Odpowiedź: { accessToken, user }
    ↓
Frontend: setAuth(user, { accessToken })
    ↓
Przekierowanie → /dashboard
    ↓
✅ Użytkownik zalogowany
```

### 3. Dostęp do chronionej trasy

```
Użytkownik próbuje wejść na /dashboard
    ↓
Middleware: Sprawdzenie auth-storage cookie
    ↓
┌─────────────────────┬─────────────────────┐
│ Zalogowany          │ Niezalogowany       │
├─────────────────────┼─────────────────────┤
│ ✅ Dostęp           │ ❌ Redirect na      │
│                     │    /login?from=...  │
└─────────────────────┴─────────────────────┘
```

### 4. Wylogowanie

```
Użytkownik → Kliknięcie "Wyloguj"
    ↓
logout() → Zustand
    ↓
Wyczyszczenie: user = null, token = null, isAuthenticated = false
    ↓
localStorage: Usunięcie auth-storage
    ↓
Przekierowanie → /login
    ↓
✅ Użytkownik wylogowany
```

---

## Bezpieczeństwo

### ✅ Implementowane zabezpieczenia

1. **JWT Token:**
   - Przechowywany w `localStorage` (via Zustand persist)
   - Automatycznie dołączany do requestów (Authorization: Bearer <token>)
   - 7-dniowy czas życia (konfigurowalny w backendzie)

2. **Middleware Protection:**
   - Automatyczna ochrona tras wymagających logowania
   - Przekierowanie niezalogowanych na `/login`

3. **Walidacja formularzy:**
   - HTML5 native validation (frontend)
   - Backend validation (class-validator)
   - Obsługa i wyświetlanie błędów walidacji

4. **HTTPS:**
   - W produkcji należy używać HTTPS (nginx/reverse proxy)

### ⚠️ Przyszłe ulepszenia bezpieczeństwa

1. **Refresh Tokens:**
   - Dodanie refresh token dla automatycznego odnawiania sesji
   - Zmniejszenie czasu życia access token (np. 15 min)

2. **CSRF Protection:**
   - Dodanie CSRF tokens dla mutujących operacji

3. **Rate Limiting:**
   - Ograniczenie prób logowania (w backendzie)

4. **2FA (Two-Factor Authentication):**
   - Opcjonalne uwierzytelnianie dwuskładnikowe

---

## Testowanie

### Ręczne testowanie

1. **Rejestracja:**
   ```
   1. Otwórz http://localhost:3000/register
   2. Wypełnij formularz
   3. Kliknij "Załóż konto"
   4. Sprawdź przekierowanie na /dashboard
   5. Sprawdź localStorage (auth-storage)
   ```

2. **Logowanie:**
   ```
   1. Wyloguj się
   2. Otwórz http://localhost:3000/login
   3. Zaloguj się istniejącym kontem
   4. Sprawdź dashboard
   ```

3. **Middleware:**
   ```
   1. Wyloguj się
   2. Spróbuj wejść na http://localhost:3000/dashboard
   3. Powinieneś zostać przekierowany na /login?from=/dashboard
   ```

4. **Persystencja:**
   ```
   1. Zaloguj się
   2. Odśwież stronę (F5)
   3. Powinieneś pozostać zalogowany
   ```

### Błędy do przetestowania

- ❌ Rejestracja z istniejącym emailem → 409 Conflict
- ❌ Logowanie z błędnym hasłem → 401 Unauthorized
- ❌ Hasło krótsze niż 8 znaków → 400 Bad Request
- ❌ Niepoprawny format email → 400 Bad Request

---

## Troubleshooting

### Problem: "Nie mogę się zalogować"

**Sprawdź:**
1. Backend jest uruchomiony (`docker-compose ps`)
2. Backend API URL jest poprawny (`.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3001`)
3. Dane logowania są poprawne
4. Sprawdź logi backendu: `docker-compose logs backend`

### Problem: "Po odświeżeniu jestem wylogowany"

**Sprawdź:**
1. Czy `localStorage` zawiera `auth-storage`
2. Czy Zustand persist działa (sprawdź Application → Local Storage w DevTools)
3. Czy middleware nie ma błędów (sprawdź logi frontendu)

### Problem: "Middleware nie przekierowuje"

**Sprawdź:**
1. Czy plik `src/middleware.ts` istnieje
2. Czy config.matcher jest poprawny
3. Sprawdź Next.js logs

### Problem: "CORS error"

**Rozwiązanie:**
Backend musi mieć włączone CORS dla frontendu:
```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

---

## Zmienne środowiskowe

### Frontend (`.env.local`)

```bash
# URL backendu
NEXT_PUBLIC_API_URL=http://localhost:3001

# Dla produkcji:
# NEXT_PUBLIC_API_URL=https://api.twoja-domena.com
```

---

## Rozwój i kolejne kroki

### ✅ Zaimplementowane (Faza 3.2)

- [x] Strona rejestracji z formularzem
- [x] Strona logowania z formularzem
- [x] Zustand store z persystencją
- [x] Auth API client
- [x] Next.js middleware do ochrony tras
- [x] Dashboard placeholder
- [x] Wylogowanie

### 🚀 Następne fazy

**Faza 4 - Moduł Transakcji:**
- API dla transakcji (CRUD)
- Formularz dodawania transakcji
- Lista transakcji
- Filtrowanie i wyszukiwanie

**Faza 5 - Kategorie:**
- Zarządzanie kategoriami
- Domyślne kategorie

**Faza 6 - Budżety i Raporty:**
- Ustalanie budżetów
- Wykresy i statystyki

---

## API Reference (Frontend)

### `authApi.register(data)`

**Request:**
```typescript
{
  email: string;
  password: string;
  name: string;
}
```

**Response:**
```typescript
{
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}
```

### `authApi.login(data)`

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}
```

### `authApi.getProfile(token)`

**Request:** Token w parametrze

**Response:**
```typescript
{
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

**Ostatnia aktualizacja:** 3 października 2025  
**Faza:** 3.2 - Frontend Auth UI ✅
