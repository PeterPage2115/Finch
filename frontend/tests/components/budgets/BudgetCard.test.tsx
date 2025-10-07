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
    name: 'Jedzenie',
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
      
      expect(screen.getByText('Jedzenie')).toBeInTheDocument();
      // Icon is rendered by CategoryIcon component
    });

    it('should render period label in Polish', () => {
      const budget = createMockBudget({ period: 'MONTHLY' });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText(/Miesięczny/)).toBeInTheDocument();
    });

    it('should render all period types correctly', () => {
      const periods: Array<{ period: BudgetWithProgress['period']; label: string }> = [
        { period: 'DAILY', label: 'Dzienny' },
        { period: 'WEEKLY', label: 'Tygodniowy' },
        { period: 'MONTHLY', label: 'Miesięczny' },
        { period: 'YEARLY', label: 'Roczny' },
        { period: 'CUSTOM', label: 'Niestandardowy' },
      ];

      periods.forEach(({ period, label }) => {
        const budget = createMockBudget({ period });
        const { unmount } = render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText(new RegExp(label))).toBeInTheDocument();
        unmount();
      });
    });

    it('should render formatted dates in Polish locale', () => {
      const budget = createMockBudget({
        startDate: '2025-10-01T00:00:00Z',
        endDate: '2025-10-31T23:59:59Z',
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      // Polish date format: DD.MM.YYYY (dates rendered via toLocaleDateString)
      // Note: exact format depends on system locale, but should contain the date parts
      expect(screen.getByText(/1\.10\.2025/)).toBeInTheDocument();
      // End date might be rendered as next day due to UTC/local timezone conversion
      expect(screen.getByText(/1\.11\.2025|31\.10\.2025/)).toBeInTheDocument();
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
      
      expect(screen.getByText(/Pozostało:/)).toBeInTheDocument();
      expect(screen.getByText('400.00 zł')).toBeInTheDocument();
    });

    it('should handle missing category gracefully', () => {
      const budget = createMockBudget({ category: undefined });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText('Kategoria')).toBeInTheDocument();
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
      expect(screen.getByText('850.00 zł / 1000.00 zł')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('⚠️ 80% wykorzystane')).toBeInTheDocument();
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
      
      expect(screen.getByText('🚨 Przekroczony!')).toBeInTheDocument();
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
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      // Find the remaining amount by text content
      const remainingText = screen.getByText('500.00 zł');
      expect(remainingText).toHaveClass('text-green-600');
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
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      // Find the remaining amount by text content
      const remainingText = screen.getByText('-100.00 zł');
      expect(remainingText).toHaveClass('text-red-600');
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit with budget when edit button clicked', () => {
      const onEdit = vi.fn();
      const budget = createMockBudget();
      render(<BudgetCard budget={budget} onEdit={onEdit} onDelete={vi.fn()} />);
      
      const editButton = screen.getByLabelText('Edytuj budżet');
      fireEvent.click(editButton);
      
      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(budget);
    });

    it('should call onDelete with budget ID when delete button clicked', () => {
      const onDelete = vi.fn();
      const budget = createMockBudget({ id: 'budget-123' });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={onDelete} />);
      
      const deleteButton = screen.getByLabelText('Usuń budżet');
      fireEvent.click(deleteButton);
      
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('budget-123');
    });

    it('should have accessible button labels', () => {
      const budget = createMockBudget();
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByLabelText('Edytuj budżet')).toBeInTheDocument();
      expect(screen.getByLabelText('Usuń budżet')).toBeInTheDocument();
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
      expect(remainingSpan).toHaveTextContent('0.00 zł');
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
      
      expect(screen.getByText('756.45 zł / 1000.00 zł')).toBeInTheDocument();
      expect(screen.getByText('243.55 zł')).toBeInTheDocument();
    });

    it('should handle very long category names', () => {
      const budget = createMockBudget({
        category: {
          id: 'cat-1',
          name: 'Bardzo Długa Nazwa Kategorii Która Może Być Problematyczna',
          icon: 'UtensilsCrossed',
          color: '#ef4444',
          type: 'EXPENSE',
        },
      });
      render(<BudgetCard budget={budget} onEdit={vi.fn()} onDelete={vi.fn()} />);
      
      expect(screen.getByText('Bardzo Długa Nazwa Kategorii Która Może Być Problematyczna')).toBeInTheDocument();
    });
  });
});
