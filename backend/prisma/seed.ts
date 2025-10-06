import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create categories with lucide-react icon names
  const expenseCategories = await Promise.all([
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Jedzenie',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'UtensilsCrossed',
        color: '#ef4444',
      },
      create: {
        userId: user.id,
        name: 'Jedzenie',
        type: 'EXPENSE',
        icon: 'UtensilsCrossed',
        color: '#ef4444',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Transport',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'Car',
        color: '#3b82f6',
      },
      create: {
        userId: user.id,
        name: 'Transport',
        type: 'EXPENSE',
        icon: 'Car',
        color: '#3b82f6',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Rozrywka',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'Gamepad2',
        color: '#a855f7',
      },
      create: {
        userId: user.id,
        name: 'Rozrywka',
        type: 'EXPENSE',
        icon: 'Gamepad2',
        color: '#a855f7',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Rachunki',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'Receipt',
        color: '#f59e0b',
      },
      create: {
        userId: user.id,
        name: 'Rachunki',
        type: 'EXPENSE',
        icon: 'Receipt',
        color: '#f59e0b',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Zakupy',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'ShoppingBag',
        color: '#ec4899',
      },
      create: {
        userId: user.id,
        name: 'Zakupy',
        type: 'EXPENSE',
        icon: 'ShoppingBag',
        color: '#ec4899',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Zdrowie',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'Heart',
        color: '#10b981',
      },
      create: {
        userId: user.id,
        name: 'Zdrowie',
        type: 'EXPENSE',
        icon: 'Heart',
        color: '#10b981',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Inne wydatki',
          type: 'EXPENSE',
        },
      },
      update: {
        icon: 'MoreHorizontal',
        color: '#6b7280',
      },
      create: {
        userId: user.id,
        name: 'Inne wydatki',
        type: 'EXPENSE',
        icon: 'MoreHorizontal',
        color: '#6b7280',
      },
    }),
  ]);

  const incomeCategories = await Promise.all([
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Wynagrodzenie',
          type: 'INCOME',
        },
      },
      update: {
        icon: 'Wallet',
        color: '#22c55e',
      },
      create: {
        userId: user.id,
        name: 'Wynagrodzenie',
        type: 'INCOME',
        icon: 'Wallet',
        color: '#22c55e',
      },
    }),
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Inne przychody',
          type: 'INCOME',
        },
      },
      update: {
        icon: 'TrendingUp',
        color: '#14b8a6',
      },
      create: {
        userId: user.id,
        name: 'Inne przychody',
        type: 'INCOME',
        icon: 'TrendingUp',
        color: '#14b8a6',
      },
    }),
  ]);

  console.log(
    `✅ Created ${expenseCategories.length + incomeCategories.length} categories`,
  );

  // Create sample transactions
  const now = new Date();
  const transactions = await Promise.all([
    // Income
    prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: incomeCategories[0].id,
        amount: 5000.0,
        description: 'Wypłata - październik',
        type: 'INCOME',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    }),
    // Expenses
    prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: expenseCategories[0].id, // Jedzenie
        amount: 45.5,
        description: 'Zakupy spożywcze',
        type: 'EXPENSE',
        date: new Date(now.getFullYear(), now.getMonth(), 2),
      },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: expenseCategories[1].id, // Transport
        amount: 120.0,
        description: 'Tankowanie',
        type: 'EXPENSE',
        date: new Date(now.getFullYear(), now.getMonth(), 3),
      },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId: expenseCategories[2].id, // Rozrywka
        amount: 89.99,
        description: 'Bilety do kina',
        type: 'EXPENSE',
        date: new Date(now.getFullYear(), now.getMonth(), 5),
      },
    }),
  ]);

  console.log(`✅ Created ${transactions.length} sample transactions`);

  // Create budget
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_startDate: {
        userId: user.id,
        categoryId: expenseCategories[0].id,
        startDate: startOfMonth,
      },
    },
    update: {},
    create: {
      userId: user.id,
      categoryId: expenseCategories[0].id,
      amount: 500.0,
      period: 'MONTHLY',
      startDate: startOfMonth,
      endDate: endOfMonth,
    },
  });

  console.log('✅ Created sample budget for Jedzenie category');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 1 (${user.email})`);
  console.log(`   - Categories: ${expenseCategories.length + incomeCategories.length}`);
  console.log(`   - Transactions: ${transactions.length}`);
  console.log(`   - Budgets: 1`);
  console.log('\n🔑 Test credentials:');
  console.log(`   Email: ${user.email}`);
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
