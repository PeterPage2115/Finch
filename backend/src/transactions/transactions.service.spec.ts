import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;

  // Mock data
  const mockUserId = 'user-123';
  const mockCategoryId = 'category-456';
  const mockTransactionId = 'transaction-789';

  const mockCategory = {
    id: mockCategoryId,
    name: 'Jedzenie',
    type: 'EXPENSE' as const,
    color: '#FF5733',
    icon: '🍔',
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction = {
    id: mockTransactionId,
    amount: new Decimal(100.5),
    description: 'Zakupy spożywcze',
    date: new Date('2025-10-01'),
    type: 'EXPENSE' as const,
    userId: mockUserId,
    categoryId: mockCategoryId,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategory,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            category: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 100.5,
      description: 'Zakupy spożywcze',
      date: '2025-10-01',
      type: 'EXPENSE',
      categoryId: mockCategoryId,
    };

    it('should successfully create a transaction', async () => {
      // Arrange
      jest
        .spyOn(prismaService.category, 'findFirst')
        .mockResolvedValue(mockCategory);
      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await service.create(mockUserId, createTransactionDto);

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          amount: createTransactionDto.amount,
          description: createTransactionDto.description,
          date: new Date(createTransactionDto.date),
          type: createTransactionDto.type,
          userId: mockUserId,
          categoryId: mockCategoryId,
        },
        include: { category: true },
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.create(mockUserId, createTransactionDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.create(mockUserId, createTransactionDto),
      ).rejects.toThrow(
        `Category with ID ${mockCategoryId} not found or does not belong to user`,
      );
      expect(prismaService.transaction.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if category belongs to another user', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.create(mockUserId, createTransactionDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockTransactions = [mockTransaction];

    it('should return paginated transactions with default pagination', async () => {
      // Arrange
      const query: QueryTransactionDto = {};
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(1);

      // Act
      const result = await service.findAll(mockUserId, query);

      // Assert
      expect(result).toEqual({
        data: mockTransactions,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: { category: true },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter transactions by type', async () => {
      // Arrange
      const query: QueryTransactionDto = { type: 'EXPENSE' };
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(1);

      // Act
      const result = await service.findAll(mockUserId, query);

      // Assert
      expect(result).toBeDefined();
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, type: 'EXPENSE' },
        }),
      );
    });

    it('should filter transactions by categoryId', async () => {
      // Arrange
      const query: QueryTransactionDto = { categoryId: mockCategoryId };
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(1);

      // Act
      await service.findAll(mockUserId, query);

      // Assert
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, categoryId: mockCategoryId },
        }),
      );
    });

    it('should filter transactions by date range', async () => {
      // Arrange
      const query: QueryTransactionDto = {
        startDate: '2025-10-01',
        endDate: '2025-10-31',
      };
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(1);

      // Act
      await service.findAll(mockUserId, query);

      // Assert
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: mockUserId,
            date: {
              gte: new Date('2025-10-01'),
              lte: new Date('2025-10-31'),
            },
          },
        }),
      );
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const query: QueryTransactionDto = { page: 2, limit: 5 };
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(15);

      // Act
      const result = await service.findAll(mockUserId, query);

      // Assert
      expect(result.meta).toEqual({
        total: 15,
        page: 2,
        limit: 5,
        totalPages: 3,
      });
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single transaction by id', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await service.findOne(mockTransactionId, mockUserId);

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(prismaService.transaction.findFirst).toHaveBeenCalledWith({
        where: { id: mockTransactionId, userId: mockUserId },
        include: { category: true },
      });
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if transaction belongs to another user', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findOne(mockTransactionId, 'other-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateTransactionDto: UpdateTransactionDto = {
      amount: 150.75,
      description: 'Zaktualizowane zakupy',
    };

    it('should successfully update a transaction', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(mockTransaction);
      const updatedTransaction = {
        ...mockTransaction,
        amount: new Decimal(150.75),
        description: 'Zaktualizowane zakupy',
      };
      jest
        .spyOn(prismaService.transaction, 'update')
        .mockResolvedValue(updatedTransaction);

      // Act
      const result = await service.update(
        mockTransactionId,
        mockUserId,
        updateTransactionDto,
      );

      // Assert
      expect(result).toEqual(updatedTransaction);
      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: { id: mockTransactionId },
        data: updateTransactionDto,
        include: { category: true },
      });
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('non-existent', mockUserId, updateTransactionDto),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.transaction.update).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenException if updating another user's transaction", async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update(mockTransactionId, 'other-user', updateTransactionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should validate new categoryId if provided', async () => {
      // Arrange
      const updateWithNewCategory: UpdateTransactionDto = {
        categoryId: 'new-category-id',
      };
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(mockTransaction);
      jest
        .spyOn(prismaService.category, 'findFirst')
        .mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.transaction, 'update').mockResolvedValue({
        ...mockTransaction,
        categoryId: 'new-category-id',
      });

      // Act
      await service.update(
        mockTransactionId,
        mockUserId,
        updateWithNewCategory,
      );

      // Assert
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: 'new-category-id', userId: mockUserId },
      });
    });
  });

  describe('remove', () => {
    it('should successfully delete a transaction', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(mockTransaction);
      jest
        .spyOn(prismaService.transaction, 'delete')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await service.remove(mockTransactionId, mockUserId);

      // Assert
      expect(result).toEqual({ message: 'Transaction deleted successfully' });
      expect(prismaService.transaction.delete).toHaveBeenCalledWith({
        where: { id: mockTransactionId },
      });
    });

    it('should throw NotFoundException if transaction does not exist', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('non-existent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.transaction.delete).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenException if deleting another user's transaction", async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'findFirst')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.remove(mockTransactionId, 'other-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
