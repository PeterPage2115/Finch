import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto, UpdateBudgetDto, QueryBudgetDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controller for managing budgets.
 *
 * All routes are protected by JwtAuthGuard.
 */
@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  /**
   * Create a new budget.
   *
   * POST /budgets
   * Body: CreateBudgetDto
   * Returns: Created budget with category details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') userId: string,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetsService.create(userId, createBudgetDto);
  }

  /**
   * Get all budgets for the current user.
   *
   * GET /budgets?categoryId=xxx&period=MONTHLY&active=true
   * Query: QueryBudgetDto (optional filters)
   * Returns: Array of budgets with category details
   */
  @Get()
  findAll(@CurrentUser('id') userId: string, @Query() query: QueryBudgetDto) {
    return this.budgetsService.findAll(userId, query);
  }

  /**
   * Get a single budget by ID with progress calculation.
   *
   * GET /budgets/:id
   * Returns: Budget with progress (spent, limit, percentage, remaining, alerts)
   */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.budgetsService.findOne(id, userId);
  }

  /**
   * Get only the progress for a budget.
   *
   * GET /budgets/:id/progress
   * Returns: Progress object (spent, limit, percentage, remaining, alerts)
   */
  @Get(':id/progress')
  getProgress(@Param('id') id: string) {
    return this.budgetsService.calculateProgress(id);
  }

  /**
   * Update an existing budget.
   *
   * PATCH /budgets/:id
   * Body: UpdateBudgetDto
   * Returns: Updated budget with category details
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, userId, updateBudgetDto);
  }

  /**
   * Delete a budget.
   *
   * DELETE /budgets/:id
   * Returns: 204 No Content
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.budgetsService.remove(id, userId);
  }
}
