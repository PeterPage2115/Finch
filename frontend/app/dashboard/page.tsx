'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTransactionsStore } from '@/lib/stores/transactionsStore';
import { transactionsApi } from '@/lib/api/transactionsClient';
import { categoriesApi, type Category } from '@/lib/api/categoriesClient';
import { fetchBudgets, fetchBudgetById } from '@/lib/api/budgetsClient';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import AppNavbar from '@/components/layout/AppNavbar';
import BudgetWidget from '@/components/budgets/BudgetWidget';
import type { Transaction, CreateTransactionDto, TransactionType } from '@/types/transaction';
import type { BudgetWithProgress } from '@/types';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, token, _hasHydrated } = useAuthStore();
  const {
    transactions,
    meta,
    isLoading: transactionsLoading,
    error,
    setTransactions,
    addTransaction,
    updateTransaction: updateTransactionInStore,
    removeTransaction,
    setLoading,
    setError,
  } = useTransactionsStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Budget widget state
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;
    
    // Sprawdź czy użytkownik jest zalogowany
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, _hasHydrated, router]);

  // Fetch transactions
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setBudgetsLoading(true);
        setError(null);
        
        // Fetch transactions, categories, and budgets in parallel
        const [transactionsResponse, categoriesResponse, budgetsResponse] = await Promise.all([
          transactionsApi.getAll(token, { page: 1, limit: 50 }),
          categoriesApi.getAll(token),
          fetchBudgets(token).catch(() => []), // Graceful fallback for budgets
        ]);
        
        setTransactions(transactionsResponse);
        setCategories(categoriesResponse);
        
        // Fetch progress for top budgets (limit to 5 to reduce API calls)
        if (budgetsResponse.length > 0) {
          try {
            const budgetsWithProgress = await Promise.all(
              budgetsResponse.slice(0, 5).map(async (budget) => {
                try {
                  return await fetchBudgetById(token, budget.id);
                } catch {
                  // Fallback for individual budget fetch failure
                  return null;
                }
              })
            );
            
            // Filter out nulls and sort by percentage DESC, take top 3
            const validBudgets = budgetsWithProgress.filter((b): b is BudgetWithProgress => b !== null);
            const topBudgets = validBudgets
              .sort((a, b) => b.progress.percentage - a.progress.percentage)
              .slice(0, 3);
            
            setBudgets(topBudgets);
          } catch (err) {
            console.error('Error fetching budget progress:', err);
            setBudgets([]);
          }
        } else {
          setBudgets([]);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        const errorMessage = err?.message || 'Nie udało się pobrać danych';
        setError(errorMessage);
        // Set empty data to prevent undefined errors
        setTransactions({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } });
        setCategories([]);
        setBudgets([]);
      } finally {
        setLoading(false);
        setBudgetsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, setTransactions, setLoading, setError]);

  // Refetch budgets (called after transaction create/update/delete)
  const refetchBudgets = async () => {
    if (!token) return;
    
    try {
      setBudgetsLoading(true);
      const budgetsResponse = await fetchBudgets(token).catch(() => []);
      
      if (budgetsResponse.length > 0) {
        const budgetsWithProgress = await Promise.all(
          budgetsResponse.slice(0, 5).map(async (budget) => {
            try {
              return await fetchBudgetById(token, budget.id);
            } catch {
              return null;
            }
          })
        );
        
        const validBudgets = budgetsWithProgress.filter((b): b is BudgetWithProgress => b !== null);
        const topBudgets = validBudgets
          .sort((a, b) => b.progress.percentage - a.progress.percentage)
          .slice(0, 3);
        
        setBudgets(topBudgets);
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error('Error refetching budgets:', err);
    } finally {
      setBudgetsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (data: CreateTransactionDto) => {
    if (!token) return;

    try {
      setIsSubmitting(true);

      if (editingTransaction) {
        const updated = await transactionsApi.update(token, editingTransaction.id, data);
        updateTransactionInStore(editingTransaction.id, updated);
      } else {
        const created = await transactionsApi.create(token, data);
        addTransaction(created);
      }

      setShowForm(false);
      setEditingTransaction(null);
      
      // Refetch budgets to update widget with new transaction
      await refetchBudgets();
    } catch (err) {
      console.error('Error submitting transaction:', err);
      alert('Nie udało się zapisać transakcji');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Czy na pewno chcesz usunąć tę transakcję?')) return;

    try {
      await transactionsApi.delete(token, id);
      removeTransaction(id);
      
      // Refetch budgets to update widget after transaction deletion
      await refetchBudgets();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Nie udało się usunąć transakcji');
    }
  };

  // Calculate stats (defensive programming - handle undefined/empty transactions)
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const stats = {
    income: safeTransactions
      .filter(t => t && t.type === 'INCOME')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    expenses: safeTransactions
      .filter(t => t && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    balance: 0,
  };
  stats.balance = stats.income - stats.expenses;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation Bar */}
      <AppNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Witaj, {user?.name || 'Użytkowniku'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            To jest Twój dashboard. Tutaj będziesz mógł zarządzać swoimi finansami.
          </p>
        </div>

        {/* Quick Stats - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Income Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Przychody</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.income.toFixed(2)} zł</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ten miesiąc</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wydatki</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expenses.toFixed(2)} zł</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ten miesiąc</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bilans</p>
                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stats.balance.toFixed(2)} zł
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ten miesiąc</p>
          </div>
        </div>

        {/* Budget Widget */}
        <div className="mb-6">
          <BudgetWidget budgets={budgets} isLoading={budgetsLoading} />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md transition"
          >
            + Dodaj transakcję
          </motion.button>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <div className="mb-6">
            <TransactionForm
              transaction={editingTransaction}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Transactions List */}
        <TransactionList
          transactions={transactions}
          isLoading={transactionsLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination info */}
        {meta && meta.total > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Pokazuję {transactions.length} z {meta.total} transakcji
            {meta.totalPages > 1 && ` (strona ${meta.page} z ${meta.totalPages})`}
          </div>
        )}
      </main>
    </div>
  );
}
