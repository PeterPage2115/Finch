/**
 * Transactions Store (Zustand)
 * 
 * State management for transactions with localStorage persistence
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
       * Sets transaction list with metadata
       */
      setTransactions: (response: TransactionsListResponse) =>
        set({
          transactions: response.data,
          meta: response.meta,
          error: null,
        }),

      /**
       * Sets currently selected transaction
       */
      setCurrentTransaction: (transaction: Transaction | null) =>
        set({ currentTransaction: transaction }),

      /**
       * Adds new transaction to list (optimistic update)
       */
      addTransaction: (transaction: Transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          meta: state.meta
            ? { ...state.meta, total: state.meta.total + 1 }
            : null,
        })),

      /**
       * Updates transaction in list
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
       * Removes transaction from list
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
       * Sets filters
       */
      setFilters: (filters: TransactionQueryParams) =>
        set({ filters }),

      /**
       * Sets loading state
       */
      setLoading: (isLoading: boolean) =>
        set({ isLoading }),

      /**
       * Sets error
       */
      setError: (error: string | null) =>
        set({ error, isLoading: false }),

      /**
       * Clears all transactions (e.g., on logout)
       */
      clearTransactions: () =>
        set(initialState),
    }),
    {
      name: 'transactions-storage', // localStorage key name
      partialize: (state) => ({
        // Nie zapisujemy loading/error states
        transactions: state.transactions,
        meta: state.meta,
        filters: state.filters,
      }),
    }
  )
);
