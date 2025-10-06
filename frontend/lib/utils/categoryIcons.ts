import * as LucideIcons from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

/**
 * Gets lucide-react icon component by name from the database.
 * 
 * @param iconName - Name of the lucide-react icon (e.g., "UtensilsCrossed", "Car")
 * @returns Icon component or HelpCircle as fallback
 */
export function getCategoryIcon(iconName: string): LucideIcon {
  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[iconName];
  
  // Return the icon or fallback to HelpCircle
  if (!IconComponent || typeof IconComponent !== 'function') {
    return LucideIcons.HelpCircle;
  }
  
  return IconComponent as LucideIcon;
}

/**
 * Get icon color based on category type.
 * Note: This is deprecated - use category.color from database instead
 * @deprecated Use category.color from database
 */
export function getCategoryIconColor(type: 'INCOME' | 'EXPENSE'): string {
  return type === 'INCOME' ? 'text-green-600' : 'text-blue-600';
}

