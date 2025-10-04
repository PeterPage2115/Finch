/**
 * Categories API Client
 * 
 * Klient do komunikacji z API kategorii
 */

import { apiClient } from './client';
import { TransactionType } from '@/types/transaction';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string | null;
  createdAt: string;
}

/**
 * Pobiera wszystkie kategorie użytkownika
 */
export async function getAll(token: string): Promise<Category[]> {
  return apiClient.get<Category[]>('/categories', token);
}

export const categoriesApi = {
  getAll,
};
