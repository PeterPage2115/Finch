/**
 * Allowed Lucide Icon Names for Categories
 *
 * This list matches the iconMap in frontend/lib/iconMap.ts
 * Only these icon names are allowed for category creation/updates.
 *
 * Updated: 2025-10-08
 */

export const ALLOWED_LUCIDE_ICONS = [
  // Income icons
  'DollarSign',
  'TrendingUp',
  'Wallet',
  'PiggyBank',
  'Coins',
  'Banknote',
  'CreditCard',

  // Food & Drinks
  'UtensilsCrossed',
  'Pizza',
  'Coffee',
  'Beer',

  // Shopping
  'ShoppingBag',
  'ShoppingCart',
  'Shirt',

  // Home & Utilities
  'Home',
  'Zap',
  'Receipt',

  // Transportation
  'Car',
  'Bus',
  'Train',
  'Plane',
  'Bike',

  // Health & Wellness
  'Heart',
  'Pill',
  'Dumbbell',

  // Entertainment
  'Film',
  'Gamepad2',
  'Music',

  // Education
  'GraduationCap',
  'Book',

  // Generic
  'Tag',
  'Star',
  'Gift',
  'Briefcase',
  'Phone',
  'Laptop',
  'Camera',
  'MoreHorizontal',

  // Fallback (not recommended for use)
  'HelpCircle',
] as const;

/**
 * Type for allowed icon names
 */
export type AllowedLucideIcon = (typeof ALLOWED_LUCIDE_ICONS)[number];

/**
 * Check if icon name is valid Lucide icon
 */
export function isValidLucideIcon(iconName: string): boolean {
  return ALLOWED_LUCIDE_ICONS.includes(iconName as AllowedLucideIcon);
}

/**
 * Get list of all allowed icon names
 */
export function getAllowedIconNames(): readonly string[] {
  return ALLOWED_LUCIDE_ICONS;
}
