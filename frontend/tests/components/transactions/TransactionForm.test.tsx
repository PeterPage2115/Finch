/**
 * TransactionForm Component Tests
 * 
 * Comprehensive test suite for form validation, submission, and user interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionForm from '@/components/transactions/TransactionForm';
import { TransactionType } from '@/types/transaction';
import type { Transaction } from '@/types/transaction';

// Mock categories matching iconMap.ts structure
const createMockCategories = () => [
  { id: '1', name: 'Wynagrodzenie', type: TransactionType.INCOME, icon: 'Banknote' },
  { id: '2', name: 'Przychody', type: TransactionType.INCOME, icon: 'TrendingUp' },
  { id: '3', name: 'Jedzenie i napoje', type: TransactionType.EXPENSE, icon: 'Utensils' },
  { id: '4', name: 'Transport', type: TransactionType.EXPENSE, icon: 'Car' },
  { id: '5', name: 'Dom i rachunki', type: TransactionType.EXPENSE, icon: 'Home' },
  { id: '6', name: 'Rozrywka', type: TransactionType.EXPENSE, icon: 'Gamepad2' },
  { id: '7', name: 'Zakupy', type: TransactionType.EXPENSE, icon: 'ShoppingBag' },
  { id: '8', name: 'Zdrowie i sport', type: TransactionType.EXPENSE, icon: 'Dumbbell' },
  { id: '9', name: 'Edukacja', type: TransactionType.EXPENSE, icon: 'GraduationCap' },
  { id: '10', name: 'Inne wydatki', type: TransactionType.EXPENSE, icon: 'MoreHorizontal' },
];

describe('TransactionForm', () => {
  const mockCategories = createMockCategories();
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
  const mockOnCancel = vi.fn();

  const renderForm = (props = {}) => {
    return render(
      <TransactionForm
        categories={mockCategories}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Rendering & Initial State', () => {
    it('should render "Nowa transakcja" title in create mode', () => {
      renderForm();
      expect(screen.getByText('Nowa transakcja')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      renderForm();
      
      // Type buttons
      expect(screen.getByRole('button', { name: /przychód/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /wydatek/i })).toBeInTheDocument();
      
      // Input fields
      expect(screen.getByLabelText('Kwota (zł)')).toBeInTheDocument();
      expect(screen.getByLabelText('Kategoria')).toBeInTheDocument();
      expect(screen.getByLabelText('Data')).toBeInTheDocument();
      expect(screen.getByLabelText('Opis (opcjonalny)')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      renderForm();
      
      expect(screen.getByRole('button', { name: /anuluj/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dodaj/i })).toBeInTheDocument();
    });

    it('should have EXPENSE type selected by default', () => {
      renderForm();
      
      const expenseButton = screen.getByRole('button', { name: /wydatek/i });
      expect(expenseButton).toHaveClass('border-red-500');
    });
  });

  describe('Edit Mode', () => {
    const mockTransaction: Transaction = {
      id: 'tx1',
      userId: 'user1',
      amount: 123.45,
      categoryId: '3',
      description: 'Test transaction',
      date: '2025-10-07',
      type: TransactionType.EXPENSE,
      createdAt: '2025-10-07T10:00:00Z',
      updatedAt: '2025-10-07T10:00:00Z',
    };

    it('should render "Edytuj transakcję" title when transaction provided', () => {
      renderForm({ transaction: mockTransaction });
      expect(screen.getByText('Edytuj transakcję')).toBeInTheDocument();
    });

    it('should pre-fill form fields with transaction data', () => {
      renderForm({ transaction: mockTransaction });
      
      expect(screen.getByLabelText('Kwota (zł)')).toHaveValue(123.45);
      expect(screen.getByLabelText('Kategoria')).toHaveValue('3');
      expect(screen.getByLabelText('Opis (opcjonalny)')).toHaveValue('Test transaction');
      expect(screen.getByLabelText('Data')).toHaveValue('2025-10-07');
    });

    it('should show "Zaktualizuj" button instead of "Dodaj"', () => {
      renderForm({ transaction: mockTransaction });
      
      expect(screen.getByRole('button', { name: /zaktualizuj/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^dodaj$/i })).not.toBeInTheDocument();
    });
  });

  describe('Type Toggle & Category Filtering', () => {
    it('should show only INCOME categories when INCOME type selected', () => {
      renderForm();
      
      // Click INCOME button
      fireEvent.click(screen.getByRole('button', { name: /przychód/i }));
      
      const categorySelect = screen.getByLabelText('Kategoria') as HTMLSelectElement;
      const options = Array.from(categorySelect.options).filter(opt => opt.value !== '');
      
      expect(options).toHaveLength(2);
      expect(options[0].textContent).toBe('Wynagrodzenie');
      expect(options[1].textContent).toBe('Przychody');
    });

    it('should show only EXPENSE categories when EXPENSE type selected', () => {
      renderForm();
      
      // EXPENSE is default, verify categories
      const categorySelect = screen.getByLabelText('Kategoria') as HTMLSelectElement;
      const options = Array.from(categorySelect.options).filter(opt => opt.value !== '');
      
      expect(options).toHaveLength(8);
      expect(options[0].textContent).toBe('Jedzenie i napoje');
      expect(options[7].textContent).toBe('Inne wydatki');
    });

    it('should apply correct styling to selected type button', () => {
      renderForm();
      
      const incomeButton = screen.getByRole('button', { name: /przychód/i });
      const expenseButton = screen.getByRole('button', { name: /wydatek/i });
      
      // Initially EXPENSE selected
      expect(expenseButton).toHaveClass('border-red-500');
      expect(incomeButton).not.toHaveClass('border-green-500');
      
      // Click INCOME
      fireEvent.click(incomeButton);
      
      expect(incomeButton).toHaveClass('border-green-500');
      expect(expenseButton).not.toHaveClass('border-red-500');
    });

    it('should reset categoryId when type changes', () => {
      renderForm();
      
      const categorySelect = screen.getByLabelText('Kategoria') as HTMLSelectElement;
      
      // Select EXPENSE category
      fireEvent.change(categorySelect, { target: { value: '3' } });
      expect(categorySelect.value).toBe('3');
      
      // Switch to INCOME
      fireEvent.click(screen.getByRole('button', { name: /przychód/i }));
      
      // CategoryId should be reset
      expect(categorySelect.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty amount', async () => {
      renderForm();
      
      // Submit form directly to bypass HTML5 validation
      const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Kwota musi być większa niż 0')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error for zero amount', async () => {
      renderForm();
      
      const amountInput = screen.getByLabelText('Kwota (zł)');
      fireEvent.change(amountInput, { target: { value: '0' } });
      
      // Submit form directly to bypass HTML5 validation
      const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Kwota musi być większa niż 0')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error for empty category', async () => {
      renderForm();
      
      // Fill amount and date, but not category
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      
      // Submit form directly to bypass HTML5 validation
      const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Kategoria jest wymagana')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error for empty date', async () => {
      renderForm();
      
      // Fill amount and category, but clear date
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      
      const dateInput = screen.getByLabelText('Data');
      fireEvent.change(dateInput, { target: { value: '' } });
      
      // Wait for state update before submitting
      await waitFor(() => {
        expect(dateInput).toHaveValue('');
      });
      
      // Submit form directly to bypass HTML5 validation
      const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Data jest wymagana')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should display multiple validation errors simultaneously', async () => {
      renderForm();
      
      // Clear date field (amount is 0 by default, category empty by default)
      const dateInput = screen.getByLabelText('Data');
      fireEvent.change(dateInput, { target: { value: '' } });
      
      // Wait for state update
      await waitFor(() => {
        expect(dateInput).toHaveValue('');
      });
      
      // Submit form directly to bypass HTML5 validation
      const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Kwota musi być większa niż 0')).toBeInTheDocument();
        expect(screen.getByText('Kategoria jest wymagana')).toBeInTheDocument();
        expect(screen.getByText('Data jest wymagana')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should prevent form submission when validation fails', () => {
      renderForm();
      
      // Try to submit invalid form
      const submitButton = screen.getByRole('button', { name: /dodaj/i });
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with correct data structure when form is valid', async () => {
      renderForm();
      
      // Fill form
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50.75' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      fireEvent.change(screen.getByLabelText('Opis (opcjonalny)'), { target: { value: 'Test description' } });
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /dodaj/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          type: TransactionType.EXPENSE,
          amount: 50.75,
          categoryId: '3',
          date: expect.stringMatching(/^2025-10-07T\d{2}:\d{2}/),
          description: 'Test description',
        });
      });
    });

    it('should convert amount to Number type', async () => {
      renderForm();
      
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '123.45' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      
      fireEvent.click(screen.getByRole('button', { name: /dodaj/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 123.45,
          })
        );
      });
      
      const callArg = mockOnSubmit.mock.calls[0][0];
      expect(typeof callArg.amount).toBe('number');
    });

    it('should convert date to ISO 8601 format', async () => {
      renderForm();
      
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      
      fireEvent.click(screen.getByRole('button', { name: /dodaj/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
          })
        );
      });
    });

    it('should show loading state during submission', () => {
      renderForm({ isLoading: true });
      
      const submitButton = screen.getByRole('button', { name: /zapisywanie/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should disable cancel button during loading', () => {
      renderForm({ isLoading: true });
      
      const cancelButton = screen.getByRole('button', { name: /anuluj/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Optional Fields & Edge Cases', () => {
    it('should allow description field to be empty', async () => {
      renderForm();
      
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      // Leave description empty
      
      fireEvent.click(screen.getByRole('button', { name: /dodaj/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            description: '',
          })
        );
      });
    });

    it('should pass description value to onSubmit', async () => {
      renderForm();
      
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      fireEvent.change(screen.getByLabelText('Opis (opcjonalny)'), { 
        target: { value: 'My custom description' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /dodaj/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'My custom description',
          })
        );
      });
    });

    it('should clear validation errors after fixing input', async () => {
      renderForm();
      
      // Trigger validation error
      const form = screen.getByRole('button', { name: /dodaj/i }).closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Kwota musi być większa niż 0')).toBeInTheDocument();
      });
      
      // Fix the error
      fireEvent.change(screen.getByLabelText('Kwota (zł)'), { target: { value: '50' } });
      fireEvent.change(screen.getByLabelText('Kategoria'), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2025-10-07' } });
      fireEvent.submit(form);
      
      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Kwota musi być większa niż 0')).not.toBeInTheDocument();
      });
    });

    it('should call onCancel when cancel button clicked', () => {
      renderForm();
      
      const cancelButton = screen.getByRole('button', { name: /anuluj/i });
      fireEvent.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
