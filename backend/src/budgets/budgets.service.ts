import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBudgetDto, UpdateBudgetDto, QueryBudgetDto } from './dto';
import { BudgetPeriod, Prisma } from '@prisma/client';

/**
 * Service handling budgets business logic.
 *
 * Key responsibilities:
 * - CRUD operations for budgets
 * - Calculate progress (spent vs limit)
 * - Auto-calculate endDate based on period
 * - Enforce business rules (unique constraint, category ownership)
 */
@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all budgets for a user with optional filters.
   */
  async findAll(userId: string, query: QueryBudgetDto) {
    const { categoryId, period, active } = query;

    const where: Prisma.BudgetWhereInput = { userId };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (period) {
      where.period = period;
    }

    if (active) {
      where.endDate = { gte: new Date() };
    }

    const budgets = await this.prisma.budget.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return budgets;
  }

  /**
   * Find a single budget by ID with progress calculation.
   */
  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    const progress = await this.calculateProgress(id);

    return {
      ...budget,
      progress,
    };
  }

  /**
   * Create a new budget.
   */
  async create(userId: string, dto: CreateBudgetDto) {
    const { categoryId, amount, period, startDate, endDate } = dto;

    // Validate that category belongs to user
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new BadRequestException(
        'Category not found or does not belong to user',
      );
    }

    // Auto-calculate endDate if not CUSTOM period
    const start = new Date(startDate);
    let end: Date;

    if (period === BudgetPeriod.CUSTOM) {
      if (!endDate) {
        throw new BadRequestException('endDate is required for CUSTOM period');
      }
      end = new Date(endDate);
    } else {
      end = this.calculateEndDate(start, period);
    }

    // Validate dates
    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    // Check unique constraint (userId + categoryId + startDate)
    const existing = await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        startDate: start,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Budget already exists for this category and start date',
      );
    }

    // Create budget
    const budget = await this.prisma.budget.create({
      data: {
        userId,
        categoryId,
        amount,
        period,
        startDate: start,
        endDate: end,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return budget;
  }

  /**
   * Update an existing budget.
   */
  async update(id: string, userId: string, dto: UpdateBudgetDto) {
    // Check if budget exists and belongs to user
    const existing = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    const { categoryId, amount, period, startDate, endDate } = dto;

    // Validate category if provided
    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, userId },
      });

      if (!category) {
        throw new BadRequestException(
          'Category not found or does not belong to user',
        );
      }
    }

    // Recalculate endDate if period or startDate changed
    let finalEndDate = existing.endDate;

    if (period || startDate) {
      const newPeriod = period || existing.period;
      const newStartDate = startDate ? new Date(startDate) : existing.startDate;

      if (newPeriod === BudgetPeriod.CUSTOM) {
        if (endDate) {
          finalEndDate = new Date(endDate);
        }
        // else keep existing endDate
      } else {
        finalEndDate = this.calculateEndDate(newStartDate, newPeriod);
      }
    } else if (endDate) {
      finalEndDate = new Date(endDate);
    }

    // Update budget
    const updated = await this.prisma.budget.update({
      where: { id },
      data: {
        ...(categoryId && { categoryId }),
        ...(amount && { amount }),
        ...(period && { period }),
        ...(startDate && { startDate: new Date(startDate) }),
        endDate: finalEndDate,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * Delete a budget.
   */
  async remove(id: string, userId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    await this.prisma.budget.delete({
      where: { id },
    });
  }

  /**
   * Calculate progress for a budget (spent vs limit).
   *
   * Returns:
   * - spent: total amount spent in period
   * - limit: budget amount
   * - percentage: (spent / limit) * 100
   * - remaining: limit - spent
   * - alerts: array of alert strings ('80%', '100%')
   */
  async calculateProgress(budgetId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${budgetId} not found`);
    }

    // Sum transactions in period for this category
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId: budget.userId,
        categoryId: budget.categoryId,
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
        type: 'EXPENSE', // Only count expenses
      },
      _sum: {
        amount: true,
      },
    });

    const spent = Number(result._sum.amount || 0);
    const limit = Number(budget.amount);
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const remaining = limit - spent;

    // Determine alerts
    const alerts: string[] = [];
    if (percentage >= 80 && percentage < 100) {
      alerts.push('80%');
    } else if (percentage >= 100) {
      alerts.push('80%', '100%');
    }

    return {
      spent,
      limit,
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimals
      remaining,
      alerts,
    };
  }

  /**
   * Helper: Calculate endDate based on startDate and period.
   */
  private calculateEndDate(startDate: Date, period: BudgetPeriod): Date {
    const end = new Date(startDate);

    switch (period) {
      case BudgetPeriod.DAILY:
        end.setDate(end.getDate() + 1);
        break;
      case BudgetPeriod.WEEKLY:
        end.setDate(end.getDate() + 7);
        break;
      case BudgetPeriod.MONTHLY:
        end.setMonth(end.getMonth() + 1);
        break;
      case BudgetPeriod.YEARLY:
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        throw new BadRequestException(`Invalid period: ${period}`);
    }

    return end;
  }
}
