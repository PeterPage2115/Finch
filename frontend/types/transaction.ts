/**
 * Transaction Types
 * 
 * Typy dla transakcji odpowiadające modelowi Prisma
 */

/**
 * Typ transakcji
 */
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

/**
 * Kategoria transakcji
 */
export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  color?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transakcja (response z API)
 */
export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  description: string | null;
  date: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
  category?: Category; // Include z backendu
}

/**
 * DTO dla tworzenia transakcji
 */
export interface CreateTransactionDto {
  amount: number;
  description?: string;
  date: string; // ISO 8601 format
  type: TransactionType;
  categoryId: string;
}

/**
 * DTO dla aktualizacji transakcji (wszystkie pola opcjonalne)
 */
export interface UpdateTransactionDto {
  amount?: number;
  description?: string;
  date?: string;
  type?: TransactionType;
  categoryId?: string;
}

/**
 * Query parameters dla filtrowania i paginacji
 */
export interface TransactionQueryParams {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Odpowiedź z listą transakcji (z paginacją)
 */
export interface TransactionsListResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Odpowiedź z usuwania transakcji
 */
export interface DeleteTransactionResponse {
  message: string;
}
