import { Injectable, Logger } from '@nestjs/common';
import { parse } from '@fast-csv/parse';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma.service';
import { CsvRowDto } from './dto/csv-row.dto';
import { ImportResultDto, FailedRow } from './dto/import-result.dto';
import { TransactionType, CategoryType } from '@prisma/client';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Main method: Parse CSV file and import transactions
   */
  async parseAndImportTransactions(
    file: Express.Multer.File,
    userId: string,
  ): Promise<ImportResultDto> {
    this.logger.log(`Starting import for user ${userId}`);

    try {
      // Parse CSV buffer into array of rows
      const rows = await this.parseCsvBuffer(file.buffer);

      if (rows.length === 0) {
        return {
          successCount: 0,
          failedCount: 0,
          totalRows: 0,
          failedRows: [],
          autoCreatedCategories: [],
          message: 'CSV file is empty',
        };
      }

      // Validate and import transactions
      const result = await this.importTransactions(rows, userId);

      this.logger.log(
        `Import completed for user ${userId}: ${result.successCount} success, ${result.failedCount} failed`,
      );

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Import failed for user ${userId}:`, errorStack);
      throw new Error(`Import failed: ${errorMessage}`);
    }
  }

  /**
   * Parse CSV buffer into array of CsvRowDto objects
   */
  private parseCsvBuffer(buffer: Buffer): Promise<CsvRowDto[]> {
    return new Promise((resolve, reject) => {
      const rows: CsvRowDto[] = [];
      const csvString = buffer.toString('utf8');

      const stream = parse<CsvRowDto, CsvRowDto>({ headers: true, trim: true })
        .on('error', (error) => {
          reject(new Error(`Invalid CSV format: ${error.message}`));
        })
        .on('data', (row: CsvRowDto) => {
          // Skip empty rows
          if (row.date || row.amount || row.description || row.categoryName) {
            rows.push(row);
          }
        })
        .on('end', () => {
          resolve(rows);
        });

      stream.write(csvString);
      stream.end();
    });
  }

  /**
   * Validate and import transactions from parsed CSV rows
   */
  private async importTransactions(
    rows: CsvRowDto[],
    userId: string,
  ): Promise<ImportResultDto> {
    const failedRows: FailedRow[] = [];
    const autoCreatedCategories = new Set<string>();
    let successCount = 0;

    // Fetch existing transactions for duplicate detection
    const duplicateSet = await this.buildDuplicateSet(rows, userId);

    // Category cache to avoid repeated DB queries
    const categoryCache = new Map<string, string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because row 1 is headers

      try {
        // Validate row
        const validationErrors = this.validateRow(row);
        if (validationErrors.length > 0) {
          failedRows.push({
            rowNumber,
            rowData: row,
            errors: validationErrors,
          });
          continue;
        }

        // Check for duplicates
        const isDuplicate = this.checkDuplicate(row, duplicateSet);
        if (isDuplicate) {
          failedRows.push({
            rowNumber,
            rowData: row,
            errors: [
              'Duplicate transaction detected (same date, amount, and description)',
            ],
          });
          continue;
        }

        // Determine transaction type first (needed for category lookup)
        const amount = new Decimal(row.amount);
        let type: TransactionType;
        if (row.type) {
          type = row.type as TransactionType;
        } else {
          // Infer type from amount sign
          type = amount.isNegative()
            ? TransactionType.EXPENSE
            : TransactionType.INCOME;
        }

        // Find or create category
        const cacheKey = `${row.categoryName.toLowerCase()}_${type}`;
        let categoryId = categoryCache.get(cacheKey);
        if (!categoryId) {
          const category = await this.findOrCreateCategory(
            row.categoryName,
            type === TransactionType.INCOME
              ? CategoryType.INCOME
              : CategoryType.EXPENSE,
            userId,
          );
          categoryId = category.id;
          categoryCache.set(cacheKey, categoryId);

          // Track if category was auto-created
          if (!category.existed) {
            autoCreatedCategories.add(row.categoryName);
          }
        }

        // Create transaction
        await this.createTransaction(row, categoryId, userId, type);
        successCount++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        this.logger.error(`Failed to import row ${rowNumber}:`, errorStack);
        failedRows.push({
          rowNumber,
          rowData: row,
          errors: ['Failed to create transaction: ' + errorMessage],
        });
      }
    }

    const failedCount = failedRows.length;
    const totalRows = rows.length;

    return {
      successCount,
      failedCount,
      totalRows,
      failedRows,
      autoCreatedCategories: Array.from(autoCreatedCategories),
      message: this.buildResultMessage(successCount, failedCount, totalRows),
    };
  }

  /**
   * Validate a CSV row
   */
  private validateRow(row: CsvRowDto): string[] {
    const errors: string[] = [];

    // Validate date
    if (!row.date || !row.date.trim()) {
      errors.push('Date is required');
    } else {
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format. Use ISO 8601 (YYYY-MM-DD)');
      }
    }

    // Validate amount
    if (!row.amount || !row.amount.trim()) {
      errors.push('Amount is required');
    } else {
      const amount = parseFloat(row.amount);
      if (isNaN(amount) || amount === 0) {
        errors.push('Amount must be a non-zero number');
      }
    }

    // Validate description
    if (!row.description || !row.description.trim()) {
      errors.push('Description is required');
    } else if (row.description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }

    // Validate category name
    if (!row.categoryName || !row.categoryName.trim()) {
      errors.push('Category name is required');
    } else if (row.categoryName.length > 100) {
      errors.push('Category name must not exceed 100 characters');
    }

    // Validate type if provided
    if (row.type && !['INCOME', 'EXPENSE'].includes(row.type)) {
      errors.push('Type must be INCOME or EXPENSE');
    }

    return errors;
  }

  /**
   * Build duplicate detection set from existing transactions
   */
  private async buildDuplicateSet(
    rows: CsvRowDto[],
    userId: string,
  ): Promise<Set<string>> {
    // Extract date range from CSV rows
    const dates = rows
      .map((r) => new Date(r.date))
      .filter((d) => !isNaN(d.getTime()));

    if (dates.length === 0) {
      return new Set();
    }

    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Fetch existing transactions in date range
    const existingTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: minDate,
          lte: maxDate,
        },
      },
      select: {
        date: true,
        amount: true,
        description: true,
      },
    });

    // Build duplicate detection set
    return new Set(
      existingTransactions.map(
        (t) =>
          `${t.date.toISOString()}_${t.amount.toString()}_${t.description}`,
      ),
    );
  }

  /**
   * Check if a row is a duplicate
   */
  private checkDuplicate(row: CsvRowDto, duplicateSet: Set<string>): boolean {
    const date = new Date(row.date);
    const key = `${date.toISOString()}_${row.amount}_${row.description}`;
    return duplicateSet.has(key);
  }

  /**
   * Find existing category or create new one
   */
  private async findOrCreateCategory(
    categoryName: string,
    categoryType: CategoryType,
    userId: string,
  ): Promise<{ id: string; existed: boolean }> {
    const trimmedName = categoryName.trim();
    const fallbackName = trimmedName || 'Uncategorized';

    // Find existing category (case-insensitive, matching type)
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        userId,
        name: {
          equals: fallbackName,
          mode: 'insensitive',
        },
        type: categoryType,
      },
    });

    if (existingCategory) {
      return { id: existingCategory.id, existed: true };
    }

    // Create new category with default icon and color
    const newCategory = await this.prisma.category.create({
      data: {
        name: fallbackName,
        type: categoryType,
        userId,
        icon: 'circle-help', // Default Lucide icon for unknown categories
        color: '#94a3b8', // Neutral slate-400 color
      },
    });

    return { id: newCategory.id, existed: false };
  }

  /**
   * Create a transaction from a CSV row
   */
  private async createTransaction(
    row: CsvRowDto,
    categoryId: string,
    userId: string,
    type: TransactionType,
  ): Promise<void> {
    const amount = new Decimal(row.amount);
    const date = new Date(row.date);

    // Create transaction
    await this.prisma.transaction.create({
      data: {
        userId,
        categoryId,
        amount: amount.abs(), // Store as positive, type indicates direction
        description: row.description.trim(),
        date,
        type,
      },
    });
  }

  /**
   * Build result message
   */
  private buildResultMessage(
    successCount: number,
    failedCount: number,
    totalRows: number,
  ): string {
    if (successCount === totalRows) {
      return `Successfully imported ${successCount} transactions`;
    } else if (successCount === 0) {
      return `Failed to import all ${totalRows} transactions. See error details below`;
    } else {
      return `Imported ${successCount} of ${totalRows} transactions. ${failedCount} rows failed validation`;
    }
  }
}
