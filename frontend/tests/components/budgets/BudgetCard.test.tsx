/**
 * BudgetCard Component Tests
 * 
 * Tests the budget display card with:
 * - Data rendering (category, period, dates, amounts)
 * - Progress bar integration
 * - User interactions (edit, delete buttons)
 * - Conditional styling based on budget status
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BudgetCard from '@/components/budgets/BudgetCard';
import { BudgetWithProgress } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const currencyText = (value: number): string => formatCurrency(value).replace(/\u00a0/g, ' ');

// Mock budget data factory
const createMockBudget = (overrides?: Partial<BudgetWithProgress>): BudgetWithProgress => ({
  id: 'budget-1',
  userId: 'user-1',
  categoryId: 'cat-1',
  amount: 1000,
  period: 'MONTHLY',
  startDate: '2025-10-01T00:00:00Z',
  endDate: '2025-10-31T23:59:59Z',
  createdAt: '2025-10-01T00:00:00Z',
  updatedAt: '2025-10-01T00:00:00Z',
  category: {
    id: 'cat-1',
    name: 'Food',
    icon: 'UtensilsCrossed',
    color: '#ef4444',
    type: 'EXPENSE',
  },
  progress: {
    spent: 500,
    limit: 1000,
    remaining: 500,
    percentage: 50,
    alerts: [],
  },
  ...overrides,
});

describe('BudgetCard', () => {
  describe('Data Rendering', () => {
    it('should render category name and icon', () => {
      const budget = createMockBudget();
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText('Food')).toBeInTheDocument();
      // Icon is rendered by CategoryIcon component
    });

    it('should render period label in English', () => {
      const budget = createMockBudget({ period: 'MONTHLY' });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText(/Monthly/)).toBeInTheDocument();
    });

    it('should render all period types correctly', () => {
      const periods: Array<{ period: BudgetWithProgress['period']; label: string }> = [
        { period: 'DAILY', label: 'Daily' },
        { period: 'WEEKLY', label: 'Weekly' },
        { period: 'MONTHLY', label: 'Monthly' },
        { period: 'YEARLY', label: 'Yearly' },
        { period: 'CUSTOM', label: 'Custom' },
      ];

      periods.forEach(({ period, label }) => {
        const budget = createMockBudget({ period });
        const { unmount } = render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText(new RegExp(label))).toBeInTheDocument();
        unmount();
      });
    });

    it('should render formatted dates', () => {
      const budget = createMockBudget({
        startDate: '2025-10-01T00:00:00Z',
        endDate: '2025-10-31T23:59:59Z',
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      // Dates are formatted using the shared utility (en-GB locale)
      // Note: exact end date depends on timezone conversion, so allow both options
      const startFormatted = formatDate('2025-10-01T00:00:00Z');
      const endFormatted = formatDate('2025-10-31T23:59:59Z');
      const fallbackEndFormatted = formatDate(new Date('2025-11-01T00:00:00Z'));

      expect(
        screen.getByText((content) => content.includes(startFormatted))
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes(endFormatted) || content.includes(fallbackEndFormatted))
      ).toBeInTheDocument();
    });

    it('should render remaining amount', () => {
      const budget = createMockBudget({
        progress: {
          spent: 600,
          limit: 1000,
          remaining: 400,
          percentage: 60,
          alerts: [],
        },
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText(/Remaining/)).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => element?.tagName === 'SPAN' && content.includes(currencyText(400)))
      ).toBeInTheDocument();
    });

    it('should handle missing category gracefully', () => {
      const budget = createMockBudget({ category: undefined });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText('Category')).toBeInTheDocument();
    });
  });

  describe('Progress Bar Integration', () => {
    it('should pass correct props to ProgressBar', () => {
      const budget = createMockBudget({
        progress: {
          spent: 850,
          limit: 1000,
          remaining: 150,
          percentage: 85,
          alerts: ['80%'],
        },
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      // ProgressBar should render these values
      expect(screen.getByText(`${currencyText(850)} / ${currencyText(1000)}`)).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('⚠️ 80% used')).toBeInTheDocument();
    });

    it('should display over-budget state', () => {
      const budget = createMockBudget({
        progress: {
          spent: 1200,
          limit: 1000,
          remaining: -200,
          percentage: 120,
          alerts: ['80%', '100%'],
        },
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText('🚨 Limit exceeded!')).toBeInTheDocument();
      expect(screen.getByText('120%')).toBeInTheDocument();
    });
  });

  describe('Conditional Styling', () => {
    it('should apply green color for positive remaining amount', () => {
      const budget = createMockBudget({
        progress: {
          spent: 500,
          limit: 1000,
          remaining: 500,
          percentage: 50,
          alerts: [],
        },
      });
      const { container } = render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      const remainingText = container.querySelector('.font-semibold.text-green-600');
      expect(remainingText).toHaveClass('text-green-600');
      expect(remainingText).toHaveTextContent(currencyText(500));
    });

    it('should apply red color for negative remaining amount', () => {
      const budget = createMockBudget({
        progress: {
          spent: 1100,
          limit: 1000,
          remaining: -100,
          percentage: 110,
          alerts: ['80%', '100%'],
        },
      });
      const { container } = render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      const remainingText = container.querySelector('.font-semibold.text-red-600');
      expect(remainingText).toHaveClass('text-red-600');
      expect(remainingText).toHaveTextContent(currencyText(-100));
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit with budget when edit button clicked', () => {
      const onEdit = vi.fn();
      const budget = createMockBudget();
      render(<BudgetCard budget={budget} onEdit={onEdit} onDelete={vi.fn()} />);
      
      const editButton = screen.getByLabelText('Edit budget');
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(budget);
    });

    it('should call onDelete with budget ID when delete button clicked', () => {
      const onDelete = vi.fn();
      const budget = createMockBudget({ id: 'budget-123' });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={onDelete} />);
      
      const deleteButton = screen.getByLabelText('Delete budget');
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('budget-123');
    });

    it('should have accessible button labels', () => {
      const budget = createMockBudget();
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByLabelText('Edit budget')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete budget')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero remaining', () => {
      const budget = createMockBudget({
        progress: {
          spent: 1000,
          limit: 1000,
          remaining: 0,
          percentage: 100,
          alerts: ['80%', '100%'],
        },
      });
      const { container } = render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      // 0 is >= 0, should be green
      const remainingSpan = container.querySelector('.text-green-600');
  expect(remainingSpan).toHaveTextContent(currencyText(0));
    });

    it('should handle decimal amounts', () => {
      const budget = createMockBudget({
        progress: {
          spent: 756.45,
          limit: 1000,
          remaining: 243.55,
          percentage: 75.645,
          alerts: [],
        },
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
  expect(screen.getByText(`${currencyText(756.45)} / ${currencyText(1000)}`)).toBeInTheDocument();
  expect(screen.getByText(currencyText(243.55))).toBeInTheDocument();
    });

    it('should handle very long category names', () => {
      const budget = createMockBudget({
        category: {
          id: 'cat-1',
          name: 'Very Long Category Name That Could Be Problematic',
          icon: 'UtensilsCrossed',
          color: '#ef4444',
          type: 'EXPENSE',
        },
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText('Very Long Category Name That Could Be Problematic')).toBeInTheDocument();
    });
  });
});
