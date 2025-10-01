/**
 * User related types
 */
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication types
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

/**
 * Transaction types
 */
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  categoryId?: string;
  description: string;
  date: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  type: TransactionType;
}

/**
 * Category types
 */
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
}

/**
 * Budget types
 */
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  period: 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDto {
  categoryId: string;
  amount: number;
  period: 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
