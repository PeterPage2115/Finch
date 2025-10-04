/**
 * Transactions Store (Zustand)
 * 
 * State management dla transakcji z persist do localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Transaction,
  TransactionQueryParams,
  TransactionsListResponse,
} from '@/types/transaction';

/**
 * Stan store
 */
interface TransactionsState {
  // Data
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  
  // Pagination & filters
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  filters: TransactionQueryParams;
  
  // Loading & error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTransactions: (response: TransactionsListResponse) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updated: Transaction) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filters: TransactionQueryParams) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearTransactions: () => void;
}

/**
 * Initial state
 */
const initialState = {
  transactions: [],
  currentTransaction: null,
  meta: null,
  filters: {},
  isLoading: false,
  error: null,
};

/**
 * Transactions Store
 */
export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * Ustawia listę transakcji z metadanymi
       */
      setTransactions: (response: TransactionsListResponse) =>
        set({
          transactions: response.data,
          meta: response.meta,
          error: null,
        }),

      /**
       * Ustawia aktualnie wybraną transakcję
       */
      setCurrentTransaction: (transaction: Transaction | null) =>
        set({ currentTransaction: transaction }),

      /**
       * Dodaje nową transakcję do listy (optimistic update)
       */
      addTransaction: (transaction: Transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          meta: state.meta
            ? { ...state.meta, total: state.meta.total + 1 }
            : null,
        })),

      /**
       * Aktualizuje transakcję w liście
       */
      updateTransaction: (id: string, updated: Transaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? updated : t
          ),
          currentTransaction:
            state.currentTransaction?.id === id ? updated : state.currentTransaction,
        })),

      /**
       * Usuwa transakcję z listy
       */
      removeTransaction: (id: string) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          currentTransaction:
            state.currentTransaction?.id === id ? null : state.currentTransaction,
          meta: state.meta
            ? { ...state.meta, total: state.meta.total - 1 }
            : null,
        })),

      /**
       * Ustawia filtry
       */
      setFilters: (filters: TransactionQueryParams) =>
        set({ filters }),

      /**
       * Ustawia stan loading
       */
      setLoading: (isLoading: boolean) =>
        set({ isLoading }),

      /**
       * Ustawia błąd
       */
      setError: (error: string | null) =>
        set({ error, isLoading: false }),

      /**
       * Czyści wszystkie transakcje (np. przy wylogowaniu)
       */
      clearTransactions: () =>
        set(initialState),
    }),
    {
      name: 'transactions-storage', // Nazwa klucza w localStorage
      partialize: (state) => ({
        // Nie zapisujemy loading/error states
        transactions: state.transactions,
        meta: state.meta,
        filters: state.filters,
      }),
    }
  )
);
