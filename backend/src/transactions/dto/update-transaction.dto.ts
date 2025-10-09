import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

/**
 * DTO for updating a transaction
 *
 * Inherits all fields from CreateTransactionDto as optional
 * Allows partial updates (PATCH semantics)
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
