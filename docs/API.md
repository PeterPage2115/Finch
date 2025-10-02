# 📡 API Documentation - Tracker Kasy

**Base URL:** `http://localhost:3001`

---

## 🔐 Authentication Endpoints

### 1. Register User

Rejestracja nowego użytkownika w systemie.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Must be a valid email address (required)
- `password`: Minimum 8 characters (required)
- `name`: Non-empty string (required)

**Success Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "9bfc1ecc-e1b5-4870-86b1-680394a906df",
    "email": "user@example.com"
  }
}
```

**Error Responses:**

**409 Conflict** - User already exists:
```json
{
  "statusCode": 409,
  "message": "Użytkownik o tym adresie email już istnieje",
  "error": "Conflict"
}
```

**400 Bad Request** - Validation failed:
```json
{
  "statusCode": 400,
  "message": [
    "Nieprawidłowy adres email",
    "Hasło musi mieć co najmniej 8 znaków"
  ],
  "error": "Bad Request"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

---

### 2. Login User

Logowanie użytkownika i uzyskanie JWT tokenu.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email address (required)
- `password`: Non-empty string (required)

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "9bfc1ecc-e1b5-4870-86b1-680394a906df",
    "email": "user@example.com"
  }
}
```

**Error Responses:**

**401 Unauthorized** - Invalid credentials:
```json
{
  "statusCode": 401,
  "message": "Nieprawidłowy email lub hasło",
  "error": "Unauthorized"
}
```

**400 Bad Request** - Validation failed:
```json
{
  "statusCode": 400,
  "message": [
    "Nieprawidłowy adres email",
    "Hasło jest wymagane"
  ],
  "error": "Bad Request"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

### 3. Get Current User Profile

Pobranie profilu zalogowanego użytkownika. **Wymaga uwierzytelnienia.**

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "id": "9bfc1ecc-e1b5-4870-86b1-680394a906df",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-10-02T21:15:23.686Z",
  "updatedAt": "2025-10-02T21:15:23.686Z"
}
```

**Error Responses:**

**401 Unauthorized** - Missing or invalid token:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔑 JWT Token

### Token Structure

Tokeny JWT są generowane z następującą strukturą payloadu:

```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "iat": 1759439723,
  "exp": 1760044523
}
```

**Pola:**
- `sub`: User ID (UUID)
- `email`: Email użytkownika
- `iat`: Issued At (timestamp)
- `exp`: Expiration Time (timestamp)

### Token Configuration

- **Algorithm:** HS256
- **Expiration:** 7 days (configurable via `JWT_EXPIRATION` env variable)
- **Secret:** Stored in `JWT_SECRET` environment variable

### Using JWT in Requests

Wszystkie chronione endpointy wymagają tokenu JWT w nagłówku `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

**Example in JavaScript (Fetch API):**
```javascript
fetch('http://localhost:3001/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

**Example in cURL:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/auth/me
```

---

## 🛡️ Security Notes

1. **Password Security:**
   - Hasła są hashowane używając bcrypt z 10 salt rounds
   - Nigdy nie są przechowywane ani zwracane w plain text

2. **Token Storage:**
   - Frontend powinien przechowywać token w `localStorage` lub `httpOnly cookies`
   - Token powinien być wysyłany w każdym requescie do chronionych endpointów

3. **HTTPS:**
   - W produkcji zawsze używaj HTTPS
   - Nigdy nie wysyłaj tokenów przez niezabezpieczone połączenia

4. **Token Refresh:**
   - Obecnie brak mechanizmu refresh token (planowane w przyszłości)
   - Po wygaśnięciu tokenu użytkownik musi się zalogować ponownie

---

## 📝 Common Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully (register) |
| 400 | Bad Request | Validation failed or malformed request |
| 401 | Unauthorized | Missing, invalid, or expired token |
| 409 | Conflict | Resource already exists (duplicate email) |
| 500 | Internal Server Error | Server-side error |

---

## 🧪 Testing Endpoints

### Using PowerShell

**Register:**
```powershell
$body = @{email='test@example.com'; password='password123'; name='Test User'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3001/auth/register -Method POST -Body $body -ContentType 'application/json'
```

**Login:**
```powershell
$body = @{email='test@example.com'; password='password123'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri http://localhost:3001/auth/login -Method POST -Body $body -ContentType 'application/json'
$token = ($response.Content | ConvertFrom-Json).accessToken
```

**Get Profile:**
```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri http://localhost:3001/auth/me -Method GET -Headers $headers
```

### Using cURL (Linux/Mac/WSL)

**Register:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

**Login and save token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.accessToken')
```

**Get Profile:**
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Future Enhancements (Planned)

- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset flow
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Rate limiting for auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Two-factor authentication (2FA)

---

**Last Updated:** October 2, 2025  
**Version:** 1.0.0  
**Status:** Phase 3.1 - Auth System Implemented ✅
