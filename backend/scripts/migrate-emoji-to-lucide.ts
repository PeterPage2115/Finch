/**
 * Migration Script: Replace emoji icons with Lucide icon names
 *
 * This script migrates all categories with emoji icons to use
 * Lucide React icon names instead.
 *
 * Run with: npm run migrate:emoji
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Emoji to Lucide mapping (matches CategoryIcon.tsx)
const EMOJI_TO_LUCIDE_MAP: Record<string, string> = {
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
  '⚕️': 'Heart',
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

async function migrateEmojiToLucide() {
  console.log('🚀 Starting emoji → Lucide migration...\n');

  try {
    // Option 1: Execute SQL file directly
    console.log('📄 Executing SQL migration file...');
    const sqlPath = path.join(
      __dirname,
      '../prisma/migrations/manual/migrate-emoji-to-lucide.sql',
    );
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.startsWith('UPDATE') || statement.startsWith('DO')) {
        await prisma.$executeRawUnsafe(statement);
      }
    }

    console.log('✅ SQL migration executed successfully\n');

    // Option 2: Programmatic approach (as backup/verification)
    console.log('🔍 Verifying migration with programmatic check...');

    // Find all categories with emoji icons
    const categoriesWithEmoji = await prisma.category.findMany({
      where: {
        icon: {
          in: Object.keys(EMOJI_TO_LUCIDE_MAP),
        },
      },
    });

    if (categoriesWithEmoji.length > 0) {
      console.log(
        `⚠️  Found ${categoriesWithEmoji.length} categories still using emoji. Running programmatic migration...`,
      );

      // Update each category
      for (const category of categoriesWithEmoji) {
        const lucideName = EMOJI_TO_LUCIDE_MAP[category.icon];
        if (lucideName) {
          await prisma.category.update({
            where: { id: category.id },
            data: { icon: lucideName },
          });
          console.log(
            `  ✓ Updated "${category.name}" (${category.icon} → ${lucideName})`,
          );
        }
      }

      console.log(
        `\n✅ Programmatic migration completed: ${categoriesWithEmoji.length} categories updated`,
      );
    } else {
      console.log(
        '✅ No categories with emoji found - migration already complete',
      );
    }

    // Final verification
    console.log('\n🔎 Final verification...');
    const remainingEmoji = await prisma.category.findMany({
      where: {
        icon: {
          in: Object.keys(EMOJI_TO_LUCIDE_MAP),
        },
      },
    });

    if (remainingEmoji.length === 0) {
      console.log(
        '✅ SUCCESS: All emoji icons have been migrated to Lucide names!',
      );
    } else {
      console.error(
        `❌ ERROR: ${remainingEmoji.length} categories still have emoji icons:`,
      );
      remainingEmoji.forEach((cat) => {
        console.error(`  - ${cat.name}: ${cat.icon}`);
      });
      process.exit(1);
    }

    // Summary
    console.log('\n📊 Migration Summary:');
    const allCategories = await prisma.category.findMany({
      select: { icon: true },
    });

    const lucideIcons = allCategories.filter((c) =>
      /^[A-Z][a-zA-Z0-9]*$/.test(c.icon),
    );

    console.log(`  Total categories: ${allCategories.length}`);
    console.log(`  Using Lucide names: ${lucideIcons.length}`);
    console.log(
      `  Coverage: ${((lucideIcons.length / allCategories.length) * 100).toFixed(1)}%`,
    );
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateEmojiToLucide()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed with error:', error);
    process.exit(1);
  });
