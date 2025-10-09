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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controller handling REST API for transactions
 *
 * All endpoints require JWT authentication
 * Each user has access only to their own transactions
 *
 * Endpoints:
 * - POST /transactions - creates a new transaction
 * - GET /transactions - retrieves list of transactions with filters
 * - GET /transactions/:id - retrieves transaction details
 * - PATCH /transactions/:id - updates a transaction
 * - DELETE /transactions/:id - deletes a transaction
 */
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Creates a new transaction
   *
   * @param user - logged-in user (from JWT)
   * @param createTransactionDto - transaction data
   * @returns created transaction with category
   *
   * @example
   * POST /transactions
   * {
   *   "amount": 1234.56,
   *   "description": "Grocery shopping",
   *   "date": "2025-10-01T12:00:00.000Z",
   *   "type": "EXPENSE",
   *   "categoryId": "550e8400-e29b-41d4-a716-446655440000"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  /**
   * Retrieves list of transactions with filters and pagination
   *
   * @param user - logged-in user (from JWT)
   * @param query - filtering and pagination parameters
   * @returns paginated list of transactions
   *
   * @example
   * GET /transactions?type=EXPENSE&startDate=2025-01-01&endDate=2025-12-31&page=1&limit=10
   */
  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.findAll(userId, query);
  }

  /**
   * Retrieves details of a single transaction
   *
   * @param user - logged-in user (from JWT)
   * @param id - transaction UUID
   * @returns transaction with category
   *
   * @example
   * GET /transactions/550e8400-e29b-41d4-a716-446655440000
   */
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.transactionsService.findOne(id, userId);
  }

  /**
   * Updates a transaction (partial update)
   *
   * @param user - logged-in user (from JWT)
   * @param id - transaction UUID
   * @param updateTransactionDto - data to update (all fields optional)
   * @returns updated transaction
   *
   * @example
   * PATCH /transactions/550e8400-e29b-41d4-a716-446655440000
   * {
   *   "amount": 2000.00,
   *   "description": "Updated description"
   * }
   */
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, userId, updateTransactionDto);
  }

  /**
   * Deletes a transaction
   *
   * @param user - logged-in user (from JWT)
   * @param id - transaction UUID
   * @returns deletion confirmation
   *
   * @example
   * DELETE /transactions/550e8400-e29b-41d4-a716-446655440000
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.transactionsService.remove(id, userId);
  }
}
