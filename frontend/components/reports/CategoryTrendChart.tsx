'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  income: number;
  expense: number;
  count: number;
}

interface CategoryTrendChartProps {
  data: TrendDataPoint[];
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export default function CategoryTrendChart({
  data,
  granularity = 'daily',
}: CategoryTrendChartProps) {
  const formatXAxis = (value: string) => {
    if (granularity === 'weekly') {
      // Format: 2025-W42 → W42
      return value.split('-')[1] || value;
    }
    if (granularity === 'monthly') {
      // Format: 2025-10 → Oct
      const [year, month] = value.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('pl-PL', { month: 'short' });
    }
    // Daily: 2025-10-07 → 07 Paź
    const date = new Date(value);
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: item.date,
      Przychody: item.income,
      Wydatki: item.expense,
      Ilość: item.count,
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Brak danych do wyświetlenia</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Trend wydatków i przychodów
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name,
            ]}
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: '1px solid rgb(75 85 99)',
              borderRadius: '8px',
              color: 'rgb(243 244 246)',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar
            dataKey="Przychody"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
          <Bar
            dataKey="Wydatki"
            fill="#ef4444"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
