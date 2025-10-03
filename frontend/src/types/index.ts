/**
 * Typy wspólne dla całej aplikacji
 */

/**
 * Użytkownik
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Odpowiedź z API Auth (login/register)
 */
export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

/**
 * Błąd z API
 */
export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}
