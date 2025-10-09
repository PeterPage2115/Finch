import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

/**
 * DTO for creating a new transaction
 *
 * Validation:
 * - amount: positive number (Decimal in Prisma)
 * - description: optional string
 * - date: ISO 8601 date string
 * - type: INCOME or EXPENSE
 * - categoryId: category UUID
 */
export class CreateTransactionDto {
  /**
   * Transaction amount (max 12 digits, 2 decimal places)
   * @example 1234.56
   */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  /**
   * Optional transaction description
   * @example "Grocery shopping"
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Transaction date in ISO 8601 format
   * @example "2025-10-01T12:00:00.000Z"
   */
  @IsISO8601()
  date: string;

  /**
   * Transaction type: income or expense
   * @example "EXPENSE"
   */
  @IsEnum(TransactionType, {
    message: 'Type must be either INCOME or EXPENSE',
  })
  type: TransactionType;

  /**
   * Category UUID
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;
}
