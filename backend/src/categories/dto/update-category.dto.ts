import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO for updating an existing category
 * All fields are optional (thanks to PartialType)
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
