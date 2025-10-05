import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

/**
 * Categories Controller
 * 
 * CRUD endpoints dla kategorii użytkownika
 */
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories
   * Zwraca wszystkie kategorie przypisane do zalogowanego użytkownika
   */
  @Get()
  async findAll(@Request() req) {
    return this.categoriesService.findAll(req.user.id);
  }

  /**
   * GET /categories/:id
   * Zwraca szczegóły pojedynczej kategorii
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.categoriesService.findOne(id, req.user.id);
  }

  /**
   * POST /categories
   * Tworzy nową niestandardową kategorię
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoriesService.create(req.user.id, createCategoryDto);
  }

  /**
   * PATCH /categories/:id
   * Aktualizuje istniejącą kategorię
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    return this.categoriesService.update(id, req.user.id, updateCategoryDto);
  }

  /**
   * DELETE /categories/:id
   * Usuwa kategorię (tylko jeśli nie ma przypisanych transakcji)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req) {
    return this.categoriesService.remove(id, req.user.id);
  }
}
