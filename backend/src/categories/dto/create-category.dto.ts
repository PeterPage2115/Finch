import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

/**
 * DTO dla tworzenia nowej kategorii
 */
export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nazwa kategorii jest wymagana' })
  @IsString({ message: 'Nazwa kategorii musi być tekstem' })
  @Length(2, 50, { message: 'Nazwa kategorii musi mieć od 2 do 50 znaków' })
  name: string;

  @IsEnum(CategoryType, {
    message: 'Typ kategorii musi być INCOME lub EXPENSE',
  })
  type: CategoryType;

  @IsOptional()
  @IsString({ message: 'Kolor musi być tekstem' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Kolor musi być w formacie hex (np. #3B82F6)',
  })
  color?: string;

  @IsOptional()
  @IsString({ message: 'Ikona musi być tekstem' })
  @Length(1, 10, { message: 'Ikona musi mieć od 1 do 10 znaków' })
  icon?: string;
}
