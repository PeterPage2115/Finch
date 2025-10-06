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
  color: string; // hex color (e.g., "#ef4444")
  icon: string;  // lucide-react icon name (e.g., "UtensilsCrossed")
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
  color: string;  // required - hex color
  icon: string;   // required - lucide-react icon name
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}

/**
 * Pobiera wszystkie kategorie użytkownika
 */
async function getAll(token: string): Promise<Category[]> {
  return apiClient.get<Category[]>('/categories', token);
}

/**
 * Pobiera pojedynczą kategorię
 */
async function getById(token: string, id: string): Promise<Category> {
  return apiClient.get<Category>(`/categories/${id}`, token);
}

/**
 * Tworzy nową kategorię
 */
async function create(token: string, data: CreateCategoryDto): Promise<Category> {
  return apiClient.post<Category>('/categories', data, token);
}

/**
 * Aktualizuje kategorię
 */
async function update(
  token: string,
  id: string,
  data: UpdateCategoryDto
): Promise<Category> {
  return apiClient.patch<Category>(`/categories/${id}`, data, token);
}

/**
 * Usuwa kategorię
 */
async function deleteCategory(token: string, id: string): Promise<void> {
  return apiClient.delete(`/categories/${id}`, token);
}

export const categoriesApi = {
  getAll,
  getById,
  create,
  update,
  delete: deleteCategory,
};
