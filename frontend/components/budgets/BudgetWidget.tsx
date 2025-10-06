import Link from 'next/link';
import { BudgetWithProgress } from '@/types';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { getCategoryIcon, getCategoryIconColor } from '@/lib/utils/categoryIcons';

interface BudgetWidgetProps {
  budgets: BudgetWithProgress[];
  isLoading: boolean;
}

/**
 * Dashboard widget showing top 3 budgets by usage percentage.
 * Displays compact budget info with progress bars.
 */
export default function BudgetWidget({ budgets, isLoading }: BudgetWidgetProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (budgets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
          Budżety
        </h3>
        <Link
          href="/budgets"
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Zobacz wszystkie
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Budget Items */}
      <div className="space-y-4">
        {budgets.map((budget) => (
          <BudgetWidgetItem key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact budget item for dashboard widget.
 */
function BudgetWidgetItem({ budget }: { budget: BudgetWithProgress }) {
  const { category, progress } = budget;

  // Get icon
  const IconComponent = getCategoryIcon(category?.icon, category?.name);
  const iconColorClass = getCategoryIconColor(category?.type || 'EXPENSE');

  // Format amounts
  const spent = progress.spent.toFixed(0);
  const limit = progress.limit.toFixed(0);
  const percentage = Math.round(progress.percentage);

  // Badge color based on percentage
  let badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'; // <80%
  if (percentage >= 100) {
    badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'; // >=100%
  } else if (percentage >= 80) {
    badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'; // 80-99%
  }

  return (
    <div className="space-y-2">
      {/* Category & Amount */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IconComponent className={`${iconColorClass} dark:opacity-90`} size={18} />
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {category?.name || 'Kategoria'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {spent} / {limit} zł
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentage >= 100
              ? 'bg-red-500 dark:bg-red-600'
              : percentage >= 80
              ? 'bg-yellow-500 dark:bg-yellow-600'
              : 'bg-green-500 dark:bg-green-600'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for budget widget.
 */
function LoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Empty state when user has no budgets.
 */
function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
          Budżety
        </h3>
      </div>
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Nie masz jeszcze żadnych budżetów
        </p>
        <Link
          href="/budgets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Dodaj pierwszy budżet
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
