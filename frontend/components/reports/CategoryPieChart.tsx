'use client';

import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryReportItem } from '@/lib/api/reportsClient';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface CategoryPieChartProps {
  categories: CategoryReportItem[];
  isLoading?: boolean;
}

/**
 * CategoryPieChart - visualize expenses/income by category
 * Optimized with React.memo + useMemo for expensive Recharts rendering
 */
function CategoryPieChart({ categories, isLoading }: CategoryPieChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Podział po kategorii
        </h3>
        <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
          Brak danych dla wybranego okresu
        </div>
      </div>
    );
  }

  // Prepare data for Recharts (memoized to avoid recalculation)
  const chartData = useMemo(
    () =>
      categories.map((cat) => ({
        name: cat.categoryName,
        value: cat.total,
        percentage: cat.percentage,
        color: cat.categoryColor,
      })),
    [categories]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value.toFixed(2)} zł ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({ name, percentage }: any) => {
    return `${name} (${percentage.toFixed(1)}%)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Podział po kategorii
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={renderLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string, entry: any) => (
              <span className="text-gray-700 dark:text-gray-300">
                {value} ({entry.payload.percentage.toFixed(1)}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category list */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Szczegóły
        </h4>
        {categories.slice(0, 5).map((cat) => (
          <div
            key={cat.categoryId}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.categoryColor }}
              ></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white inline-flex items-center gap-2">
                <CategoryIcon iconName={cat.categoryIcon} color={cat.categoryColor} size={16} />
                {cat.categoryName}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {cat.total.toFixed(2)} zł
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {cat.percentage.toFixed(1)}% ({cat.transactionCount} transakcji)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CategoryPieChart);
