import { IsEnum, IsISO8601, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

/**
 * DTO for query parameters in GET /transactions
 *
 * Enables:
 * - Filtering by type, category, date range
 * - Pagination (page, limit)
 *
 * All fields are optional
 */
export class QueryTransactionDto {
  /**
   * Filter by transaction type
   * @example "EXPENSE"
   */
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  /**
   * Filter by category (UUID)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  /**
   * Data początkowa zakresu (ISO 8601)
   * @example "2025-01-01T00:00:00.000Z"
   */
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  /**
   * Data końcowa zakresu (ISO 8601)
   * @example "2025-12-31T23:59:59.999Z"
   */
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  /**
   * Numer strony (od 1)
   * @example 1
   * @default 1
   */
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  /**
   * Liczba wyników na stronę
   * @example 10
   * @default 10
   */
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
