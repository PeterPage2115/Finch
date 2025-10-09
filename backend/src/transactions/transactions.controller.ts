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
 * Controller obsługujący REST API dla transakcji
 *
 * Wszystkie endpointy wymagają autentykacji JWT
 * Każdy użytkownik ma dostęp tylko do swoich transakcji
 *
 * Endpointy:
 * - POST /transactions - tworzy nową transakcję
 * - GET /transactions - pobiera listę transakcji z filtrami
 * - GET /transactions/:id - pobiera szczegóły transakcji
 * - PATCH /transactions/:id - aktualizuje transakcję
 * - DELETE /transactions/:id - usuwa transakcję
 */
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Tworzy nową transakcję
   *
   * @param user - zalogowany użytkownik (z JWT)
   * @param createTransactionDto - dane transakcji
   * @returns utworzona transakcja z kategorią
   *
   * @example
   * POST /transactions
   * {
   *   "amount": 1234.56,
   *   "description": "Zakupy spożywcze",
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
   * Pobiera listę transakcji z filtrami i paginacją
   *
   * @param user - zalogowany użytkownik (z JWT)
   * @param query - parametry filtrowania i paginacji
   * @returns paginowana lista transakcji
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
   * Pobiera szczegóły pojedynczej transakcji
   *
   * @param user - zalogowany użytkownik (z JWT)
   * @param id - UUID transakcji
   * @returns transakcja z kategorią
   *
   * @example
   * GET /transactions/550e8400-e29b-41d4-a716-446655440000
   */
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.transactionsService.findOne(id, userId);
  }

  /**
   * Aktualizuje transakcję (częściowa aktualizacja)
   *
   * @param user - zalogowany użytkownik (z JWT)
   * @param id - UUID transakcji
   * @param updateTransactionDto - dane do aktualizacji (wszystkie pola opcjonalne)
   * @returns zaktualizowana transakcja
   *
   * @example
   * PATCH /transactions/550e8400-e29b-41d4-a716-446655440000
   * {
   *   "amount": 2000.00,
   *   "description": "Zaktualizowany opis"
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
   * Usuwa transakcję
   *
   * @param user - zalogowany użytkownik (z JWT)
   * @param id - UUID transakcji
   * @returns potwierdzenie usunięcia
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
