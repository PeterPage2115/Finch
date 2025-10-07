# 📡 API Reference

> **Complete REST API documentation with request/response examples**

---

## Base URL

**Development:** `http://localhost:3001/api`  
**Production:** `https://your-domain.com/api`

---

## Authentication

All protected endpoints require JWT token in `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

**⚠️ Current Status (v0.7.0):** Mock authentication with test user. Real authentication coming in v0.8.0.

---

## Endpoints Overview

| Category       | Method | Endpoint                        | Auth Required |
|----------------|--------|---------------------------------|---------------|
| **Auth**       | POST   | `/auth/register`                | No            |
|                | POST   | `/auth/login`                   | No            |
|                | GET    | `/auth/profile` *(v0.8.0)*      | Yes           |
| **Transactions** | GET  | `/transactions`                 | Yes           |
|                | GET    | `/transactions/:id`             | Yes           |
|                | POST   | `/transactions`                 | Yes           |
|                | PATCH  | `/transactions/:id`             | Yes           |
|                | DELETE | `/transactions/:id`             | Yes           |
| **Categories** | GET    | `/categories`                   | Yes           |
|                | POST   | `/categories`                   | Yes           |
|                | PATCH  | `/categories/:id`               | Yes           |
|                | DELETE | `/categories/:id`               | Yes           |
| **Budgets**    | GET    | `/budgets`                      | Yes           |
|                | POST   | `/budgets`                      | Yes           |
|                | PATCH  | `/budgets/:id`                  | Yes           |
|                | DELETE | `/budgets/:id`                  | Yes           |
| **Reports**    | GET    | `/reports/summary`              | Yes           |
|                | GET    | `/reports/by-category`          | Yes           |

---

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-10-07T10:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Validation error (email format, password length)
- `409 Conflict` - Email already exists

---

### Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Test User (Mock Auth):**
```json
{
  "email": "test@test.pl",
  "password": "password123"
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials

---

### Get Profile *(Coming in v0.8.0)*

**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-10-07T10:00:00.000Z"
}
```

---

## Transaction Endpoints

### List Transactions

**GET** `/api/transactions`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `type` (optional): `INCOME` | `EXPENSE`
- `categoryId` (optional): Filter by category
- `startDate` (optional): ISO date string (e.g., `2025-01-01`)
- `endDate` (optional): ISO date string
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Example Request:**
```
GET /api/transactions?type=EXPENSE&startDate=2025-10-01&limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "categoryId": 5,
    "amount": 150.50,
    "type": "EXPENSE",
    "description": "Groceries at Biedronka",
    "date": "2025-10-07T00:00:00.000Z",
    "createdAt": "2025-10-07T10:30:00.000Z",
    "updatedAt": "2025-10-07T10:30:00.000Z",
    "category": {
      "id": 5,
      "name": "Food",
      "icon": "ShoppingCart",
      "type": "EXPENSE"
    }
  },
  {
    "id": 2,
    "userId": 1,
    "categoryId": 2,
    "amount": 3500.00,
    "type": "INCOME",
    "description": "Monthly salary",
    "date": "2025-10-01T00:00:00.000Z",
    "createdAt": "2025-10-01T08:00:00.000Z",
    "updatedAt": "2025-10-01T08:00:00.000Z",
    "category": {
      "id": 2,
      "name": "Salary",
      "icon": "Wallet",
      "type": "INCOME"
    }
  }
]
```

---

### Get Single Transaction

**GET** `/api/transactions/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 5,
  "amount": 150.50,
  "type": "EXPENSE",
  "description": "Groceries at Biedronka",
  "date": "2025-10-07T00:00:00.000Z",
  "createdAt": "2025-10-07T10:30:00.000Z",
  "updatedAt": "2025-10-07T10:30:00.000Z",
  "category": {
    "id": 5,
    "name": "Food",
    "icon": "ShoppingCart",
    "type": "EXPENSE"
  }
}
```

**Errors:**
- `404 Not Found` - Transaction not found or doesn't belong to user

---

### Create Transaction

**POST** `/api/transactions`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 150.50,
  "type": "EXPENSE",
  "categoryId": 5,
  "description": "Groceries at Biedronka",
  "date": "2025-10-07"
}
```

**Validation Rules:**
- `amount`: Required, number, > 0
- `type`: Required, enum (`INCOME` | `EXPENSE`)
- `categoryId`: Optional, integer
- `description`: Optional, string (max 500 chars)
- `date`: Required, ISO date string

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 5,
  "amount": 150.50,
  "type": "EXPENSE",
  "description": "Groceries at Biedronka",
  "date": "2025-10-07T00:00:00.000Z",
  "createdAt": "2025-10-07T10:30:00.000Z",
  "updatedAt": "2025-10-07T10:30:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Validation error
- `404 Not Found` - Category not found

---

### Update Transaction

**PATCH** `/api/transactions/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "amount": 200.00,
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 5,
  "amount": 200.00,
  "type": "EXPENSE",
  "description": "Updated description",
  "date": "2025-10-07T00:00:00.000Z",
  "createdAt": "2025-10-07T10:30:00.000Z",
  "updatedAt": "2025-10-07T11:45:00.000Z"
}
```

**Errors:**
- `404 Not Found` - Transaction not found or doesn't belong to user

---

### Delete Transaction

**DELETE** `/api/transactions/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Transaction deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Transaction not found or doesn't belong to user

---

## Category Endpoints

### List Categories

**GET** `/api/categories`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `type` (optional): `INCOME` | `EXPENSE`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Food",
    "type": "EXPENSE",
    "icon": "ShoppingCart",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "userId": 1,
    "name": "Salary",
    "type": "INCOME",
    "icon": "Wallet",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z"
  }
]
```

---

### Create Category

**POST** `/api/categories`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Entertainment",
  "type": "EXPENSE",
  "icon": "Film"
}
```

**Validation Rules:**
- `name`: Required, string (max 100 chars)
- `type`: Required, enum (`INCOME` | `EXPENSE`)
- `icon`: Required, string (Lucide icon name)

**Response (201 Created):**
```json
{
  "id": 10,
  "userId": 1,
  "name": "Entertainment",
  "type": "EXPENSE",
  "icon": "Film",
  "createdAt": "2025-10-07T12:00:00.000Z",
  "updatedAt": "2025-10-07T12:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Validation error
- `409 Conflict` - Category name already exists for user

---

### Update Category

**PATCH** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Movies & Series",
  "icon": "Tv"
}
```

**Response (200 OK):**
```json
{
  "id": 10,
  "userId": 1,
  "name": "Movies & Series",
  "type": "EXPENSE",
  "icon": "Tv",
  "createdAt": "2025-10-07T12:00:00.000Z",
  "updatedAt": "2025-10-07T13:30:00.000Z"
}
```

---

### Delete Category

**DELETE** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Category deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Category not found or doesn't belong to user
- `400 Bad Request` - Cannot delete category with existing transactions

---

## Budget Endpoints

### List Budgets

**GET** `/api/budgets`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "categoryId": 1,
    "amount": 1000.00,
    "period": "MONTHLY",
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-10-31T23:59:59.999Z",
    "createdAt": "2025-10-01T10:00:00.000Z",
    "updatedAt": "2025-10-01T10:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Food",
      "icon": "ShoppingCart",
      "type": "EXPENSE"
    },
    "spent": 756.50,
    "progress": 75.65,
    "status": "warning"
  }
]
```

**Progress Calculation:**
- `spent`: Sum of transactions in category for budget period
- `progress`: (spent / amount) * 100
- `status`: 
  - `ok` (< 80%)
  - `warning` (80-99%)
  - `exceeded` (≥ 100%)

---

### Create Budget

**POST** `/api/budgets`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryId": 1,
  "amount": 1000.00,
  "period": "MONTHLY",
  "startDate": "2025-10-01"
}
```

**Validation Rules:**
- `categoryId`: Required, integer
- `amount`: Required, number, > 0
- `period`: Required, enum (`MONTHLY` | `YEARLY`)
- `startDate`: Required, ISO date string
- `endDate`: Auto-calculated based on period

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 1,
  "amount": 1000.00,
  "period": "MONTHLY",
  "startDate": "2025-10-01T00:00:00.000Z",
  "endDate": "2025-10-31T23:59:59.999Z",
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T14:00:00.000Z"
}
```

**Errors:**
- `400 Bad Request` - Validation error
- `409 Conflict` - Budget already exists for category + startDate

---

### Update Budget

**PATCH** `/api/budgets/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "amount": 1200.00
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "categoryId": 1,
  "amount": 1200.00,
  "period": "MONTHLY",
  "startDate": "2025-10-01T00:00:00.000Z",
  "endDate": "2025-10-31T23:59:59.999Z",
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T15:30:00.000Z"
}
```

---

### Delete Budget

**DELETE** `/api/budgets/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Budget deleted successfully"
}
```

---

## Report Endpoints

### Monthly Summary

**GET** `/api/reports/summary`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `startDate` (required): ISO date string
- `endDate` (required): ISO date string

**Example Request:**
```
GET /api/reports/summary?startDate=2025-10-01&endDate=2025-10-31
```

**Response (200 OK):**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 3245.75,
  "balance": 1754.25,
  "transactionCount": 42,
  "period": {
    "start": "2025-10-01T00:00:00.000Z",
    "end": "2025-10-31T23:59:59.999Z"
  }
}
```

---

### Category Breakdown

**GET** `/api/reports/by-category`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `startDate` (required): ISO date string
- `endDate` (required): ISO date string
- `type` (optional): `INCOME` | `EXPENSE`

**Response (200 OK):**
```json
[
  {
    "categoryId": 1,
    "categoryName": "Food",
    "categoryIcon": "ShoppingCart",
    "total": 1250.50,
    "transactionCount": 18,
    "percentage": 38.5
  },
  {
    "categoryId": 3,
    "categoryName": "Transport",
    "categoryIcon": "Car",
    "total": 450.00,
    "transactionCount": 8,
    "percentage": 13.9
  }
]
```

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "amount",
      "message": "amount must be a positive number"
    }
  ]
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Unique constraint violation
- `500 Internal Server Error` - Server error

---

## Rate Limiting *(Coming in v1.0)*

**Limits:**
- Authenticated: 100 requests/minute
- Unauthenticated: 20 requests/minute

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696684800
```

---

**Last Updated:** October 7, 2025  
**Version:** v0.7.0
