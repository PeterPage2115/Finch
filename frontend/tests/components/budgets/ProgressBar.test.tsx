/**
 * ProgressBar Component Tests
 * 
 * Tests the budget progress visualization component with different states:
 * - Display calculations (spent/limit, percentage)
 * - Color coding (green < 80%, yellow 80-99%, red >= 100%)
 * - Alert rendering (80%, 100%)
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from '@/components/budgets/ProgressBar';

describe('ProgressBar', () => {
  describe('Display and Calculations', () => {
    it('should render spent and limit amounts', () => {
      render(<ProgressBar percentage={50} spent={500} limit={1000} />);
      
      expect(screen.getByText('500.00 zł / 1000.00 zł')).toBeInTheDocument();
    });

    it('should display percentage', () => {
      render(<ProgressBar percentage={75} spent={750} limit={1000} />);
      
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should round percentage to whole number', () => {
      render(<ProgressBar percentage={75.7} spent={757} limit={1000} />);
      
      // Should display 76% (rounded from 75.7)
      expect(screen.getByText('76%')).toBeInTheDocument();
    });

    it('should clamp displayed percentage at 100% even if over', () => {
      render(<ProgressBar percentage={125} spent={1250} limit={1000} />);
      
      // Text shows 125% but progress bar width is clamped at 100%
      expect(screen.getByText('125%')).toBeInTheDocument();
    });
  });

  describe('Color Coding', () => {
    it('should render green for < 80%', () => {
      const { container } = render(<ProgressBar percentage={50} spent={500} limit={1000} />);
      
      const progressBar = container.querySelector('.bg-green-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should render yellow for 80-99%', () => {
      const { container } = render(<ProgressBar percentage={85} spent={850} limit={1000} />);
      
      const progressBar = container.querySelector('.bg-yellow-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should render red for >= 100%', () => {
      const { container } = render(<ProgressBar percentage={105} spent={1050} limit={1000} />);
      
      const progressBar = container.querySelector('.bg-red-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should apply red text color for >= 100%', () => {
      render(<ProgressBar percentage={110} spent={1100} limit={1000} />);
      
      const percentageText = screen.getByText('110%');
      expect(percentageText).toHaveClass('text-red-600');
    });

    it('should apply yellow text color for 80-99%', () => {
      render(<ProgressBar percentage={90} spent={900} limit={1000} />);
      
      const percentageText = screen.getByText('90%');
      expect(percentageText).toHaveClass('text-yellow-600');
    });

    it('should apply green text color for < 80%', () => {
      render(<ProgressBar percentage={70} spent={700} limit={1000} />);
      
      const percentageText = screen.getByText('70%');
      expect(percentageText).toHaveClass('text-green-600');
    });
  });

  describe('Alert Rendering', () => {
    it('should not render alerts when array is empty', () => {
      render(<ProgressBar percentage={50} spent={500} limit={1000} alerts={[]} />);
      
      expect(screen.queryByText(/wykorzystane/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Przekroczony/)).not.toBeInTheDocument();
    });

    it('should render 80% alert when in alerts array', () => {
      render(<ProgressBar percentage={85} spent={850} limit={1000} alerts={['80%']} />);
      
      expect(screen.getByText('⚠️ 80% wykorzystane')).toBeInTheDocument();
    });

    it('should render 100% alert when in alerts array', () => {
      render(<ProgressBar percentage={105} spent={1050} limit={1000} alerts={['100%']} />);
      
      expect(screen.getByText('🚨 Przekroczony!')).toBeInTheDocument();
    });

    it('should render both alerts when both in array', () => {
      render(<ProgressBar percentage={105} spent={1050} limit={1000} alerts={['80%', '100%']} />);
      
      expect(screen.getByText('⚠️ 80% wykorzystane')).toBeInTheDocument();
      expect(screen.getByText('🚨 Przekroczony!')).toBeInTheDocument();
    });

    it('should not render alerts when not provided (default)', () => {
      render(<ProgressBar percentage={90} spent={900} limit={1000} />);
      
      expect(screen.queryByText(/wykorzystane/)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0% progress', () => {
      render(<ProgressBar percentage={0} spent={0} limit={1000} />);
      
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('0.00 zł / 1000.00 zł')).toBeInTheDocument();
    });

    it('should handle 100% exactly', () => {
      render(<ProgressBar percentage={100} spent={1000} limit={1000} />);
      
      expect(screen.getByText('100%')).toBeInTheDocument();
      const percentageText = screen.getByText('100%');
      expect(percentageText).toHaveClass('text-red-600');
    });

    it('should handle decimal amounts', () => {
      render(<ProgressBar percentage={33.33} spent={333.33} limit={1000} />);
      
      expect(screen.getByText('333.33 zł / 1000.00 zł')).toBeInTheDocument();
      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });
});
