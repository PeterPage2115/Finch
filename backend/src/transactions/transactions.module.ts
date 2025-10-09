import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma.service';

/**
 * Transactions module
 *
 * Contains:
 * - TransactionsController: REST API endpoints
 * - TransactionsService: business logic
 * - PrismaService: database access
 */
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
  exports: [TransactionsService], // Eksportujemy service jeśli potrzebny w innych modułach
})
export class TransactionsModule {}
