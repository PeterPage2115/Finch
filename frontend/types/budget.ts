/**
 * Budget types for frontend.
 */

export type BudgetPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';

export const BudgetPeriod = {
  DAILY: 'DAILY' as BudgetPeriod,
  WEEKLY: 'WEEKLY' as BudgetPeriod,
  MONTHLY: 'MONTHLY' as BudgetPeriod,
  YEARLY: 'YEARLY' as BudgetPeriod,
  CUSTOM: 'CUSTOM' as BudgetPeriod,
};

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    color?: string;
    icon?: string;
  };
}

export interface BudgetProgress {
  spent: number;
  limit: number;
  percentage: number;
  remaining: number;
  alerts: string[]; // ['80%', '100%']
}

export interface BudgetWithProgress extends Budget {
  progress: BudgetProgress;
}

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601 (optional, required for CUSTOM)
}

export interface UpdateBudgetRequest {
  categoryId?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
}

export interface QueryBudgetParams {
  categoryId?: string;
  period?: BudgetPeriod;
  active?: boolean; // If true, return only active budgets (endDate >= NOW)
}
