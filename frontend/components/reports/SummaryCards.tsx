'use client';

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ReportSummary } from '@/lib/api/reportsClient';

interface SummaryCardsProps {
  summary: ReportSummary;
  isLoading?: boolean;
}

/**
 * SummaryCards - display income/expense/balance overview
 */
export default function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Przychody',
      value: summary.totalIncome,
      count: summary.transactionCount.income,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
    },
    {
      title: 'Wydatki',
      value: summary.totalExpenses,
      count: summary.transactionCount.expenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
    },
    {
      title: 'Bilans',
      value: summary.balance,
      count: summary.transactionCount.income + summary.transactionCount.expenses,
      icon: DollarSign,
      color: summary.balance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-500',
      bgColor: summary.balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-red-50 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon size={20} className={card.color} />
              </div>
            </div>
            <p className={`text-3xl font-bold mb-1 ${card.color}`}>
              {card.value.toFixed(2)} zł
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.count} {card.count === 1 ? 'transakcja' : 'transakcje'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
