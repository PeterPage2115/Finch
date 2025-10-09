# 📡 API Documentation - Finance Tracker

**Base URL:** `http://localhost:3001`

---

## 🔐 Authentication Endpoints

### 1. Register User

Registers a new user in the system.

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
  "message": "A user with this email already exists",
  "error": "Conflict"
}
```

**400 Bad Request** - Validation failed:
```json
{
  "statusCode": 400,
  "message": [
  "Email must be a valid email address",
  "Password must be at least 8 characters long"
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

Authenticates a user and returns a JWT token.

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
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

**400 Bad Request** - Validation failed:
```json
{
  "statusCode": 400,
  "message": [
  "Email must be a valid email address",
  "Password is required"
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

Retrieves the profile of the authenticated user. **Requires authentication.**

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

JWT tokens are generated with the following payload structure:

```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "iat": 1759439723,
  "exp": 1760044523
}
```

**Fields:**
- `sub`: User ID (UUID)
- `email`: User email
- `iat`: Issued at (timestamp)
- `exp`: Expiration time (timestamp)

### Token Configuration

- **Algorithm:** HS256
- **Expiration:** 7 days (configurable via `JWT_EXPIRATION` env variable)
- **Secret:** Stored in `JWT_SECRET` environment variable

### Using JWT in Requests

All protected endpoints require a JWT token in the `Authorization` header:

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
  - Passwords are hashed with bcrypt using 10 salt rounds
  - They are never stored or returned in plain text

2. **Token Storage:**
  - The frontend should store the token in `localStorage` or `httpOnly cookies`
  - The token must be sent with every request to protected endpoints

3. **HTTPS:**
  - Always use HTTPS in production
  - Never send tokens over unsecured connections

4. **Token Refresh:**
  - Refresh tokens are not implemented yet (planned for the future)
  - After a token expires, the user needs to log in again

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

---

## 💰 Budgets Endpoints

### 1. Create Budget

Creates a new budget for the user.

**Endpoint:** `POST /budgets`

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Request Body:**
```json
{
  "categoryId": "9bfc1ecc-e1b5-4870-86b1-680394a906df",
  "amount": 1000.00,
  "period": "MONTHLY",
  "startDate": "2025-10-01",
  "endDate": "2025-10-31"
}
```

**Validation Rules:**
- `categoryId`: Valid UUID, category must exist and belong to user (required)
- `amount`: Positive number (required)
- `period`: One of: DAILY, WEEKLY, MONTHLY, YEARLY, CUSTOM (required)
- `startDate`: Valid ISO date (required)
- `endDate`: Valid ISO date, calculated automatically for MONTHLY/YEARLY (optional for non-CUSTOM)

**Business Rules:**
- A user cannot create duplicate budgets: unique `(userId, categoryId, startDate)`
- For MONTHLY period: `endDate = last day of the month`
- For YEARLY period: `endDate = last day of the year`

**Success Response (201 Created):**
```json
{
  "id": "budget-uuid",
  "categoryId": "9bfc1ecc-e1b5-4870-86b1-680394a906df",
  "userId": "user-uuid",
  "amount": "1000.00",
  "period": "MONTHLY",
  "startDate": "2025-10-01T00:00:00.000Z",
  "endDate": "2025-10-31T23:59:59.999Z",
  "createdAt": "2025-10-06T12:00:00.000Z",
  "updatedAt": "2025-10-06T12:00:00.000Z",
  "category": {
    "id": "9bfc1ecc-e1b5-4870-86b1-680394a906df",
  "name": "Food",
    "type": "EXPENSE",
    "color": "#10B981",
    "icon": "ShoppingCart"
  },
  "spent": "450.75",
  "remaining": "549.25",
  "progress": 45.08,
  "alerts": []
}
```

**Alerts Array:**
- `"80%"` - when progress >= 80% and < 100%
- `"100%"` - when progress >= 100%

**Error Responses:**

**400 Bad Request** - Invalid data:
```json
{
  "statusCode": 400,
  "message": ["amount must be a positive number"],
  "error": "Bad Request"
}
```

**409 Conflict** - Duplicate budget:
```json
{
  "statusCode": 409,
  "message": "A budget for this category already exists in this period",
  "error": "Conflict"
}
```

---

### 2. Get All Budgets

Returns all budgets for the user with optional filters.

**Endpoint:** `GET /budgets?period=MONTHLY&startDate=2025-10-01`

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Query Parameters:**
- `period` (optional): DAILY, WEEKLY, MONTHLY, YEARLY, CUSTOM
- `startDate` (optional): Filter by start date (ISO format)
- `categoryId` (optional): Filter by specific category

**Success Response (200 OK):**
```json
[
  {
    "id": "budget-uuid-1",
    "categoryId": "category-uuid-1",
    "amount": "1000.00",
    "period": "MONTHLY",
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-10-31T23:59:59.999Z",
    "category": {
      "id": "category-uuid-1",
  "name": "Food",
      "type": "EXPENSE",
      "color": "#10B981",
      "icon": "ShoppingCart"
    },
    "spent": "450.75",
    "remaining": "549.25",
    "progress": 45.08,
    "alerts": []
  },
  {
    "id": "budget-uuid-2",
    "categoryId": "category-uuid-2",
    "amount": "500.00",
    "period": "MONTHLY",
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-10-31T23:59:59.999Z",
    "category": {
      "id": "category-uuid-2",
      "name": "Transport",
      "type": "EXPENSE",
      "color": "#3B82F6",
      "icon": "Car"
    },
    "spent": "550.00",
    "remaining": "-50.00",
    "progress": 110.00,
    "alerts": ["80%", "100%"]
  }
]
```

---

### 3. Get Budget by ID

Retrieves the details of a single budget.

**Endpoint:** `GET /budgets/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Success Response (200 OK):**
```json
{
  "id": "budget-uuid",
  "categoryId": "category-uuid",
  "userId": "user-uuid",
  "amount": "1000.00",
  "period": "MONTHLY",
  "startDate": "2025-10-01T00:00:00.000Z",
  "endDate": "2025-10-31T23:59:59.999Z",
  "category": {
    "id": "category-uuid",
  "name": "Food",
    "type": "EXPENSE",
    "color": "#10B981",
    "icon": "ShoppingCart"
  },
  "spent": "450.75",
  "remaining": "549.25",
  "progress": 45.08,
  "alerts": []
}
```

**Error Responses:**

**404 Not Found** - Budget doesn't exist or doesn't belong to user:
```json
{
  "statusCode": 404,
  "message": "Budget not found",
  "error": "Not Found"
}
```

---

### 4. Update Budget

Updates an existing budget.

**Endpoint:** `PATCH /budgets/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Request Body (all fields optional):**
```json
{
  "amount": 1200.00,
  "period": "MONTHLY",
  "startDate": "2025-11-01",
  "endDate": "2025-11-30"
}
```

**Note:** Cannot update `categoryId` - create new budget instead.

**Success Response (200 OK):**
```json
{
  "id": "budget-uuid",
  "categoryId": "category-uuid",
  "userId": "user-uuid",
  "amount": "1200.00",
  "period": "MONTHLY",
  "startDate": "2025-11-01T00:00:00.000Z",
  "endDate": "2025-11-30T23:59:59.999Z",
  "category": {
    "id": "category-uuid",
  "name": "Food",
    "type": "EXPENSE",
    "color": "#10B981",
    "icon": "ShoppingCart"
  },
  "spent": "0.00",
  "remaining": "1200.00",
  "progress": 0.00,
  "alerts": []
}
```

---

### 5. Delete Budget

Deletes a budget.

**Endpoint:** `DELETE /budgets/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Success Response (204 No Content):**
- Empty body
- Status code: 204

**Error Responses:**

**404 Not Found** - Budget doesn't exist or doesn't belong to user:
```json
{
  "statusCode": 404,
  "message": "Budget not found",
  "error": "Not Found"
}
```

---

## 🧪 Testing Examples (Budgets)

### Using PowerShell

**Create Budget:**
```powershell
$headers = @{Authorization="Bearer $token"}
$body = @{
  categoryId = "category-uuid"
  amount = 1000
  period = "MONTHLY"
  startDate = "2025-10-01"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/budgets -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

**Get All Budgets:**
```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:3001/budgets?period=MONTHLY" -Method GET -Headers $headers
```

**Update Budget:**
```powershell
$headers = @{Authorization="Bearer $token"}
$body = @{
  amount = 1200
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/budgets/budget-uuid -Method PATCH -Headers $headers -Body $body -ContentType "application/json"
```

**Delete Budget:**
```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri http://localhost:3001/budgets/budget-uuid -Method DELETE -Headers $headers
```

---

## 🧪 Testing Examples (Authentication)

### Using PowerShell

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
