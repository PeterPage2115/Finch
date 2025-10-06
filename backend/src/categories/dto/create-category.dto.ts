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

  @IsNotEmpty({ message: 'Kolor jest wymagany' })
  @IsString({ message: 'Kolor musi być tekstem' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Kolor musi być w formacie hex (np. #ef4444)',
  })
  color: string;

  @IsNotEmpty({ message: 'Ikona jest wymagana' })
  @IsString({ message: 'Ikona musi być tekstem (nazwa ikony lucide-react)' })
  @Length(2, 50, { message: 'Nazwa ikony musi mieć od 2 do 50 znaków' })
  icon: string;
}
