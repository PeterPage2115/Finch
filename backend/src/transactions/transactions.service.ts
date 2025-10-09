import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { Prisma } from '@prisma/client';

/**
 * Service handling business logic for transactions
 *
 * Features:
 * - CRUD operations with user-scoped access
 * - Filtering by type, category, date range
 * - Result pagination
 */
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new transaction for the user
   *
   * @param userId - ID of the logged-in user
   * @param createTransactionDto - transaction data
   * @returns created transaction
   */
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    // Verify that the category exists and belongs to the user
    const category = await this.prisma.category.findFirst({
      where: {
        id: createTransactionDto.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createTransactionDto.categoryId} not found or does not belong to user`,
      );
    }

    // Tworzymy transakcję
    return this.prisma.transaction.create({
      data: {
        amount: createTransactionDto.amount,
        description: createTransactionDto.description,
        date: new Date(createTransactionDto.date),
        type: createTransactionDto.type,
        userId,
        categoryId: createTransactionDto.categoryId,
      },
      include: {
        category: true, // Return category data as well
      },
    });
  }

  /**
   * Retrieves all user transactions with filters and pagination
   *
   * @param userId - ID of the logged-in user
   * @param query - filtering and pagination parameters
   * @returns paginated list of transactions with metadata
   */
  async findAll(userId: string, query: QueryTransactionDto) {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    // Budujemy warunki WHERE dla Prisma
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    // Obliczamy offset dla paginacji
    const skip = (page - 1) * limit;

    // Wykonujemy query z liczeniem total
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' }, // Najnowsze najpierw
        include: {
          category: true,
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // Zwracamy z metadanymi paginacji
    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves a single transaction by ID
   *
   * @param id - transaction ID
   * @param userId - ID of the logged-in user
   * @returns transaction with category
   * @throws NotFoundException if transaction doesn't exist or doesn't belong to user
   */
  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${id} not found or does not belong to user`,
      );
    }

    return transaction;
  }

  /**
   * Updates a transaction
   *
   * @param id - transaction ID
   * @param userId - ID of the logged-in user
   * @param updateTransactionDto - data to update
   * @returns updated transaction
   * @throws NotFoundException if transaction doesn't exist
   * @throws ForbiddenException if transaction doesn't belong to user
   */
  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    // Check if transaction exists and belongs to user
    await this.findOne(id, userId);

    // If changing categoryId, verify that new category exists
    if (updateTransactionDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: updateTransactionDto.categoryId,
          userId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateTransactionDto.categoryId} not found or does not belong to user`,
        );
      }
    }

    // Update the transaction
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...(updateTransactionDto.amount !== undefined && {
          amount: updateTransactionDto.amount,
        }),
        ...(updateTransactionDto.description !== undefined && {
          description: updateTransactionDto.description,
        }),
        ...(updateTransactionDto.date && {
          date: new Date(updateTransactionDto.date),
        }),
        ...(updateTransactionDto.type && { type: updateTransactionDto.type }),
        ...(updateTransactionDto.categoryId && {
          categoryId: updateTransactionDto.categoryId,
        }),
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Deletes a transaction
   *
   * @param id - transaction ID
   * @param userId - ID of the logged-in user
   * @throws NotFoundException if transaction doesn't exist
   * @throws ForbiddenException if transaction doesn't belong to user
   */
  async remove(id: string, userId: string) {
    // Check if transaction exists and belongs to user
    await this.findOne(id, userId);

    // Delete transaction
    await this.prisma.transaction.delete({
      where: { id },
    });

    return { message: 'Transaction deleted successfully' };
  }
}
