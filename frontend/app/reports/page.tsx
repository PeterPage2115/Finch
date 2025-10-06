'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { fetchSummary, fetchByCategoryReport, ReportSummary, CategoryReport } from '@/lib/api/reportsClient';
import AppNavbar from '@/components/layout/AppNavbar';
import DateRangePicker from '@/components/reports/DateRangePicker';
import SummaryCards from '@/components/reports/SummaryCards';
import CategoryPieChart from '@/components/reports/CategoryPieChart';

/**
 * Reports Page - view financial reports and analytics
 */
export default function ReportsPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  // Get current month as default
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [categoryReport, setCategoryReport] = useState<CategoryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wait for hydration before checking auth
  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push('/login');
      return;
    }

    fetchReports();
  }, [token, hasHydrated, router, startDate, endDate]);

  const fetchReports = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch both reports in parallel
      const [summaryData, categoryData] = await Promise.all([
        fetchSummary(token, startDate, endDate),
        fetchByCategoryReport(token, startDate, endDate, 'EXPENSE'), // Focus on expenses
      ]);

      setSummary(summaryData);
      setCategoryReport(categoryData);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Błąd podczas pobierania raportów');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  // Redirect if not authenticated
  if (!hasHydrated) {
    return null; // Wait for hydration
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <AppNavbar />

      <div className="max-w-7xl mx-auto mt-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Raporty</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Analizuj swoje finanse i wydatki
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Date Range Picker */}
        <div className="mb-6">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Summary Cards */}
        <div className="mb-6">
          {summary ? (
            <SummaryCards summary={summary} isLoading={isLoading} />
          ) : (
            <SummaryCards
              summary={{
                startDate,
                endDate,
                totalIncome: 0,
                totalExpenses: 0,
                balance: 0,
                transactionCount: { income: 0, expenses: 0 },
              }}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Category Breakdown */}
        <div className="mb-6">
          <CategoryPieChart
            categories={categoryReport?.categories || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
