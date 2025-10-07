import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsIn,
} from 'class-validator';
import { ALLOWED_LUCIDE_ICONS } from '../constants/allowed-icons';

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
  @Matches(/^[A-Z][a-zA-Z0-9]*$/, {
    message:
      'Ikona musi być nazwą ikony Lucide w formacie PascalCase (np. Car, UtensilsCrossed). Emoji nie są dozwolone.',
  })
  @IsIn([...ALLOWED_LUCIDE_ICONS], {
    message:
      'Ikona musi być jedną z dozwolonych ikon Lucide. Sprawdź dokumentację aby zobaczyć listę dostępnych ikon.',
  })
  icon: string;
}
