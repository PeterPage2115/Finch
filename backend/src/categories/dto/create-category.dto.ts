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
 * DTO for creating a new category
 */
export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  @Length(2, 50, { message: 'Category name must be between 2 and 50 characters' })
  name: string;

  @IsEnum(CategoryType, {
    message: 'Category type must be INCOME or EXPENSE',
  })
  type: CategoryType;

  @IsNotEmpty({ message: 'Color is required' })
  @IsString({ message: 'Color must be a string' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be in hex format (e.g., #ef4444)',
  })
  color: string;

  @IsNotEmpty({ message: 'Icon is required' })
  @IsString({ message: 'Icon must be a string (lucide-react icon name)' })
  @Matches(/^[A-Z][a-zA-Z0-9]*$/, {
    message:
      'Icon must be a Lucide icon name in PascalCase format (e.g., Car, UtensilsCrossed). Emojis are not allowed.',
  })
  @IsIn([...ALLOWED_LUCIDE_ICONS], {
    message:
      'Icon must be one of the allowed Lucide icons. Check the documentation for the list of available icons.',
  })
  icon: string;
}
