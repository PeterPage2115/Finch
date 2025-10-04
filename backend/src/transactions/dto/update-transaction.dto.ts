import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

/**
 * DTO dla aktualizacji transakcji
 * 
 * Dziedziczy wszystkie pola z CreateTransactionDto jako opcjonalne
 * Pozwala na częściową aktualizację (PATCH semantics)
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
