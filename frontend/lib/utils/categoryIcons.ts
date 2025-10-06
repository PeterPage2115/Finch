import {
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Heart,
  Tv,
  Briefcase,
  Wallet,
  Gift,
  Coffee,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps category icon/emoji to Lucide React icon component.
 * 
 * Priority:
 * 1. If emoji matches known mapping → return corresponding icon
 * 2. If category name contains keyword → return icon based on name
 * 3. Default → Wallet icon
 */
export function getCategoryIcon(icon?: string | null, categoryName?: string): LucideIcon {
  const iconStr = icon?.trim() || '';
  const name = categoryName?.toLowerCase() || '';

  // Direct emoji mappings
  const emojiMap: Record<string, LucideIcon> = {
    '🛒': ShoppingCart,
    '🛍️': ShoppingCart,
    '🏠': Home,
    '🏡': Home,
    '🚗': Car,
    '🚙': Car,
    '🍔': Utensils,
    '🍕': Utensils,
    '🍽️': Utensils,
    '❤️': Heart,
    '💊': Heart,
    '🏥': Heart,
    '📺': Tv,
    '🎮': Tv,
    '🎬': Tv,
    '💼': Briefcase,
    '💰': Wallet,
    '💵': Wallet,
    '🎁': Gift,
    '☕': Coffee,
    '📦': ShoppingCart,
  };

  // Check emoji mapping first
  if (iconStr && emojiMap[iconStr]) {
    return emojiMap[iconStr];
  }

  // Keyword-based mapping (fallback for names)
  if (name.includes('jedzenie') || name.includes('food') || name.includes('zakup')) {
    return Utensils;
  }
  if (name.includes('transport') || name.includes('samochód') || name.includes('car')) {
    return Car;
  }
  if (name.includes('rozrywka') || name.includes('entertainment') || name.includes('hobby')) {
    return Tv;
  }
  if (name.includes('zdrowie') || name.includes('health') || name.includes('medical')) {
    return Heart;
  }
  if (name.includes('dom') || name.includes('home') || name.includes('rachunk')) {
    return Home;
  }
  if (name.includes('praca') || name.includes('work') || name.includes('wynagrodzenie') || name.includes('salary')) {
    return Briefcase;
  }
  if (name.includes('prezent') || name.includes('gift')) {
    return Gift;
  }
  if (name.includes('kawa') || name.includes('coffee') || name.includes('cafe')) {
    return Coffee;
  }

  // Default fallback
  return Wallet;
}

/**
 * Get icon color based on category type.
 * Returns Tailwind color class.
 */
export function getCategoryIconColor(type: 'INCOME' | 'EXPENSE'): string {
  return type === 'INCOME' ? 'text-green-600' : 'text-blue-600';
}
