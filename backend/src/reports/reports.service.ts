import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import PDFDocument from 'pdfkit';

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

  /**
   * Get trends comparison (current period vs previous period)
   * Useful for "This Month vs Last Month" type comparisons
   */
  async getTrendsComparison(
    userId: string,
    currentStart: Date,
    currentEnd: Date,
  ) {
    // Calculate previous period (same length as current)
    const periodLength = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1); // Day before current start
    const previousStart = new Date(previousEnd.getTime() - periodLength);

    // Get current period summary
    const currentIncome = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME',
        date: { gte: currentStart, lte: currentEnd },
      },
      _sum: { amount: true },
      _count: true,
    });

    const currentExpense = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: currentStart, lte: currentEnd },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Get previous period summary
    const previousIncome = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'INCOME',
        date: { gte: previousStart, lte: previousEnd },
      },
      _sum: { amount: true },
      _count: true,
    });

    const previousExpense = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
        date: { gte: previousStart, lte: previousEnd },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Calculate totals
    const currentIncomeTotal = Number(currentIncome._sum.amount || 0);
    const currentExpenseTotal = Number(currentExpense._sum.amount || 0);
    const previousIncomeTotal = Number(previousIncome._sum.amount || 0);
    const previousExpenseTotal = Number(previousExpense._sum.amount || 0);

    const currentBalance = currentIncomeTotal - currentExpenseTotal;
    const previousBalance = previousIncomeTotal - previousExpenseTotal;

    // Calculate changes and percentages
    const incomeChange = currentIncomeTotal - previousIncomeTotal;
    const expenseChange = currentExpenseTotal - previousExpenseTotal;
    const balanceChange = currentBalance - previousBalance;

    const incomePercentage =
      previousIncomeTotal > 0
        ? ((incomeChange / previousIncomeTotal) * 100).toFixed(1)
        : currentIncomeTotal > 0
          ? '100.0'
          : '0.0';

    const expensePercentage =
      previousExpenseTotal > 0
        ? ((expenseChange / previousExpenseTotal) * 100).toFixed(1)
        : currentExpenseTotal > 0
          ? '100.0'
          : '0.0';

    const balancePercentage =
      Math.abs(previousBalance) > 0
        ? ((balanceChange / Math.abs(previousBalance)) * 100).toFixed(1)
        : currentBalance !== 0
          ? '100.0'
          : '0.0';

    return {
      currentPeriod: {
        startDate: currentStart.toISOString().split('T')[0],
        endDate: currentEnd.toISOString().split('T')[0],
        income: currentIncomeTotal,
        expenses: currentExpenseTotal,
        balance: currentBalance,
        transactionCount: currentIncome._count + currentExpense._count,
      },
      previousPeriod: {
        startDate: previousStart.toISOString().split('T')[0],
        endDate: previousEnd.toISOString().split('T')[0],
        income: previousIncomeTotal,
        expenses: previousExpenseTotal,
        balance: previousBalance,
        transactionCount: previousIncome._count + previousExpense._count,
      },
      changes: {
        income: {
          absolute: incomeChange,
          percentage: parseFloat(incomePercentage),
        },
        expenses: {
          absolute: expenseChange,
          percentage: parseFloat(expensePercentage),
        },
        balance: {
          absolute: balanceChange,
          percentage: parseFloat(balancePercentage),
        },
      },
    };
  }

  /**
   * Get monthly trend for last N months
   * Shows spending patterns over multiple months
   */
  async getMonthlyTrend(userId: string, monthsCount: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsCount);
    startDate.setDate(1); // First day of the month

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        amount: true,
        type: true,
      },
    });

    // Group by month
    const monthlyData: Record<
      string,
      { month: string; income: number; expenses: number; balance: number }
    > = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          income: 0,
          expenses: 0,
          balance: 0,
        };
      }

      if (t.type === 'INCOME') {
        monthlyData[monthKey].income += Number(t.amount);
      } else {
        monthlyData[monthKey].expenses += Number(t.amount);
      }
    });

    // Calculate balance for each month
    const trendData = Object.values(monthlyData)
      .map((data) => ({
        ...data,
        balance: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      monthsCount,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      data: trendData,
    };
  }

  /**
   * Export transactions to CSV format
   */
  async exportTransactionsToCSV(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<string> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    // CSV headers
    const headers = ['Data', 'Kategoria', 'Opis', 'Kwota', 'Typ'];
    const csvRows = [headers.join(',')];

    // Format each transaction
    transactions.forEach((t) => {
      const row = [
        t.date.toISOString().split('T')[0],
        t.category?.name || 'Brak kategorii',
        `"${(t.description || '').replace(/"/g, '""')}"`, // Escape quotes
        t.amount.toString(),
        t.type === 'INCOME' ? 'Przychód' : 'Wydatek',
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Export transactions to PDF format
   */
  async exportTransactionsToPDF(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    // Get summary for the period
    const summary = await this.getSummary(userId, startDate, endDate);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Title
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('Raport Finansowy', { align: 'center' });
        doc.moveDown(0.5);

        // Date range
        doc
          .fontSize(12)
          .font('Helvetica')
          .text(
            `Okres: ${startDate.toLocaleDateString('pl-PL')} - ${endDate.toLocaleDateString('pl-PL')}`,
            { align: 'center' },
          );
        doc.moveDown(1.5);

        // Summary section
        doc.fontSize(14).font('Helvetica-Bold').text('Podsumowanie');
        doc.moveDown(0.5);

        doc.fontSize(10).font('Helvetica');
        doc.text(`Przychody: ${this.formatCurrency(summary.totalIncome)}`);
        doc.text(`Wydatki: ${this.formatCurrency(summary.totalExpenses)}`);
        doc.text(`Bilans: ${this.formatCurrency(summary.balance)}`);
        doc.text(
          `Liczba transakcji: ${summary.transactionCount.income + summary.transactionCount.expenses}`,
        );
        doc.moveDown(1.5);

        // Transactions section
        doc.fontSize(14).font('Helvetica-Bold').text('Lista Transakcji');
        doc.moveDown(0.5);

        // Table headers
        doc.fontSize(9).font('Helvetica-Bold');
        const tableTop = doc.y;
        const colWidths = {
          date: 70,
          category: 100,
          desc: 150,
          amount: 80,
          type: 70,
        };
        let currentY = tableTop;

        doc.text('Data', 50, currentY, { width: colWidths.date });
        doc.text('Kategoria', 120, currentY, { width: colWidths.category });
        doc.text('Opis', 220, currentY, { width: colWidths.desc });
        doc.text('Kwota', 370, currentY, {
          width: colWidths.amount,
          align: 'right',
        });
        doc.text('Typ', 450, currentY, { width: colWidths.type });

        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(520, doc.y).stroke();
        doc.moveDown(0.3);

        // Transaction rows
        doc.fontSize(8).font('Helvetica');
        transactions.forEach((t, index) => {
          // Check if we need a new page
          if (doc.y > 700) {
            doc.addPage();
            currentY = 50;
            doc.y = currentY;
          }

          currentY = doc.y;
          const date = t.date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          const category = t.category?.name || 'Brak';
          const desc = (t.description || '').substring(0, 40);
          const amount = this.formatCurrency(Number(t.amount));
          const type = t.type === 'INCOME' ? 'Przychód' : 'Wydatek';

          doc.text(date, 50, currentY, { width: colWidths.date });
          doc.text(category, 120, currentY, { width: colWidths.category });
          doc.text(desc, 220, currentY, { width: colWidths.desc });
          doc.text(amount, 370, currentY, {
            width: colWidths.amount,
            align: 'right',
          });
          doc.text(type, 450, currentY, { width: colWidths.type });

          doc.moveDown(0.5);

          // Light separator line every 5 rows
          if ((index + 1) % 5 === 0) {
            doc
              .strokeColor('#e0e0e0')
              .moveTo(50, doc.y)
              .lineTo(520, doc.y)
              .stroke()
              .strokeColor('#000000');
            doc.moveDown(0.3);
          }
        });

        // Footer
        doc
          .fontSize(8)
          .text(
            `Wygenerowano: ${new Date().toLocaleString('pl-PL')}`,
            50,
            doc.page.height - 50,
            { align: 'center' },
          );

        doc.end();
      } catch (error) {
        reject(
          error instanceof Error ? error : new Error('PDF generation failed'),
        );
      }
    });
  }

  /**
   * Helper: Format currency for display
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  }
}
