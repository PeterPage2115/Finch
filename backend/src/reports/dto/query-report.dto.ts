import { IsDateString, IsOptional, IsEnum, IsString } from 'class-validator';

export class QueryReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  type?: 'INCOME' | 'EXPENSE';

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly'])
  granularity?: 'daily' | 'weekly' | 'monthly';
}
