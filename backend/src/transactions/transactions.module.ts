import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma.service';

/**
 * Moduł transakcji
 * 
 * Zawiera:
 * - TransactionsController: REST API endpoints
 * - TransactionsService: logika biznesowa
 * - PrismaService: dostęp do bazy danych
 */
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
  exports: [TransactionsService], // Eksportujemy service jeśli potrzebny w innych modułach
})
export class TransactionsModule {}
