'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTransactionsStore } from '@/lib/stores/transactionsStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { transactionsApi } from '@/lib/api/transactionsClient';
import { categoriesApi, type Category } from '@/lib/api/categoriesClient';
import { fetchBudgets, fetchBudgetById } from '@/lib/api/budgetsClient';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import ImportTransactionsButton from '@/components/transactions/ImportTransactionsButton';
import ImportResultsModal from '@/components/transactions/ImportResultsModal';
import AppNavbar from '@/components/layout/AppNavbar';
import BudgetWidget from '@/components/budgets/BudgetWidget';
import type { Transaction, CreateTransactionDto, ImportResultDto } from '@/types/transaction';
import type { BudgetWithProgress } from '@/types';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, token, _hasHydrated } = useAuthStore();
  const { addNotification } = useNotificationStore();
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
  
  // CSV Import state
  const [importResult, setImportResult] = useState<ImportResultDto | null>(null);
  const [showImportResults, setShowImportResults] = useState(false);
  
  // Budget widget state
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);

  const handleErrorMessage = useCallback((err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return fallback;
  }, []);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!_hasHydrated) return;

    // Ensure the user is authenticated
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
      } catch (err) {
        console.error('Error fetching data:', err);
  setError(handleErrorMessage(err, 'Failed to fetch data'));
        // Set empty data to prevent undefined errors
        setTransactions({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } });
        setCategories([]);
        setBudgets([]);
      } finally {
        setLoading(false);
        setBudgetsLoading(false);
      }
    };

    void fetchData();
  }, [handleErrorMessage, isAuthenticated, setError, setLoading, setTransactions, token]);

  // Refetch budgets (called after transaction create/update/delete)
  const refetchBudgets = useCallback(async () => {
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
  }, [token]);

  const handleAddNew = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingTransaction(null);
  }, []);

  const handleSubmit = async (data: CreateTransactionDto) => {
    if (!token) {
  addNotification('Missing authentication token', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingTransaction) {
        const updated = await transactionsApi.update(token, editingTransaction.id, data);
        updateTransactionInStore(editingTransaction.id, updated);
  addNotification('Transaction updated successfully', 'success');
      } else {
        const created = await transactionsApi.create(token, data);
        addTransaction(created);
  addNotification('Transaction added successfully', 'success');
      }

      setShowForm(false);
      setEditingTransaction(null);
      
      // Refetch budgets to update widget with new transaction
      await refetchBudgets();
    } catch (err) {
      console.error('Error submitting transaction:', err);
  addNotification(handleErrorMessage(err, 'Unable to save the transaction'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportComplete = useCallback(async (result: ImportResultDto) => {
    setImportResult(result);
    setShowImportResults(true);

    // Refetch transactions and budgets after successful import
    if (result.successCount > 0 && token) {
      try {
        const response = await transactionsApi.getAll(token);
        setTransactions(response);
        await refetchBudgets();
      } catch (err) {
        console.error('Error refetching data after import:', err);
      }
    }
  }, [token, setTransactions, refetchBudgets]);

  const handleCloseImportResults = useCallback(() => {
    setShowImportResults(false);
    setImportResult(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!token) {
  addNotification('Missing authentication token', 'error');
      return;
    }
  if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionsApi.delete(token, id);
      removeTransaction(id);
  addNotification('Transaction deleted successfully', 'success');
      
      // Refetch budgets to update widget after transaction deletion
      await refetchBudgets();
    } catch (err) {
      console.error('Error deleting transaction:', err);
  addNotification(handleErrorMessage(err, 'Unable to delete the transaction'), 'error');
    }
  }, [addNotification, handleErrorMessage, refetchBudgets, removeTransaction, token]);

  // Calculate stats (defensive programming - handle undefined/empty transactions)
  const stats = {
    income: transactions
      .filter(t => t && t.type === 'INCOME')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    expenses: transactions
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
          <p className="mt-4 text-gray-600">Loading...</p>
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
            Welcome, {user?.name || 'there'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This is your dashboard. Manage your finances from here.
          </p>
        </div>

        {/* Quick Stats - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Income Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Income</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.income)}</p>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This month</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.expenses)}</p>
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This month</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance</p>
                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.balance)}
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This month</p>
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
        <div className="mb-6 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md transition"
          >
            + Add transaction
          </motion.button>

          <ImportTransactionsButton onImportComplete={handleImportComplete} />
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
            Showing {transactions.length} of {meta.total} transactions
            {meta.totalPages > 1 && ` (page ${meta.page} of ${meta.totalPages})`}
          </div>
        )}

        {/* Import Results Modal */}
        <ImportResultsModal
          isOpen={showImportResults}
          result={importResult}
          onClose={handleCloseImportResults}
        />
      </main>
    </div>
  );
}
