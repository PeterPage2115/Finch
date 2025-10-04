/**
 * Transactions API Client
 * 
 * Service dla operacji CRUD na transakcjach
 */

import { apiClient } from './client';
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryParams,
  TransactionsListResponse,
  DeleteTransactionResponse,
} from '@/types/transaction';

/**
 * Transactions API Service
 */
export const transactionsApi = {
  /**
   * Pobiera listę transakcji z filtrami i paginacją
   * 
   * @param token - JWT token
   * @param params - query parameters (filters, pagination)
   * @returns Lista transakcji z metadanymi
   * 
   * @example
   * const { data, meta } = await transactionsApi.getAll(token, {
   *   type: 'EXPENSE',
   *   startDate: '2025-01-01',
   *   page: 1,
   *   limit: 10
   * });
   */
  async getAll(
    token: string,
    params?: TransactionQueryParams
  ): Promise<TransactionsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';

    return apiClient.get<TransactionsListResponse>(endpoint, token);
  },

  /**
   * Pobiera pojedynczą transakcję po ID
   * 
   * @param token - JWT token
   * @param id - UUID transakcji
   * @returns Transakcja z kategorią
   * 
   * @example
   * const transaction = await transactionsApi.getById(token, 'uuid-here');
   */
  async getById(token: string, id: string): Promise<Transaction> {
    return apiClient.get<Transaction>(`/transactions/${id}`, token);
  },

  /**
   * Tworzy nową transakcję
   * 
   * @param token - JWT token
   * @param data - dane transakcji
   * @returns Utworzona transakcja
   * 
   * @example
   * const transaction = await transactionsApi.create(token, {
   *   amount: 123.45,
   *   description: 'Zakupy',
   *   date: new Date().toISOString(),
   *   type: 'EXPENSE',
   *   categoryId: 'category-uuid'
   * });
   */
  async create(
    token: string,
    data: CreateTransactionDto
  ): Promise<Transaction> {
    return apiClient.post<Transaction>('/transactions', data, token);
  },

  /**
   * Aktualizuje transakcję (częściowa aktualizacja)
   * 
   * @param token - JWT token
   * @param id - UUID transakcji
   * @param data - dane do aktualizacji (wszystkie pola opcjonalne)
   * @returns Zaktualizowana transakcja
   * 
   * @example
   * const updated = await transactionsApi.update(token, 'uuid', {
   *   amount: 999.99,
   *   description: 'Nowy opis'
   * });
   */
  async update(
    token: string,
    id: string,
    data: UpdateTransactionDto
  ): Promise<Transaction> {
    return apiClient.patch<Transaction>(`/transactions/${id}`, data, token);
  },

  /**
   * Usuwa transakcję
   * 
   * @param token - JWT token
   * @param id - UUID transakcji
   * @returns Potwierdzenie usunięcia
   * 
   * @example
   * const result = await transactionsApi.delete(token, 'uuid');
   * console.log(result.message); // "Transaction deleted successfully"
   */
  async delete(token: string, id: string): Promise<DeleteTransactionResponse> {
    return apiClient.delete<DeleteTransactionResponse>(`/transactions/${id}`, token);
  },
};
