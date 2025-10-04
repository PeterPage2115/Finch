import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma.service';

/**
 * Categories Controller
 * 
 * Endpoint do pobierania kategorii użytkownika
 */
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /categories
   * Zwraca wszystkie kategorie przypisane do zalogowanego użytkownika
   */
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;

    const categories = await this.prisma.category.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        createdAt: true,
      },
      orderBy: [
        { type: 'asc' }, // INCOME first, then EXPENSE
        { name: 'asc' },
      ],
    });

    return categories;
  }
}
