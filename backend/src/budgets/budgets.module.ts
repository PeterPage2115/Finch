import { Module } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../prisma.service';

/**
 * Module for managing budgets.
 *
 * Provides:
 * - BudgetsController: REST API endpoints
 * - BudgetsService: Business logic and database operations
 */
@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService, PrismaService],
  exports: [BudgetsService], // Export if other modules need it
})
export class BudgetsModule {}
