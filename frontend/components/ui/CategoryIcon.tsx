'use client';

import {
  HelpCircle,
  // Income icons
  DollarSign,
  TrendingUp,
  Wallet,
  PiggyBank,
  Coins,
  // Expense icons
  UtensilsCrossed,
  ShoppingBag,
  Home,
  Zap,
  Car,
  Bus,
  Train,
  Plane,
  Heart,
  Pill,
  Film,
  Gamepad2,
  Coffee,
  ShoppingCart,
  MoreHorizontal,
  CreditCard,
  // Generic icons
  Tag,
  Star,
  Gift,
  Book,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

// Icon mapping object - maps icon names to lucide-react components
const iconMap: Record<string, LucideIcon> = {
  // Income
  DollarSign,
  TrendingUp,
  Wallet,
  PiggyBank,
  Coins,
  // Expense
  UtensilsCrossed,
  ShoppingBag,
  Home,
  Zap,
  Car,
  Bus,
  Train,
  Plane,
  Heart,
  Pill,
  Film,
  Gamepad2,
  Coffee,
  ShoppingCart,
  MoreHorizontal,
  CreditCard,
  // Generic
  Tag,
  Star,
  Gift,
  Book,
  Briefcase,
  // Fallback
  HelpCircle,
};

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
  // Get the icon component from the mapping
  const IconComponent = iconMap[iconName] || HelpCircle;
  
  return (
    <IconComponent 
      size={size} 
      style={{ color }} 
      className={className}
    />
  );
}
