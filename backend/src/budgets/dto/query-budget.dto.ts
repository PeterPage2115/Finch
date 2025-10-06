import { IsOptional, IsUUID, IsEnum, IsBoolean } from 'class-validator';
import { BudgetPeriod } from '@prisma/client';
import { Transform } from 'class-transformer';

/**
 * DTO for querying budgets with filters.
 */
export class QueryBudgetDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean; // If true, return only budgets with endDate >= NOW
}
