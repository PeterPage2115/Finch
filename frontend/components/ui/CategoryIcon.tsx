'use client';

import { iconMap } from '@/lib/iconMap';
import { HelpCircle } from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  color?: string;
  size?: number;
  className?: string;
}

/**
 * Emoji to Lucide icon name mapping
 * Provides backward compatibility for categories stored with emoji icons
 */
const emojiToLucideMap: Record<string, string> = {
  // Food & Drinks
  '🍔': 'UtensilsCrossed',
  '🍕': 'Pizza',
  '☕': 'Coffee',
  '🍺': 'Beer',
  
  // Transportation
  '🚗': 'Car',
  '🚌': 'Bus',
  '🚆': 'Train',
  '✈️': 'Plane',
  '🚲': 'Bike',
  
  // Health & Wellness
  '❤️': 'Heart',
  '⚕️': 'Heart', // Medical symbol
  '💊': 'Pill',
  '🏋️': 'Dumbbell',
  '🏋️‍♂️': 'Dumbbell',
  '🏋️‍♀️': 'Dumbbell',
  
  // Entertainment
  '🎮': 'Gamepad2',
  '🎬': 'Film',
  '🎵': 'Music',
  '🎶': 'Music',
  
  // Finance
  '💰': 'Wallet',
  '💵': 'DollarSign',
  '💳': 'CreditCard',
  '💲': 'DollarSign',
  '🪙': 'Coins',
  
  // Home & Utilities
  '🏠': 'Home',
  '⚡': 'Zap',
  '📄': 'Receipt',
  
  // Shopping
  '🛍️': 'ShoppingBag',
  '🛒': 'ShoppingCart',
  '👕': 'Shirt',
  
  // Education
  '🎓': 'GraduationCap',
  '📚': 'Book',
  '📖': 'Book',
  
  // Generic
  '🎁': 'Gift',
  '💼': 'Briefcase',
  '📱': 'Phone',
  '💻': 'Laptop',
  '📷': 'Camera',
  '⭐': 'Star',
  '🏷️': 'Tag',
};

/**
 * Converts emoji or string to valid Lucide icon name
 * @param iconNameOrEmoji - Either an emoji (🍔) or Lucide name ('UtensilsCrossed')
 * @returns Lucide icon name
 */
function getIconNameFromEmojiOrString(iconNameOrEmoji: string): string {
  // Check if it's an emoji that needs mapping
  if (emojiToLucideMap[iconNameOrEmoji]) {
    return emojiToLucideMap[iconNameOrEmoji];
  }
  // Otherwise return as-is (already a Lucide name or will fallback to HelpCircle)
  return iconNameOrEmoji;
}

/**
 * CategoryIcon component - dynamically renders lucide-react icons by name
 * 
 * Supports both Lucide icon names and legacy emoji icons for backward compatibility
 * 
 * @param iconName - Name of the lucide-react icon (e.g., "UtensilsCrossed", "Car") or emoji (e.g., "🍔", "🚗")
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
  // Convert emoji to Lucide name if needed
  const lucideIconName = getIconNameFromEmojiOrString(iconName);
  
  // Get the icon component from the mapping
  const IconComponent = iconMap[lucideIconName] || HelpCircle;
  
  return (
    <IconComponent 
      size={size} 
      style={{ color }} 
      className={className}
    />
  );
}
