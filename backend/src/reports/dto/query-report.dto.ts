import { IsDateString, IsOptional, IsEnum } from 'class-validator';

export class QueryReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  type?: 'INCOME' | 'EXPENSE';
}
