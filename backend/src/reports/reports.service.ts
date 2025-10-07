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

  /**
   * Get category trend over time (for charts)
   * Returns time-series data grouped by granularity
   */
  async getCategoryTrend(
    userId: string,
    startDate: Date,
    endDate: Date,
    categoryId?: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily',
  ) {
    const where: any = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'asc' },
      select: {
        date: true,
        amount: true,
        type: true,
      },
    });

    // Group by date granularity
    const grouped: Record<
      string,
      { date: string; income: number; expense: number; count: number }
    > = {};

    transactions.forEach((t) => {
      const dateKey = this.getDateKey(t.date, granularity);
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, income: 0, expense: 0, count: 0 };
      }
      if (t.type === 'INCOME') {
        grouped[dateKey].income += Number(t.amount);
      } else {
        grouped[dateKey].expense += Number(t.amount);
      }
      grouped[dateKey].count++;
    });

    const trendData = Object.values(grouped).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      granularity,
      data: trendData,
    };
  }

  /**
   * Get detailed information about a specific category
   */
  async getCategoryDetails(
    userId: string,
    categoryId: string,
    startDate: Date,
    endDate: Date,
  ) {
    // Get category info
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Get transactions for this category
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        categoryId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        type: true,
      },
    });

    const totalAmount = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    return {
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
      },
      summary: {
        totalAmount,
        transactionCount: transactions.length,
        averageAmount:
          transactions.length > 0 ? totalAmount / transactions.length : 0,
      },
      transactions: transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      })),
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    };
  }

  /**
   * Helper: Convert date to key based on granularity
   */
  private getDateKey(date: Date, granularity: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    switch (granularity) {
      case 'daily':
        return `${year}-${month}-${day}`;
      case 'weekly': {
        // Get ISO week number
        const weekNum = this.getWeekNumber(d);
        return `${year}-W${String(weekNum).padStart(2, '0')}`;
      }
      case 'monthly':
        return `${year}-${month}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  /**
   * Helper: Get ISO week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
