import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get summary report (income vs expenses for period)
   */
  async getSummary(userId: string, startDate: Date, endDate: Date) {
    // Aggregate INCOME transactions
    const incomeResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    // Aggregate EXPENSE transactions
    const expenseResult = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpenses = Number(expenseResult._sum.amount || 0);
    const balance = totalIncome - totalExpenses;

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: {
        income: incomeResult._count,
        expenses: expenseResult._count,
      },
    };
  }

  /**
   * Get category breakdown report (expenses/income by category)
   */
  async getByCategoryReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    type?: 'INCOME' | 'EXPENSE',
  ) {
    const where: any = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (type) {
      where.type = type;
    }

    // Fetch transactions with category details
    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    // Group by category (manual aggregation)
    const grouped: Record<
      string,
      {
        categoryId: string;
        categoryName: string;
        categoryIcon: string | null;
        categoryColor: string | null;
        total: number;
        transactionCount: number;
      }
    > = {};

    transactions.forEach((t) => {
      const catId = t.categoryId;
      if (!grouped[catId]) {
        grouped[catId] = {
          categoryId: catId,
          categoryName: t.category?.name || 'Unknown',
          categoryIcon: t.category?.icon || null,
          categoryColor: t.category?.color || null,
          total: 0,
          transactionCount: 0,
        };
      }
      grouped[catId].total += Number(t.amount);
      grouped[catId].transactionCount++;
    });

    const totalAmount = Object.values(grouped).reduce(
      (sum, cat) => sum + cat.total,
      0,
    );

    const categories = Object.values(grouped)
      .map((cat) => ({
        ...cat,
        percentage:
          totalAmount > 0
            ? Math.round((cat.total / totalAmount) * 10000) / 100
            : 0, // Round to 2 decimals
      }))
      .sort((a, b) => b.total - a.total); // Sort DESC by total

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      type: type || 'ALL',
      categories,
      totalAmount,
    };
  }
}
