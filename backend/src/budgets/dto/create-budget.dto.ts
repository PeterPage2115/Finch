import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

/**
 * DTO for creating a new budget.
 *
 * Business Rules:
 * - amount must be > 0
 * - period: DAILY, WEEKLY, MONTHLY, YEARLY, CUSTOM
 * - startDate is required
 * - endDate is optional (auto-calculated for non-CUSTOM periods)
 * - One budget per userId + categoryId + startDate
 */
export class CreateBudgetDto {
  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @IsDateString()
  startDate: string; // ISO 8601 format

  @IsOptional()
  @IsDateString()
  endDate?: string; // ISO 8601 format (required only for CUSTOM period)
}
