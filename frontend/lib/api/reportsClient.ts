const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ReportSummary {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: {
    income: number;
    expenses: number;
  };
}

export interface CategoryReportItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;  // lucide-react icon name
  categoryColor: string; // hex color
  total: number;
  percentage: number;
  transactionCount: number;
}

export interface CategoryReport {
  startDate: string;
  endDate: string;
  type: 'INCOME' | 'EXPENSE' | 'ALL';
  categories: CategoryReportItem[];
  totalAmount: number;
}

/**
 * Fetch summary report (income vs expenses)
 */
export async function fetchSummary(
  token: string,
  startDate: string,
  endDate: string,
): Promise<ReportSummary> {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await fetch(`${API_URL}/reports/summary?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch summary report');
  }

  return response.json();
}

/**
 * Fetch category breakdown report
 */
export async function fetchByCategoryReport(
  token: string,
  startDate: string,
  endDate: string,
  type?: 'INCOME' | 'EXPENSE',
): Promise<CategoryReport> {
  const params = new URLSearchParams({ startDate, endDate });
  if (type) {
    params.append('type', type);
  }

  const response = await fetch(`${API_URL}/reports/by-category?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch category report');
  }

  return response.json();
}
