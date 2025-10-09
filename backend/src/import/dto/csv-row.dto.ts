import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CsvRowDto {
  @IsString()
  @IsNotEmpty()
  date: string; // Will be validated as ISO 8601

  @IsString()
  @IsNotEmpty()
  amount: string; // Keep as string for decimal precision

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  type?: 'INCOME' | 'EXPENSE';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string; // Accepted but not stored
}
