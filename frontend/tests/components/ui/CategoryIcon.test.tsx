/**
 * CategoryIcon Component Tests
 * 
 * Tests the dynamic icon rendering component that maps icon names to lucide-react components.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

describe('CategoryIcon', () => {
  it('should render with default size', () => {
    const { container } = render(<CategoryIcon iconName="Smartphone" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20'); // Default size
    expect(svg).toHaveAttribute('height', '20');
  });

  it('should render with custom size', () => {
    const { container } = render(<CategoryIcon iconName="Car" size={32} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('should apply custom color via style', () => {
    const { container } = render(<CategoryIcon iconName="UtensilsCrossed" color="#ef4444" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ color: '#ef4444' });
  });

  it('should apply additional CSS classes', () => {
    const { container } = render(<CategoryIcon iconName="Home" className="custom-class" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should render HelpCircle as fallback for unknown icon', () => {
    const { container } = render(<CategoryIcon iconName="NonExistentIcon" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // HelpCircle has a circle element
    expect(svg?.querySelector('circle')).toBeInTheDocument();
  });

  it('should render valid icons from iconMap', () => {
    const validIcons = ['Smartphone', 'Car', 'Home', 'ShoppingBag', 'Plane'];
    
    validIcons.forEach((iconName) => {
      const { container } = render(<CategoryIcon iconName={iconName} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('should combine all props correctly', () => {
    const { container } = render(
      <CategoryIcon 
        iconName="Coffee" 
        color="#8b5cf6" 
        size={24} 
        className="test-icon"
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveClass('test-icon');
    expect(svg).toHaveStyle({ color: '#8b5cf6' });
  });
});
