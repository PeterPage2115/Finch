import { Test, TestingModule } from '@nestjs/testing';
import { ImportService } from './import.service';
import { PrismaService } from '../prisma.service';
import { CsvRowDto } from './dto/csv-row.dto';
import { TransactionType, CategoryType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

describe('ImportService', () => {
  let service: ImportService;
  let prisma: PrismaService;

  // Test data fixtures
  const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';
  const MOCK_CATEGORY_ID = '223e4567-e89b-12d3-a456-426614174001';

  const VALID_CSV_STRING = [
    'date,amount,description,categoryName,type,notes',
    '2025-01-15,50.00,Grocery shopping,Groceries,EXPENSE,Weekly shopping',
    '2025-01-20,3000.00,Salary,Salary,INCOME,January salary',
  ].join('\n');

  const VALID_CSV_MINIMAL = [
    'date,amount,description,categoryName',
    '2025-01-15,50.00,Grocery shopping,Groceries',
    '2025-01-20,-75.50,Electricity bill,Utilities',
  ].join('\n');

  const INVALID_CSV_MALFORMED = [
    'date,amount,description,categoryName',
    '2025-01-15,50.00,"Unmatched quote,Groceries',
  ].join('\n');

  const UTF8_CSV_STRING = [
    'date,amount,description,categoryName',
    '2025-01-15,50.00,Zakupy spożywcze,Żywność',
    '2025-01-20,100.00,Książki edukacyjne,Edukacja',
  ].join('\n');

  const EMPTY_CSV_STRING = 'date,amount,description,categoryName';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
            category: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateRow', () => {
    it('should return empty errors array for valid row with all fields', () => {
      const validRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'Test Category',
        type: 'EXPENSE',
        notes: 'Test notes',
      };

      const errors = service['validateRow'](validRow);

      expect(errors).toEqual([]);
    });

    it('should return error for invalid date format', () => {
      const invalidRow: CsvRowDto = {
        date: 'invalid-date',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'Test Category',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain(
        'Invalid date format. Use ISO 8601 (YYYY-MM-DD)',
      );
    });

    it('should return error for missing date', () => {
      const invalidRow: CsvRowDto = {
        date: '',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'Test Category',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Date is required');
    });

    it('should return error for invalid amount (non-numeric)', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: 'not-a-number',
        description: 'Test transaction',
        categoryName: 'Test Category',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Amount must be a non-zero number');
    });

    it('should return error for zero amount', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '0',
        description: 'Test transaction',
        categoryName: 'Test Category',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Amount must be a non-zero number');
    });

    it('should return error for missing description', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: '',
        categoryName: 'Test Category',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Description is required');
    });

    it('should return error for description exceeding 500 characters', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'a'.repeat(501),
        categoryName: 'Test Category',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Description must not exceed 500 characters');
    });

    it('should return error for missing category name', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: '',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Category name is required');
    });

    it('should return error for category name exceeding 100 characters', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'a'.repeat(101),
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Category name must not exceed 100 characters');
    });

    it('should return error for invalid type', () => {
      const invalidRow: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'Test Category',
        type: 'INVALID' as unknown as 'INCOME' | 'EXPENSE',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors).toContain('Type must be INCOME or EXPENSE');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidRow: CsvRowDto = {
        date: 'invalid',
        amount: '0',
        description: '',
        categoryName: '',
      };

      const errors = service['validateRow'](invalidRow);

      expect(errors.length).toBeGreaterThan(1);
      expect(errors).toContain(
        'Invalid date format. Use ISO 8601 (YYYY-MM-DD)',
      );
      expect(errors).toContain('Amount must be a non-zero number');
      expect(errors).toContain('Description is required');
      expect(errors).toContain('Category name is required');
    });
  });

  describe('parseCsvBuffer', () => {
    it('should parse valid CSV with all columns', async () => {
      const buffer = Buffer.from(VALID_CSV_STRING, 'utf8');

      const rows = await service['parseCsvBuffer'](buffer);

      expect(rows).toHaveLength(2);
      expect(rows[0]).toMatchObject({
        date: '2025-01-15',
        amount: '50.00',
        description: 'Grocery shopping',
        categoryName: 'Groceries',
        type: 'EXPENSE',
        notes: 'Weekly shopping',
      });
      expect(rows[1]).toMatchObject({
        date: '2025-01-20',
        amount: '3000.00',
        description: 'Salary',
        categoryName: 'Salary',
        type: 'INCOME',
        notes: 'January salary',
      });
    });

    it('should parse valid CSV with only required columns', async () => {
      const buffer = Buffer.from(VALID_CSV_MINIMAL, 'utf8');

      const rows = await service['parseCsvBuffer'](buffer);

      expect(rows).toHaveLength(2);
      expect(rows[0]).toMatchObject({
        date: '2025-01-15',
        amount: '50.00',
        description: 'Grocery shopping',
        categoryName: 'Groceries',
      });
      expect(rows[0].type).toBeUndefined();
      expect(rows[0].notes).toBeUndefined();
    });

    it('should preserve UTF-8 characters (Polish diacritics)', async () => {
      const buffer = Buffer.from(UTF8_CSV_STRING, 'utf8');

      const rows = await service['parseCsvBuffer'](buffer);

      expect(rows).toHaveLength(2);
      expect(rows[0].description).toBe('Zakupy spożywcze');
      expect(rows[0].categoryName).toBe('Żywność');
      expect(rows[1].description).toBe('Książki edukacyjne');
      expect(rows[1].categoryName).toBe('Edukacja');
    });

    it('should return empty array for CSV with only headers', async () => {
      const buffer = Buffer.from(EMPTY_CSV_STRING, 'utf8');

      const rows = await service['parseCsvBuffer'](buffer);

      expect(rows).toEqual([]);
    });

    it('should throw error for malformed CSV', async () => {
      const buffer = Buffer.from(INVALID_CSV_MALFORMED, 'utf8');

      await expect(service['parseCsvBuffer'](buffer)).rejects.toThrow(
        /Invalid CSV format/,
      );
    });

    it('should skip empty rows', async () => {
      const csvWithEmptyRows = [
        'date,amount,description,categoryName',
        '2025-01-15,50.00,Test,Category',
        ',,,',
        '2025-01-20,100.00,Test2,Category2',
      ].join('\n');
      const buffer = Buffer.from(csvWithEmptyRows, 'utf8');

      const rows = await service['parseCsvBuffer'](buffer);

      expect(rows).toHaveLength(2);
      expect(rows[0].description).toBe('Test');
      expect(rows[1].description).toBe('Test2');
    });
  });

  describe('findOrCreateCategory', () => {
    it('should return existing category when exact match found', async () => {
      const mockCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'test-icon',
        color: '#000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(mockCategory);

      const result = await service['findOrCreateCategory'](
        'Test Category',
        CategoryType.EXPENSE,
        MOCK_USER_ID,
      );

      expect(result).toEqual({ id: MOCK_CATEGORY_ID, existed: true });
      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          userId: MOCK_USER_ID,
          name: { equals: 'Test Category', mode: 'insensitive' },
          type: CategoryType.EXPENSE,
        },
      });
      expect(prisma.category.create).not.toHaveBeenCalled();
    });

    it('should return existing category when case-insensitive match found', async () => {
      const mockCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'test category',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'test-icon',
        color: '#000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(mockCategory);

      const result = await service['findOrCreateCategory'](
        'TEST CATEGORY',
        CategoryType.EXPENSE,
        MOCK_USER_ID,
      );

      expect(result).toEqual({ id: MOCK_CATEGORY_ID, existed: true });
      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          userId: MOCK_USER_ID,
          name: { equals: 'TEST CATEGORY', mode: 'insensitive' },
          type: CategoryType.EXPENSE,
        },
      });
    });

    it('should create new category when not found', async () => {
      const mockNewCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'New Category',
        type: CategoryType.INCOME,
        userId: MOCK_USER_ID,
        icon: 'circle-help',
        color: '#94a3b8',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.category, 'create').mockResolvedValue(mockNewCategory);

      const result = await service['findOrCreateCategory'](
        'New Category',
        CategoryType.INCOME,
        MOCK_USER_ID,
      );

      expect(result).toEqual({ id: MOCK_CATEGORY_ID, existed: false });
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'New Category',
          type: CategoryType.INCOME,
          userId: MOCK_USER_ID,
          icon: 'circle-help',
          color: '#94a3b8',
        },
      });
    });

    it('should use "Uncategorized" for empty category name', async () => {
      const mockNewCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'Uncategorized',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'circle-help',
        color: '#94a3b8',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.category, 'create').mockResolvedValue(mockNewCategory);

      const result = await service['findOrCreateCategory'](
        '',
        CategoryType.EXPENSE,
        MOCK_USER_ID,
      );

      expect(result).toEqual({ id: MOCK_CATEGORY_ID, existed: false });
      expect(prisma.category.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Uncategorized',
          }),
        }),
      );
    });
  });

  describe('checkDuplicate', () => {
    it('should return true when duplicate exists in set', () => {
      const row: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'Test',
      };
      const date = new Date('2025-01-15');
      // Key must match the format that checkDuplicate generates (Decimal normalizes to '50')
      const key = `${date.toISOString()}_50_Test transaction`;
      const duplicateSet = new Set([key]);

      const result = service['checkDuplicate'](row, duplicateSet);

      expect(result).toBe(true);
    });

    it('should return false when duplicate does not exist in set', () => {
      const row: CsvRowDto = {
        date: '2025-01-15',
        amount: '50.00',
        description: 'Test transaction',
        categoryName: 'Test',
      };
      const duplicateSet = new Set<string>();

      const result = service['checkDuplicate'](row, duplicateSet);

      expect(result).toBe(false);
    });
  });

  describe('createTransaction', () => {
    it('should create transaction with absolute amount and correct type', async () => {
      const row: CsvRowDto = {
        date: '2025-01-15',
        amount: '-50.00',
        description: 'Test transaction',
        categoryName: 'Test',
      };
      const mockTransaction = {
        id: '123',
        userId: MOCK_USER_ID,
        categoryId: MOCK_CATEGORY_ID,
        amount: new Decimal('50.00'),
        description: 'Test transaction',
        date: new Date('2025-01-15'),
        type: TransactionType.EXPENSE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prisma.transaction, 'create')
        .mockResolvedValue(mockTransaction);

      await service['createTransaction'](
        row,
        MOCK_CATEGORY_ID,
        MOCK_USER_ID,
        TransactionType.EXPENSE,
      );

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          userId: MOCK_USER_ID,
          categoryId: MOCK_CATEGORY_ID,
          amount: expect.any(Decimal),
          description: 'Test transaction',
          date: expect.any(Date),
          type: TransactionType.EXPENSE,
        },
      });
      const callArg = (prisma.transaction.create as jest.Mock<any, any>).mock
        .calls[0][0] as { data: { amount: Decimal } };
      expect(callArg.data.amount.toString()).toBe('50');
    });

    it('should trim description whitespace', async () => {
      const row: CsvRowDto = {
        date: '2025-01-15',
        amount: '100.00',
        description: '  Test with spaces  ',
        categoryName: 'Test',
      };
      const mockTransaction = {
        id: '123',
        userId: MOCK_USER_ID,
        categoryId: MOCK_CATEGORY_ID,
        amount: new Decimal('100.00'),
        description: 'Test with spaces',
        date: new Date('2025-01-15'),
        type: TransactionType.INCOME,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(prisma.transaction, 'create')
        .mockResolvedValue(mockTransaction);

      await service['createTransaction'](
        row,
        MOCK_CATEGORY_ID,
        MOCK_USER_ID,
        TransactionType.INCOME,
      );

      const callArg = (prisma.transaction.create as jest.Mock<any, any>).mock
        .calls[0][0] as { data: { description: string } };
      expect(callArg.data.description).toBe('Test with spaces');
    });
  });

  describe('parseAndImportTransactions', () => {
    it('should return empty result for empty CSV file', async () => {
      const file = {
        buffer: Buffer.from(EMPTY_CSV_STRING, 'utf8'),
      } as Express.Multer.File;

      const result = await service.parseAndImportTransactions(
        file,
        MOCK_USER_ID,
      );

      expect(result).toEqual({
        successCount: 0,
        failedCount: 0,
        totalRows: 0,
        failedRows: [],
        autoCreatedCategories: [],
        message: 'CSV file is empty',
      });
    });

    it('should successfully import all valid transactions', async () => {
      const file = {
        buffer: Buffer.from(VALID_CSV_MINIMAL, 'utf8'),
      } as Express.Multer.File;

      const mockCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'Groceries',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'test',
        color: '#000',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue({} as any);

      const result = await service.parseAndImportTransactions(
        file,
        MOCK_USER_ID,
      );

      expect(result.successCount).toBe(2);
      expect(result.failedCount).toBe(0);
      expect(result.totalRows).toBe(2);
      expect(result.failedRows).toEqual([]);
      expect(result.message).toBe('Successfully imported 2 transactions');
    });

    it('should handle partial success with invalid rows', async () => {
      const csvWithErrors = [
        'date,amount,description,categoryName',
        '2025-01-15,50.00,Valid transaction,Groceries',
        'invalid-date,50.00,Invalid transaction,Groceries',
        '2025-01-20,0,Zero amount,Groceries',
      ].join('\n');
      const file = {
        buffer: Buffer.from(csvWithErrors, 'utf8'),
      } as Express.Multer.File;

      const mockCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'Groceries',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'test',
        color: '#000',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue({} as any);

      const result = await service.parseAndImportTransactions(
        file,
        MOCK_USER_ID,
      );

      expect(result.successCount).toBe(1);
      expect(result.failedCount).toBe(2);
      expect(result.totalRows).toBe(3);
      expect(result.failedRows).toHaveLength(2);
      expect(result.failedRows[0].rowNumber).toBe(3); // Row 2 in data = row 3 in file
      expect(result.failedRows[0].errors).toContain(
        'Invalid date format. Use ISO 8601 (YYYY-MM-DD)',
      );
      expect(result.failedRows[1].errors).toContain(
        'Amount must be a non-zero number',
      );
    });

    it('should track auto-created categories', async () => {
      const file = {
        buffer: Buffer.from(VALID_CSV_MINIMAL, 'utf8'),
      } as Express.Multer.File;

      const mockNewCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'Groceries',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'circle-help',
        color: '#94a3b8',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(null); // Not found
      jest.spyOn(prisma.category, 'create').mockResolvedValue(mockNewCategory);
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue({} as any);

      const result = await service.parseAndImportTransactions(
        file,
        MOCK_USER_ID,
      );

      expect(result.autoCreatedCategories.length).toBeGreaterThan(0);
      expect(result.autoCreatedCategories).toContain('Groceries');
    });

    it('should detect and skip duplicate transactions', async () => {
      // Simplified test - just verify the duplicate logic works
      const csvWithOnlyOneRow = [
        'date,amount,description,categoryName',
        '2025-01-15,50.00,Grocery shopping,Groceries',
      ].join('\n');

      const file = {
        buffer: Buffer.from(csvWithOnlyOneRow, 'utf8'),
      } as Express.Multer.File;

      const existingTransaction = {
        id: '123',
        date: new Date('2025-01-15T00:00:00.000Z'),
        amount: new Decimal('50.00'),
        description: 'Grocery shopping',
        userId: MOCK_USER_ID,
        categoryId: MOCK_CATEGORY_ID,
        type: TransactionType.EXPENSE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCategory = {
        id: MOCK_CATEGORY_ID,
        name: 'Groceries',
        type: CategoryType.EXPENSE,
        userId: MOCK_USER_ID,
        icon: 'test',
        color: '#000',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.transaction, 'findMany')
        .mockResolvedValue([existingTransaction]);
      jest.spyOn(prisma.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prisma.transaction, 'create').mockResolvedValue({} as any);

      const result = await service.parseAndImportTransactions(
        file,
        MOCK_USER_ID,
      );

      // Should skip the one row (it's a duplicate)
      expect(result.successCount).toBe(0);
      expect(result.failedCount).toBe(1);
      expect(result.failedRows[0].errors).toContain(
        'Duplicate transaction detected (same date, amount, and description)',
      );
    });
  });
});
