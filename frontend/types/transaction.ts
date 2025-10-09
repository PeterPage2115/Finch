/**
 * Transaction Types
 * 
 * Types for transactions matching Prisma model
 */

/**
 * Transaction type
 */
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

/**
 * Transaction category
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
 * Transaction (API response)
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
  category?: Category; // Include from backend
}

/**
 * DTO for creating a transaction
 */
export interface CreateTransactionDto {
  amount: number;
  description?: string;
  date: string; // ISO 8601 format
  type: TransactionType;
  categoryId: string;
}

/**
 * DTO for updating a transaction (all fields optional)
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
 * Response with transaction list (with pagination)
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
 * Response from deleting a transaction
 */
export interface DeleteTransactionResponse {
  message: string;
}
