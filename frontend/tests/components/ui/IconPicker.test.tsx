/**
 * IconPicker Component Tests
 * 
 * Tests the visual icon picker with category grouping and filtering:
 * - Rendering icon categories based on transaction type
 * - Icon selection and onChange callback
 * - Visual feedback (selected state, preview)
 * - Filtering logic (INCOME vs EXPENSE + GENERIC)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconPicker } from '@/components/ui/IconPicker';
import { TransactionType } from '@/types/transaction';

describe('IconPicker', () => {
  describe('Rendering and Basic Functionality', () => {
    it('should render instruction text', () => {
      render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

  expect(screen.getByText('Choose an icon for your category')).toBeInTheDocument();
    });

    it('should render category headings', () => {
      render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // EXPENSE should show multiple categories
  expect(screen.getByText('Food & drinks')).toBeInTheDocument();
  expect(screen.getByText('Shopping')).toBeInTheDocument();
  expect(screen.getByText('Transportation')).toBeInTheDocument();
    });

    it('should render icon buttons', () => {
      const { container } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Should have multiple icon buttons
      const buttons = container.querySelectorAll('button[type="button"]');
      expect(buttons.length).toBeGreaterThan(10); // Many icons available
    });
  });

  describe('Category Filtering by Transaction Type', () => {
    it('should show INCOME categories (1 type + GENERIC)', () => {
      render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.INCOME}
        />
      );

      // INCOME category
  expect(screen.getByText('Income')).toBeInTheDocument();
      // GENERIC category
  expect(screen.getByText('General')).toBeInTheDocument();

      // Should NOT show expense-specific categories
  expect(screen.queryByText('Food & drinks')).not.toBeInTheDocument();
  expect(screen.queryByText('Shopping')).not.toBeInTheDocument();
    });

    it('should show EXPENSE categories (7 types + GENERIC)', () => {
      render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // EXPENSE categories
  expect(screen.getByText('Food & drinks')).toBeInTheDocument();
  expect(screen.getByText('Shopping')).toBeInTheDocument();
  expect(screen.getByText('Home & bills')).toBeInTheDocument();
  expect(screen.getByText('Transportation')).toBeInTheDocument();
  expect(screen.getByText('Health & fitness')).toBeInTheDocument();
  expect(screen.getByText('Entertainment')).toBeInTheDocument();
  expect(screen.getByText('Education')).toBeInTheDocument();
      // GENERIC category
  expect(screen.getByText('General')).toBeInTheDocument();

      // Should NOT show income-specific categories
  expect(screen.queryByText('Income')).not.toBeInTheDocument();
    });

    it('should have more icons for EXPENSE than INCOME', () => {
      const { container: incomeContainer } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.INCOME}
        />
      );
      const incomeButtons = incomeContainer.querySelectorAll('button[type="button"]');

      const { container: expenseContainer } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );
      const expenseButtons = expenseContainer.querySelectorAll('button[type="button"]');

      expect(expenseButtons.length).toBeGreaterThan(incomeButtons.length);
    });
  });

  describe('Icon Selection and Callbacks', () => {
    it('should call onChange when icon clicked', () => {
      const onChange = vi.fn();
      const { container } = render(
        <IconPicker
          value=""
          onChange={onChange}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Click first icon button
      const firstButton = container.querySelector('button[type="button"]');
      expect(firstButton).toBeInTheDocument();
      fireEvent.click(firstButton!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(typeof onChange.mock.calls[0][0]).toBe('string'); // Should pass icon name
    });

    it('should call onChange with correct icon name', () => {
      const onChange = vi.fn();
      const { container } = render(
        <IconPicker
          value=""
          onChange={onChange}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Find button with specific title (icon name)
      const coffeeButton = container.querySelector('button[title="Coffee"]');
      if (coffeeButton) {
        fireEvent.click(coffeeButton);
        expect(onChange).toHaveBeenCalledWith('Coffee');
      } else {
        // Fallback: just verify first button passes a string
        const firstButton = container.querySelector('button[type="button"]');
        fireEvent.click(firstButton!);
        expect(typeof onChange.mock.calls[0][0]).toBe('string');
      }
    });

    it('should allow selecting different icons', () => {
      const onChange = vi.fn();
      const { container } = render(
        <IconPicker
          value=""
          onChange={onChange}
          transactionType={TransactionType.EXPENSE}
        />
      );

      const buttons = container.querySelectorAll('button[type="button"]');
      
      // Click first icon
      fireEvent.click(buttons[0]);
      expect(onChange).toHaveBeenCalledTimes(1);

      // Click second icon
      fireEvent.click(buttons[1]);
      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('Visual Feedback - Selected State', () => {
    it('should highlight selected icon with blue border', () => {
      const { container } = render(
        <IconPicker
          value="Coffee"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      const coffeeButton = container.querySelector('button[title="Coffee"]');
      expect(coffeeButton).toHaveClass('border-blue-500');
      expect(coffeeButton).toHaveClass('bg-blue-50');
    });

    it('should show checkmark badge on selected icon', () => {
      const { container } = render(
        <IconPicker
          value="UtensilsCrossed"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Selected icon button should have the checkmark badge
      const selectedButton = container.querySelector('button[title="UtensilsCrossed"]');
      expect(selectedButton).toBeInTheDocument();
      
      // Badge is rendered as a div with specific classes
      const badge = selectedButton?.querySelector('.bg-blue-500.rounded-full');
      expect(badge).toBeInTheDocument();
    });

    it('should not highlight unselected icons', () => {
      const { container } = render(
        <IconPicker
          value="Coffee"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Pizza should NOT be highlighted if Coffee is selected
      const pizzaButton = container.querySelector('button[title="Pizza"]');
      if (pizzaButton) {
        expect(pizzaButton).not.toHaveClass('border-blue-500');
        expect(pizzaButton).toHaveClass('border-gray-200');
      }
    });
  });

  describe('Preview Section', () => {
    it('should show preview when icon is selected', () => {
      render(
        <IconPicker
          value="Car"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

  expect(screen.getByText('Selected icon:')).toBeInTheDocument();
      expect(screen.getByText('Car')).toBeInTheDocument(); // Icon name in code block
    });

    it('should not show preview when no icon selected', () => {
      render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

  expect(screen.queryByText('Selected icon:')).not.toBeInTheDocument();
    });

    it('should display selected icon name in code format', () => {
      const { container } = render(
        <IconPicker
          value="ShoppingBag"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveTextContent('ShoppingBag');
    });

    it('should render preview icon with larger size', () => {
      render(
        <IconPicker
          value="Plane"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Preview section exists
  expect(screen.getByText('Selected icon:')).toBeInTheDocument();
      
      // Find icon in preview section - it's in the same parent as "Wybrana ikona:" text
  const previewLabel = screen.getByText('Selected icon:');
      const previewContainer = previewLabel.parentElement;
      const icon = previewContainer?.querySelector('svg');
      
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('width', '32'); // Larger than grid icons (24)
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value gracefully', () => {
      render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Should render without errors
  expect(screen.getByText('Choose an icon for your category')).toBeInTheDocument();
    });

    it('should handle invalid icon name in value', () => {
      render(
        <IconPicker
          value="NonExistentIcon"
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Should still render preview (CategoryIcon handles fallback)
  expect(screen.getByText('Selected icon:')).toBeInTheDocument();
      expect(screen.getByText('NonExistentIcon')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
          className="custom-picker-class"
        />
      );

      const rootDiv = container.firstChild;
      expect(rootDiv).toHaveClass('custom-picker-class');
    });

    it('should maintain grid layout with many icons', () => {
      const { container } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      // Check grid container exists
      const grids = container.querySelectorAll('.grid');
      expect(grids.length).toBeGreaterThan(0);
      
      // Each grid should have grid-cols class
      grids.forEach(grid => {
        expect(grid.className).toMatch(/grid-cols-/);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button type', () => {
      const { container } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have descriptive title on icon buttons', () => {
      const { container } = render(
        <IconPicker
          value=""
          onChange={vi.fn()}
          transactionType={TransactionType.EXPENSE}
        />
      );

      const buttons = container.querySelectorAll('button[type="button"]');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('title');
        expect(button.getAttribute('title')).toBeTruthy();
      });
    });
  });
});
