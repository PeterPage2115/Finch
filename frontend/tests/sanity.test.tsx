/**
 * Sanity Check Test
 * 
 * Verifies that Vitest, React Testing Library, and jest-dom are configured correctly.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Testing Infrastructure', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello Test</div>;
    render(<TestComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  it('should have working matchers', () => {
    expect(1 + 1).toBe(2);
    expect(true).toBeTruthy();
  });
});
