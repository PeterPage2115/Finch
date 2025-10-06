import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  color?: string;
  size?: number;
  className?: string;
}

/**
 * CategoryIcon component - dynamically renders lucide-react icons by name
 * 
 * @param iconName - Name of the lucide-react icon (e.g., "UtensilsCrossed", "Car")
 * @param color - Hex color for the icon (e.g., "#ef4444")
 * @param size - Size in pixels (default: 20)
 * @param className - Additional CSS classes
 */
export function CategoryIcon({ 
  iconName, 
  color, 
  size = 20, 
  className = '' 
}: CategoryIconProps) {
  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Fallback to HelpCircle if icon not found
  if (!IconComponent || typeof IconComponent !== 'function') {
    return (
      <LucideIcons.HelpCircle 
        size={size} 
        className={`text-gray-400 ${className}`}
      />
    );
  }
  
  return (
    <IconComponent 
      size={size} 
      style={{ color }} 
      className={className}
    />
  );
}
