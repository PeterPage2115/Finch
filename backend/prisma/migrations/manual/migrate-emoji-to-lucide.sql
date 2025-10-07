-- Migration: Replace emoji icons with Lucide icon names
-- Date: 2025-10-08
-- Purpose: Eliminate technical debt from emoji-based icons
-- 
-- This migration converts all emoji icons in the categories table
-- to their corresponding Lucide React icon names.
-- 
-- Safe to run multiple times (idempotent)

-- Update all emoji icons to Lucide names
UPDATE categories
SET icon = CASE icon
  -- Food & Drinks
  WHEN '🍔' THEN 'UtensilsCrossed'
  WHEN '🍕' THEN 'Pizza'
  WHEN '☕' THEN 'Coffee'
  WHEN '🍺' THEN 'Beer'
  
  -- Transportation
  WHEN '🚗' THEN 'Car'
  WHEN '🚌' THEN 'Bus'
  WHEN '🚆' THEN 'Train'
  WHEN '✈️' THEN 'Plane'
  WHEN '🚲' THEN 'Bike'
  
  -- Health & Wellness
  WHEN '❤️' THEN 'Heart'
  WHEN '⚕️' THEN 'Heart'
  WHEN '💊' THEN 'Pill'
  WHEN '🏋️' THEN 'Dumbbell'
  WHEN '🏋️‍♂️' THEN 'Dumbbell'
  WHEN '🏋️‍♀️' THEN 'Dumbbell'
  
  -- Entertainment
  WHEN '🎮' THEN 'Gamepad2'
  WHEN '🎬' THEN 'Film'
  WHEN '🎵' THEN 'Music'
  WHEN '🎶' THEN 'Music'
  
  -- Finance
  WHEN '💰' THEN 'Wallet'
  WHEN '💵' THEN 'DollarSign'
  WHEN '💳' THEN 'CreditCard'
  WHEN '💲' THEN 'DollarSign'
  WHEN '🪙' THEN 'Coins'
  
  -- Home & Utilities
  WHEN '🏠' THEN 'Home'
  WHEN '⚡' THEN 'Zap'
  WHEN '📄' THEN 'Receipt'
  
  -- Shopping
  WHEN '🛍️' THEN 'ShoppingBag'
  WHEN '🛒' THEN 'ShoppingCart'
  WHEN '👕' THEN 'Shirt'
  
  -- Education
  WHEN '🎓' THEN 'GraduationCap'
  WHEN '📚' THEN 'Book'
  WHEN '📖' THEN 'Book'
  
  -- Generic
  WHEN '🎁' THEN 'Gift'
  WHEN '💼' THEN 'Briefcase'
  WHEN '📱' THEN 'Phone'
  WHEN '💻' THEN 'Laptop'
  WHEN '📷' THEN 'Camera'
  WHEN '⭐' THEN 'Star'
  WHEN '🏷️' THEN 'Tag'
  
  -- If already Lucide name or unknown emoji, keep as-is
  ELSE icon
END
WHERE icon IN (
  '🍔', '🍕', '☕', '🍺',
  '🚗', '🚌', '🚆', '✈️', '🚲',
  '❤️', '⚕️', '💊', '🏋️', '🏋️‍♂️', '🏋️‍♀️',
  '🎮', '🎬', '🎵', '🎶',
  '💰', '💵', '💳', '💲', '🪙',
  '🏠', '⚡', '📄',
  '🛍️', '🛒', '👕',
  '🎓', '📚', '📖',
  '🎁', '💼', '📱', '💻', '📷', '⭐', '🏷️'
);

-- Log migration completion
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE '✅ Migration completed: % categories updated from emoji to Lucide names', updated_count;
END $$;
