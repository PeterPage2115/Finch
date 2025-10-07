import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

/**
 * Categories Service
 * Obsługuje logikę biznesową związaną z kategoriami
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pobiera wszystkie kategorie użytkownika
   */
  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        createdAt: true,
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Pobiera pojedynczą kategorię użytkownika
   */
  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(
        `Kategoria o ID ${id} nie została znaleziona`,
      );
    }

    return category;
  }

  /**
   * Tworzy nową kategorię
   */
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
    });
  }

  /**
   * Aktualizuje istniejącą kategorię
   */
  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    await this.findOne(id, userId);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * Usuwa kategorię
   * Blokuje usunięcie jeśli kategoria ma powiązane transakcje
   */
  async remove(id: string, userId: string) {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    await this.findOne(id, userId);

    // Sprawdź czy są transakcje powiązane z tą kategorią
    const transactionsCount = await this.prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionsCount > 0) {
      throw new ConflictException(
        `Nie można usunąć kategorii, ponieważ jest powiązana z ${transactionsCount} transakcjami`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Kategoria została usunięta' };
  }
}
