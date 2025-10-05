import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

/**
 * CategoriesService
 * 
 * Logika biznesowa dla zarządzania kategoriami użytkownika
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pobierz wszystkie kategorie użytkownika
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
   * Pobierz pojedynczą kategorię
   */
  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Kategoria nie istnieje');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Nie masz dostępu do tej kategorii');
    }

    return category;
  }

  /**
   * Utwórz nową kategorię
   */
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const { name, type, color, icon } = createCategoryDto;

    // Sprawdź czy użytkownik nie ma już kategorii o tej nazwie i typie
    const existing = await this.prisma.category.findUnique({
      where: {
        userId_name_type: {
          userId,
          name,
          type,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Kategoria "${name}" typu ${type} już istnieje`,
      );
    }

    // Utwórz kategorię
    return this.prisma.category.create({
      data: {
        userId,
        name,
        type,
        color: color || null,
        icon: icon || null,
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        createdAt: true,
      },
    });
  }

  /**
   * Aktualizuj kategorię
   */
  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    await this.findOne(id, userId);

    const { name, color, icon } = updateCategoryDto;

    // Jeśli zmieniana jest nazwa, sprawdź duplikaty
    if (name) {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Kategoria nie istnieje');
      }

      const existing = await this.prisma.category.findUnique({
        where: {
          userId_name_type: {
            userId,
            name,
            type: category.type,
          },
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Kategoria o nazwie "${name}" już istnieje`,
        );
      }
    }

    // Aktualizuj kategorię
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Usuń kategorię
   * BUSINESS RULE: Nie można usunąć kategorii która ma przypisane transakcje
   */
  async remove(id: string, userId: string) {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    await this.findOne(id, userId);

    // Sprawdź czy kategoria ma przypisane transakcje
    const transactionsCount = await this.prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionsCount > 0) {
      throw new BadRequestException(
        `Nie można usunąć kategorii która ma ${transactionsCount} przypisanych transakcji. Usuń najpierw transakcje lub zmień ich kategorię.`,
      );
    }

    // Usuń kategorię
    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Kategoria została usunięta' };
  }
}
