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

  // Create categories
  const expenseCategories = await Promise.all([
    prisma.category.upsert({
      where: {
        userId_name_type: {
          userId: user.id,
          name: 'Jedzenie',
          type: 'EXPENSE',
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: 'Jedzenie',
        type: 'EXPENSE',
        color: '#EF4444',
        icon: '🍔',
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
      update: {},
      create: {
        userId: user.id,
        name: 'Transport',
        type: 'EXPENSE',
        color: '#3B82F6',
        icon: '🚗',
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
      update: {},
      create: {
        userId: user.id,
        name: 'Rozrywka',
        type: 'EXPENSE',
        color: '#8B5CF6',
        icon: '🎮',
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
      update: {},
      create: {
        userId: user.id,
        name: 'Wynagrodzenie',
        type: 'INCOME',
        color: '#10B981',
        icon: '💰',
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
