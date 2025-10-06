import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetDto } from './create-budget.dto';

/**
 * DTO for updating an existing budget.
 * All fields are optional.
 */
export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}
