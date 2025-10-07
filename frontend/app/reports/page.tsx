/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { fetchSummary, fetchByCategoryReport, ReportSummary, CategoryReport } from '@/lib/api/reportsClient';
import AppNavbar from '@/components/layout/AppNavbar';
import DateRangePicker from '@/components/reports/DateRangePicker';
import SummaryCards from '@/components/reports/SummaryCards';
import EnhancedCategoryPieChart from '@/components/reports/EnhancedCategoryPieChart';
import CategoryTrendChart from '@/components/reports/CategoryTrendChart';
import CategoryDetailsModal from '@/components/reports/CategoryDetailsModal';
import { TrendsComparisonCards } from '@/components/reports/TrendsComparisonCards';
import { MonthlyTrendChart } from '@/components/reports/MonthlyTrendChart';
import { ExportButtons } from '@/components/reports/ExportButtons';

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
  const [trendData, setTrendData] = useState<{ data: any[]; granularity: string } | null>(null);
  const [trendsComparison, setTrendsComparison] = useState<any>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Wait for hydration before checking auth
  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push('/login');
      return;
    }

    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hasHydrated, startDate, endDate]);

  const fetchReports = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all reports in parallel
      const [summaryData, categoryData, trendDataResult, comparisonData, monthlyData] = await Promise.all([
        fetchSummary(token, startDate, endDate),
        fetchByCategoryReport(token, startDate, endDate, 'EXPENSE'), // Focus on expenses
        fetch(
          `http://localhost:3001/reports/category-trend?startDate=${startDate}&endDate=${endDate}&granularity=daily`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => res.json()),
        fetch(
          `http://localhost:3001/reports/trends-comparison?startDate=${startDate}&endDate=${endDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => res.json()),
        fetch(
          `http://localhost:3001/reports/monthly-trend?months=6`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => res.json()),
      ]);

      setSummary(summaryData);
      setCategoryReport(categoryData);
      setTrendData(trendDataResult);
      setTrendsComparison(comparisonData);
      setMonthlyTrend(monthlyData);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Błąd podczas pobierania raportów');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
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

        {/* Export Buttons */}
        {token && (
          <div className="mb-6 flex justify-end">
            <ExportButtons startDate={startDate} endDate={endDate} token={token} />
          </div>
        )}

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

        {/* Trends Comparison Cards */}
        {trendsComparison && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Porównanie okresów
            </h2>
            <TrendsComparisonCards data={trendsComparison} />
          </div>
        )}

        {/* Category Breakdown */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Enhanced Pie Chart */}
          <EnhancedCategoryPieChart
            categories={categoryReport?.categories || []}
            onCategoryClick={handleCategoryClick}
          />

          {/* Trend Chart */}
          {trendData?.data && (
            <CategoryTrendChart
              data={trendData.data}
              granularity={
                (trendData.granularity as 'daily' | 'weekly' | 'monthly') || 'daily'
              }
            />
          )}
        </div>

        {/* Monthly Trend Chart */}
        {monthlyTrend?.data && (
          <div className="mb-6">
            <MonthlyTrendChart data={monthlyTrend.data} />
          </div>
        )}

        {/* Category Details Modal */}
        {selectedCategoryId && (
          <CategoryDetailsModal
            categoryId={selectedCategoryId}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </div>
  );
}
