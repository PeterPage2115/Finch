'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Info } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CategoryData {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  total: number;
  percentage: number;
  transactionCount: number;
}

interface EnhancedCategoryPieChartProps {
  categories: CategoryData[];
  onCategoryClick?: (categoryId: string) => void;
}

export default function EnhancedCategoryPieChart({
  categories,
  onCategoryClick,
}: EnhancedCategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = categories.map((cat) => ({
    name: cat.categoryName,
    value: cat.total,
    percentage: cat.percentage,
    color: cat.categoryColor || '#9ca3af',
    categoryId: cat.categoryId,
    count: cat.transactionCount,
  }));

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const handleClick = (data: typeof chartData[0]) => {
    if (onCategoryClick) {
      onCategoryClick(data.categoryId);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No data to display</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kwota: <span className="font-medium">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Procent: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transactions: <span className="font-medium">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }: any) => {
    if (percentage < 5) return null; // Hide labels for small segments

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Rozkład wydatków według kategorii
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={(data) => handleClick(data)}
            className="cursor-pointer outline-none focus:outline-none"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
                style={{
                  filter:
                    activeIndex === index
                      ? 'brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                      : 'brightness(1)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={60}
            iconType="circle"
            wrapperStyle={{ 
              paddingTop: '20px',
              lineHeight: '24px'
            }}
            layout="horizontal"
            align="center"
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700 dark:text-gray-300 inline-block px-2 py-1">
                {value} ({entry.payload.percentage.toFixed(1)}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {onCategoryClick && (
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
          <Info size={14} />
          Kliknij na segment aby zobaczyć szczegóły
        </p>
      )}
    </div>
  );
}
