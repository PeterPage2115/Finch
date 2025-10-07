'use client';

import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

interface PeriodData {
  startDate: string;
  endDate: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

interface ChangeData {
  absolute: number;
  percentage: number;
}

interface TrendsComparisonData {
  currentPeriod: PeriodData;
  previousPeriod: PeriodData;
  changes: {
    income: ChangeData;
    expenses: ChangeData;
    balance: ChangeData;
  };
}

interface TrendsComparisonCardsProps {
  data: TrendsComparisonData;
}

export function TrendsComparisonCards({ data }: TrendsComparisonCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpIcon className="h-4 w-4" />;
    if (value < 0) return <ArrowDownIcon className="h-4 w-4" />;
    return <MinusIcon className="h-4 w-4" />;
  };

  const getChangeColor = (value: number, isExpense: boolean = false) => {
    if (value === 0) return 'text-gray-500';
    
    // For expenses: decrease is good (green), increase is bad (red)
    // For income/balance: increase is good (green), decrease is bad (red)
    if (isExpense) {
      return value > 0 ? 'text-red-500' : 'text-green-500';
    }
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  const cards = [
    {
      title: 'Wydatki',
      current: data.currentPeriod.expenses,
      previous: data.previousPeriod.expenses,
      change: data.changes.expenses,
      isExpense: true,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Przychody',
      current: data.currentPeriod.income,
      previous: data.previousPeriod.income,
      change: data.changes.income,
      isExpense: false,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Bilans',
      current: data.currentPeriod.balance,
      previous: data.previousPeriod.balance,
      change: data.changes.balance,
      isExpense: false,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg border ${card.borderColor} ${card.bgColor} p-6 shadow-sm transition-shadow hover:shadow-md`}
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {card.title}
          </h3>
          
          {/* Current Amount */}
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(card.current)}
          </div>

          {/* Previous Amount */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Poprzednio: {formatCurrency(card.previous)}
          </div>

          {/* Change Indicator */}
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${getChangeColor(card.change.absolute, card.isExpense)}`}
          >
            {getChangeIcon(card.change.absolute)}
            <span>{formatCurrency(Math.abs(card.change.absolute))}</span>
            <span className="text-xs">
              ({formatPercentage(card.change.percentage)})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
