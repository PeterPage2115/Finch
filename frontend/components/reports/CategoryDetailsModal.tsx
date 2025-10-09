'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { API_URL } from '@/lib/api/config';
import { useAuthStore } from '@/lib/stores/authStore';

interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

interface CategoryDetailsData {
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    type: 'INCOME' | 'EXPENSE';
  };
  summary: {
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
  };
  transactions: Transaction[];
  period: {
    startDate: string;
    endDate: string;
  };
}

interface CategoryDetailsModalProps {
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
}

export default function CategoryDetailsModal({
  categoryId,
  isOpen,
  onClose,
  startDate,
  endDate,
}: CategoryDetailsModalProps) {
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState<CategoryDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !categoryId || !token) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/reports/category/${categoryId}/details?startDate=${startDate}&endDate=${endDate}`;
        console.log('Fetching category details:', { categoryId, startDate, endDate, url, hasToken: !!token });

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status, response.statusText);

        if (!response.ok) {
          // Try to get error message from backend
          let errorMessage = 'Nie udało się pobrać szczegółów kategorii';
          try {
            const errorData = await response.json();
            console.error('Backend error:', errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Could not parse error response:', parseError);
          }
          
          throw new Error(`${errorMessage} (Status: ${response.status})`);
        }

        const result = await response.json();
        console.log('Category details loaded:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching category details:', err);
        setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [categoryId, isOpen, startDate, endDate, token]);

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6"
          style={{ borderTopColor: data?.category.color || undefined }}
        >
          <div className="flex items-center gap-3">
            {data?.category.icon && (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: data.category.color || '#9ca3af' }}
              >
                <CategoryIcon 
                  iconName={data.category.icon} 
                  color="#ffffff"
                  size={24}
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {data?.category.name || 'Kategoria'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data?.period.startDate} - {data?.period.endDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 dark:text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {data && !isLoading && !error && (
            <>
              {/* Summary Cards */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(data.summary.totalAmount)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(data.summary.averageAmount)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.summary.transactionCount}
                  </p>
                </div>
              </div>

              {/* Transactions List */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Transaction List
                </h3>
                {data.transactions.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No transactions in this period
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description || 'Bez opisu'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-semibold ${
                              transaction.type === 'INCOME'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
