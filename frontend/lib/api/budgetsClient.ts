import {
  Budget,
  BudgetWithProgress,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  QueryBudgetParams,
} from '@/types';
import apiClient from './client';

/**
 * API Client for Budgets operations.
 *
 * All requests go through Next.js API Routes (/api/budgets/*),
 * which proxy to backend (http://backend:3001/budgets/*).
 */

/**
 * Fetch all budgets for the current user with optional filters.
 */
export async function fetchBudgets(
  token: string,
  params?: QueryBudgetParams
): Promise<Budget[]> {
  const queryString = new URLSearchParams();

  if (params?.categoryId) {
    queryString.append('categoryId', params.categoryId);
  }

  if (params?.period) {
    queryString.append('period', params.period);
  }

  if (params?.active !== undefined) {
    queryString.append('active', params.active.toString());
  }

  const endpoint = `/budgets${queryString.toString() ? `?${queryString.toString()}` : ''}`;

  return apiClient.get<Budget[]>(endpoint, token);
}

/**
 * Fetch a single budget by ID with progress calculation.
 */
export async function fetchBudgetById(
  token: string,
  id: string
): Promise<BudgetWithProgress> {
  return apiClient.get<BudgetWithProgress>(`/budgets/${id}`, token);
}

/**
 * Create a new budget.
 */
export async function createBudget(
  token: string,
  data: CreateBudgetRequest
): Promise<Budget> {
  return apiClient.post<Budget>('/budgets', data, token);
}

/**
 * Update an existing budget.
 */
export async function updateBudget(
  token: string,
  id: string,
  data: UpdateBudgetRequest
): Promise<Budget> {
  return apiClient.patch<Budget>(`/budgets/${id}`, data, token);
}

/**
 * Delete a budget.
 */
export async function deleteBudget(
  token: string,
  id: string
): Promise<void> {
  return apiClient.delete<void>(`/budgets/${id}`, token);
}
