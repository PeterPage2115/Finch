/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionType } from '@prisma/client';

describe('ImportController', () => {
  let controller: ImportController;
  let service: ImportService;

  const mockImportService = {
    parseAndImportTransactions: jest.fn(),
  };

  // Mock JwtAuthGuard to bypass authentication
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        {
          provide: ImportService,
          useValue: mockImportService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<ImportController>(ImportController);
    service = module.get<ImportService>(ImportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('importTransactions', () => {
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockRequest = {
      user: {
        id: mockUserId,
      },
    };

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      size: 1024,
      buffer: Buffer.from(
        'date,amount,description,categoryName\n2025-01-15,50.00,Test,Food',
      ),
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    it('should successfully import transactions from CSV file', async () => {
      const mockResult = {
        successCount: 1,
        failedCount: 0,
        totalRows: 1,
        failedRows: [],
        autoCreatedCategories: ['Food'],
      };

      mockImportService.parseAndImportTransactions.mockResolvedValue(
        mockResult,
      );

      const result = await controller.importTransactions(
        mockFile,
        mockRequest as any,
      );

      expect(result).toEqual(mockResult);
      expect(service.parseAndImportTransactions).toHaveBeenCalledWith(
        mockFile,
        mockUserId,
      );
      expect(service.parseAndImportTransactions).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors', async () => {
      const mockError = new Error('CSV parsing failed');
      mockImportService.parseAndImportTransactions.mockRejectedValue(mockError);

      await expect(
        controller.importTransactions(mockFile, mockRequest as any),
      ).rejects.toThrow('CSV parsing failed');

      expect(service.parseAndImportTransactions).toHaveBeenCalledWith(
        mockFile,
        mockUserId,
      );
    });

    it('should handle partial import success with validation errors', async () => {
      const mockResult = {
        successCount: 1,
        failedCount: 1,
        totalRows: 2,
        failedRows: [
          {
            rowNumber: 2,
            row: {
              date: 'invalid-date',
              amount: '50.00',
              description: 'Test',
              categoryName: 'Food',
              type: TransactionType.EXPENSE,
            },
            errors: ['Date must be in YYYY-MM-DD format'],
          },
        ],
        autoCreatedCategories: [],
      };

      mockImportService.parseAndImportTransactions.mockResolvedValue(
        mockResult,
      );

      const result = await controller.importTransactions(
        mockFile,
        mockRequest as any,
      );

      expect(result).toEqual(mockResult);
      expect(result.successCount).toBe(1);
      expect(result.failedCount).toBe(1);
      expect(result.failedRows).toHaveLength(1);
    });

    it('should include auto-created categories in result', async () => {
      const mockResult = {
        successCount: 2,
        failedCount: 0,
        totalRows: 2,
        failedRows: [],
        autoCreatedCategories: ['New Category 1', 'New Category 2'],
      };

      mockImportService.parseAndImportTransactions.mockResolvedValue(
        mockResult,
      );

      const result = await controller.importTransactions(
        mockFile,
        mockRequest as any,
      );

      expect(result.autoCreatedCategories).toHaveLength(2);
      expect(result.autoCreatedCategories).toContain('New Category 1');
      expect(result.autoCreatedCategories).toContain('New Category 2');
    });

    it('should extract userId from JWT token in request', async () => {
      const differentUserId = '999e4567-e89b-12d3-a456-426614174999';
      const differentRequest = {
        user: {
          id: differentUserId,
        },
      };

      const mockResult = {
        successCount: 1,
        failedCount: 0,
        totalRows: 1,
        failedRows: [],
        autoCreatedCategories: [],
      };

      mockImportService.parseAndImportTransactions.mockResolvedValue(
        mockResult,
      );

      await controller.importTransactions(mockFile, differentRequest as any);

      // Verify the correct userId was passed to service
      expect(service.parseAndImportTransactions).toHaveBeenCalledWith(
        mockFile,
        differentUserId,
      );
    });
  });
});
