import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { Prisma } from '@prisma/client';

/**
 * Service obsługujący logikę biznesową dla transakcji
 * 
 * Funkcjonalności:
 * - CRUD operations z user-scoped access
 * - Filtrowanie po typie, kategorii, zakresie dat
 * - Paginacja wyników
 */
@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tworzy nową transakcję dla użytkownika
   * 
   * @param userId - ID zalogowanego użytkownika
   * @param createTransactionDto - dane transakcji
   * @returns utworzona transakcja
   */
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    // Weryfikujemy czy kategoria istnieje i należy do użytkownika
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
        category: true, // Zwracamy również dane kategorii
      },
    });
  }

  /**
   * Pobiera wszystkie transakcje użytkownika z filtrami i paginacją
   * 
   * @param userId - ID zalogowanego użytkownika
   * @param query - parametry filtrowania i paginacji
   * @returns paginowana lista transakcji z metadanymi
   */
  async findAll(userId: string, query: QueryTransactionDto) {
    const { type, categoryId, startDate, endDate, page = 1, limit = 10 } = query;

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
   * Pobiera pojedynczą transakcję po ID
   * 
   * @param id - ID transakcji
   * @param userId - ID zalogowanego użytkownika
   * @returns transakcja z kategorią
   * @throws NotFoundException jeśli transakcja nie istnieje lub nie należy do użytkownika
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
   * Aktualizuje transakcję
   * 
   * @param id - ID transakcji
   * @param userId - ID zalogowanego użytkownika
   * @param updateTransactionDto - dane do aktualizacji
   * @returns zaktualizowana transakcja
   * @throws NotFoundException jeśli transakcja nie istnieje
   * @throws ForbiddenException jeśli transakcja nie należy do użytkownika
   */
  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    // Sprawdzamy czy transakcja istnieje i należy do użytkownika
    await this.findOne(id, userId);

    // Jeśli zmieniamy categoryId, weryfikujemy czy nowa kategoria istnieje
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

    // Aktualizujemy transakcję
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
   * Usuwa transakcję
   * 
   * @param id - ID transakcji
   * @param userId - ID zalogowanego użytkownika
   * @throws NotFoundException jeśli transakcja nie istnieje
   * @throws ForbiddenException jeśli transakcja nie należy do użytkownika
   */
  async remove(id: string, userId: string) {
    // Sprawdzamy czy transakcja istnieje i należy do użytkownika
    await this.findOne(id, userId);

    // Usuwamy transakcję
    await this.prisma.transaction.delete({
      where: { id },
    });

    return { message: 'Transaction deleted successfully' };
  }
}
