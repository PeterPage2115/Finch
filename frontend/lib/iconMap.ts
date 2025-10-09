/**
 * Icon Map - Centralized icon configuration for CategoryIcon component
 * 
 * This file exports:
 * 1. iconMap - Record mapping icon names to lucide-react components
 * 2. Categorized icon arrays for IconPicker UI
 */

import {
  // Fallback
  HelpCircle,
  // Income icons
  DollarSign,
  TrendingUp,
  Wallet,
  PiggyBank,
  Coins,
  Banknote,
  CreditCard,
  // Expense icons
  UtensilsCrossed,
  ShoppingBag,
  ShoppingCart,
  Home,
  Zap,
  Car,
  Bus,
  Train,
  Plane,
  Bike,
  Heart,
  Pill,
  Film,
  Gamepad2,
  Coffee,
  Pizza,
  Beer,
  Music,
  Dumbbell,
  GraduationCap,
  // Generic icons
  Tag,
  Star,
  Gift,
  Book,
  Briefcase,
  Phone,
  Laptop,
  Camera,
  Shirt,
  Receipt,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icon mapping object - maps icon names to lucide-react components
 * Used by CategoryIcon.tsx for rendering
 */
export const iconMap: Record<string, LucideIcon> = {
  // Income
  DollarSign,
  TrendingUp,
  Wallet,
  PiggyBank,
  Coins,
  Banknote,
  CreditCard,
  // Expense - Food & Drinks
  UtensilsCrossed,
  Pizza,
  Coffee,
  Beer,
  // Expense - Shopping
  ShoppingBag,
  ShoppingCart,
  Shirt,
  // Expense - Home & Utilities
  Home,
  Zap,
  // Expense - Transportation
  Car,
  Bus,
  Train,
  Plane,
  Bike,
  // Expense - Health & Wellness
  Heart,
  Pill,
  Dumbbell,
  // Expense - Entertainment
  Film,
  Gamepad2,
  Music,
  // Expense - Education
  GraduationCap,
  Book,
  // Generic
  Tag,
  Star,
  Gift,
  Briefcase,
  Phone,
  Laptop,
  Camera,
  Receipt,
  MoreHorizontal,
  // Fallback
  HelpCircle,
};

/**
 * Categorized icon arrays for IconPicker UI
 */

export interface IconCategory {
  name: string;
  icons: string[];
  description: string;
}

export const INCOME_ICONS: IconCategory = {
  name: 'Income',
  description: 'Icons for income-related categories (salary, bonuses, etc.)',
  icons: [
    'DollarSign',
    'TrendingUp',
    'Wallet',
    'PiggyBank',
    'Coins',
    'Banknote',
    'CreditCard',
  ],
};

export const EXPENSE_FOOD_ICONS: IconCategory = {
  name: 'Food & drinks',
  description: 'Icons for food and beverage categories',
  icons: ['UtensilsCrossed', 'Pizza', 'Coffee', 'Beer'],
};

export const EXPENSE_SHOPPING_ICONS: IconCategory = {
  name: 'Shopping',
  description: 'Icons for shopping categories',
  icons: ['ShoppingBag', 'ShoppingCart', 'Shirt'],
};

export const EXPENSE_HOME_ICONS: IconCategory = {
  name: 'Home & bills',
  description: 'Icons for home and utilities categories',
  icons: ['Home', 'Zap', 'Receipt'],
};

export const EXPENSE_TRANSPORT_ICONS: IconCategory = {
  name: 'Transportation',
  description: 'Icons for travel and transportation categories',
  icons: ['Car', 'Bus', 'Train', 'Plane', 'Bike'],
};

export const EXPENSE_HEALTH_ICONS: IconCategory = {
  name: 'Health & fitness',
  description: 'Icons for health and fitness categories',
  icons: ['Heart', 'Pill', 'Dumbbell'],
};

export const EXPENSE_ENTERTAINMENT_ICONS: IconCategory = {
  name: 'Entertainment',
  description: 'Icons for entertainment categories',
  icons: ['Film', 'Gamepad2', 'Music'],
};

export const EXPENSE_EDUCATION_ICONS: IconCategory = {
  name: 'Education',
  description: 'Icons for education categories',
  icons: ['GraduationCap', 'Book'],
};

export const GENERIC_ICONS: IconCategory = {
  name: 'General',
  description: 'Universal icons for any category',
  icons: ['Tag', 'Star', 'Gift', 'Briefcase', 'Phone', 'Laptop', 'Camera', 'MoreHorizontal'],
};

/**
 * All icon categories organized by transaction type
 */
export const ICON_CATEGORIES_BY_TYPE = {
  INCOME: [INCOME_ICONS],
  EXPENSE: [
    EXPENSE_FOOD_ICONS,
    EXPENSE_SHOPPING_ICONS,
    EXPENSE_HOME_ICONS,
    EXPENSE_TRANSPORT_ICONS,
    EXPENSE_HEALTH_ICONS,
    EXPENSE_ENTERTAINMENT_ICONS,
    EXPENSE_EDUCATION_ICONS,
  ],
  GENERIC: [GENERIC_ICONS],
};

/**
 * Get all icon names as flat array (useful for validation)
 */
export const getAllIconNames = (): string[] => {
  return Object.keys(iconMap);
};

/**
 * Validate if icon name exists in iconMap
 */
export const isValidIconName = (iconName: string): boolean => {
  return iconName in iconMap;
};
