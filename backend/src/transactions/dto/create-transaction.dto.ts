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
 * DTO dla tworzenia nowej transakcji
 *
 * Walidacja:
 * - amount: dodatnia liczba (Decimal w Prisma)
 * - description: opcjonalny string
 * - date: ISO 8601 date string
 * - type: INCOME lub EXPENSE
 * - categoryId: UUID kategorii
 */
export class CreateTransactionDto {
  /**
   * Kwota transakcji (max 12 cyfr, 2 po przecinku)
   * @example 1234.56
   */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Type(() => Number)
  amount: number;

  /**
   * Opcjonalny opis transakcji
   * @example "Zakupy spożywcze w Biedronka"
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Data transakcji w formacie ISO 8601
   * @example "2025-10-01T12:00:00.000Z"
   */
  @IsISO8601()
  date: string;

  /**
   * Typ transakcji: przychód lub wydatek
   * @example "EXPENSE"
   */
  @IsEnum(TransactionType, {
    message: 'Type must be either INCOME or EXPENSE',
  })
  type: TransactionType;

  /**
   * UUID kategorii
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  categoryId: string;
}
