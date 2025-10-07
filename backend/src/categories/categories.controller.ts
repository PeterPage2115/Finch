import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CurrentUser } from '../auth/decorators';

/**
 * Categories Controller
 * Endpointy do zarządzania kategoriami użytkownika
 */
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * POST /categories
   * Tworzy nową kategorię dla zalogowanego użytkownika
   */
  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  /**
   * GET /categories
   * Zwraca wszystkie kategorie przypisane do zalogowanego użytkownika
   */
  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.categoriesService.findAll(userId);
  }

  /**
   * GET /categories/:id
   * Zwraca szczegóły pojedynczej kategorii
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.categoriesService.findOne(id, userId);
  }

  /**
   * PATCH /categories/:id
   * Aktualizuje istniejącą kategorię
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, userId, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id
   * Usuwa kategorię (tylko jeśli nie ma powiązanych transakcji)
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.categoriesService.remove(id, userId);
  }
}
