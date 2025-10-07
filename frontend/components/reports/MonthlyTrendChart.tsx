'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyDataPoint {
  month: string; // Format: "2025-01", "2025-02", etc.
  income: number;
  expenses: number;
  balance: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyDataPoint[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const formatXAxis = (monthStr: string) => {
    // Convert "2025-01" to "Sty"
    const [, month] = monthStr.split('-');
    const monthNames = [
      'Sty',
      'Lut',
      'Mar',
      'Kwi',
      'Maj',
      'Cze',
      'Lip',
      'Sie',
      'Wrz',
      'Paź',
      'Lis',
      'Gru',
    ];
    return monthNames[parseInt(month, 10) - 1] || monthStr;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Brak danych do wyświetlenia</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Trendy miesięczne
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
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
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label: string) => {
              const [year, month] = label.split('-');
              const monthNames = [
                'Styczeń',
                'Luty',
                'Marzec',
                'Kwiecień',
                'Maj',
                'Czerwiec',
                'Lipiec',
                'Sierpień',
                'Wrzesień',
                'Październik',
                'Listopad',
                'Grudzień',
              ];
              return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
            }}
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: '1px solid rgb(75 85 99)',
              borderRadius: '6px',
              fontSize: '14px',
              color: 'rgb(243 244 246)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                income: 'Przychody',
                expenses: 'Wydatki',
                balance: 'Bilans',
              };
              return labels[value] || value;
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
            name="expenses"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="balance"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
