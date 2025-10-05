import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO dla aktualizacji istniejącej kategorii
 * Wszystkie pola są opcjonalne (dzięki PartialType)
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
