'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTransactionsStore } from '@/lib/stores/transactionsStore';
import { useTheme } from '@/lib/hooks/useTheme';
import { transactionsApi } from '@/lib/api/transactionsClient';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import type { Transaction, CreateTransactionDto, TransactionType } from '@/types/transaction';

// Mock categories (temporary - will be replaced with API)
const MOCK_CATEGORIES = [
  { id: '5e72ea07-a66c-4194-aa82-da4b9b58c7c6', name: 'Jedzenie', icon: '🍔', type: 'EXPENSE' as TransactionType },
  { id: '521654d7-cf7f-43ca-96aa-9ef4d1d21af1', name: 'Transport', icon: '🚗', type: 'EXPENSE' as TransactionType },
  { id: 'f9fcdf43-dc03-46f1-8ca8-05de740133b0', name: 'Wynagrodzenie', icon: '💰', type: 'INCOME' as TransactionType },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, token } = useAuthStore();
  const { theme, toggleTheme, mounted } = useTheme();
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

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  // Fetch transactions
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await transactionsApi.getAll(token, { page: 1, limit: 50 });
        setTransactions(response);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        const errorMessage = err?.message || 'Nie udało się pobrać transakcji';
        setError(errorMessage);
        // Set empty transactions to prevent undefined errors
        setTransactions({ data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, token, setTransactions, setLoading, setError]);

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
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Nie udało się usunąć transakcji');
    }
  };

  // Calculate stats (defensive programming - handle undefined/empty transactions)
  const safeTransactions = transactions || [];
  const stats = {
    income: safeTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (t.amount || 0), 0),
    expenses: safeTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (t.amount || 0), 0),
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
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                💰 Tracker Kasy
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              )}
              <div className="text-sm">
                <p className="text-gray-700 dark:text-gray-200 font-medium">{user?.name || 'Użytkownik'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Witaj, {user?.name || 'Użytkowniku'}! 👋
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

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md transition"
          >
            + Dodaj transakcję
          </button>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <div className="mb-6">
            <TransactionForm
              transaction={editingTransaction}
              categories={MOCK_CATEGORIES}
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
