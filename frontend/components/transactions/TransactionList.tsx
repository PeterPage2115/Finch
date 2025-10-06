/**
 * TransactionList Component
 * 
 * Wyświetla listę transakcji w tabeli z akcjami edit/delete
 */

'use client';

import { Transaction, TransactionType } from '@/types/transaction';
import { getCategoryIcon } from '@/lib/utils/categoryIcons';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Ładowanie transakcji...</span>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Brak transakcji
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Dodaj pierwszą transakcję, aby rozpocząć śledzenie finansów.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    // Prisma zwraca Decimal jako string, więc konwertujemy na number
    const numAmount = Number(amount) || 0;
    const formatted = numAmount.toFixed(2);
    const colorClass = type === TransactionType.INCOME 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
    const sign = type === TransactionType.INCOME ? '+' : '-';
    return <span className={`font-semibold ${colorClass}`}>{sign} {formatted} zł</span>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Opis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Typ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kwota
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {transaction.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transaction.category && (() => {
                    const IconComponent = getCategoryIcon(transaction.category.icon || 'HelpCircle');
                    return (
                      <span className="inline-flex items-center gap-2">
                        <IconComponent 
                          style={{ color: transaction.category.color || '#6b7280' }} 
                          size={18} 
                        />
                        <span className="text-gray-900 dark:text-gray-100">{transaction.category.name}</span>
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === TransactionType.INCOME
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {transaction.type === TransactionType.INCOME ? 'Przychód' : 'Wydatek'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {formatAmount(transaction.amount, transaction.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 transition"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (visible only on mobile) */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction) => {
          const IconComponent = transaction.category 
            ? getCategoryIcon(transaction.category.icon || 'HelpCircle')
            : null;
          
          return (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
              {/* Header: Date & Amount */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </span>
                <div className="text-right">
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
              </div>

              {/* Description */}
              {transaction.description && (
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  {transaction.description}
                </p>
              )}

              {/* Category & Type */}
              <div className="flex items-center gap-3 mb-3">
                {transaction.category && IconComponent && (
                  <div className="flex items-center gap-2">
                    <IconComponent 
                      style={{ color: transaction.category.color || '#6b7280' }} 
                      size={18} 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {transaction.category.name}
                    </span>
                  </div>
                )}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === TransactionType.INCOME
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}
                >
                  {transaction.type === TransactionType.INCOME ? 'Przychód' : 'Wydatek'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => onEdit(transaction)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition"
                >
                  Usuń
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
