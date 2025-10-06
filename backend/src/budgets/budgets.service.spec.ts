import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Decimal } from '@prisma/client/runtime/library';

// Disable strict type checking for Prisma mocks (Decimal types)
/* eslint-disable @typescript-eslint/no-explicit-any */

describe('BudgetsService', () => {
  let service: BudgetsService;
  let prismaService: PrismaService;

  // Mock data
  const mockUserId = 'user-123';
  const mockCategoryId = 'category-456';
  const mockBudgetId = 'budget-789';

  const mockCategory = {
    id: mockCategoryId,
    name: 'Jedzenie',
    type: 'EXPENSE' as const,
    color: '#FF5733', // Required field in schema
    icon: '🍔',
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBudget = {
    id: mockBudgetId,
    amount: new Decimal(1000),
    categoryId: mockCategoryId,
    userId: mockUserId,
    period: 'MONTHLY' as const,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction = {
    id: 'transaction-1',
    amount: 100,
    description: 'Test transaction',
    date: new Date('2025-01-15'),
    type: 'EXPENSE' as const,
    categoryId: mockCategoryId,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: PrismaService,
          useValue: {
            budget: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            category: {
              findFirst: jest.fn(),
            },
            transaction: {
              aggregate: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBudgetDto: CreateBudgetDto = {
      amount: 1000,
      categoryId: mockCategoryId,
      period: 'MONTHLY',
      startDate: '2025-01-01', // String format for DTO
    };

    it('should successfully create a budget with auto-calculated endDate', async () => {
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(null); // No existing budget
      jest.spyOn(prismaService.budget, 'create').mockResolvedValue(mockBudget);

      const result = await service.create(mockUserId, createBudgetDto);

      expect(result).toEqual(mockBudget);
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
      expect(prismaService.budget.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if category not found', async () => {
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      await expect(service.create(mockUserId, createBudgetDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if budget already exists', async () => {
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(mockBudget); // Existing budget

      await expect(service.create(mockUserId, createBudgetDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should require endDate for CUSTOM period', async () => {
      const customDto = { ...createBudgetDto, period: 'CUSTOM' as const };
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(null);

      await expect(service.create(mockUserId, customDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all budgets for user', async () => {
      jest.spyOn(prismaService.budget, 'findMany').mockResolvedValue([mockBudget] as any);

      const result = await service.findAll(mockUserId, {});

      expect(result).toEqual([mockBudget]);
      expect(prismaService.budget.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true,
            },
          },
        },
        orderBy: { startDate: 'desc' },
      });
    });

    it('should filter budgets by categoryId', async () => {
      jest.spyOn(prismaService.budget, 'findMany').mockResolvedValue([mockBudget]);

      await service.findAll(mockUserId, { categoryId: mockCategoryId });

      expect(prismaService.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: mockCategoryId }),
        }),
      );
    });

    it('should filter budgets by period', async () => {
      jest.spyOn(prismaService.budget, 'findMany').mockResolvedValue([mockBudget]);

      await service.findAll(mockUserId, { period: 'MONTHLY' });

      expect(prismaService.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ period: 'MONTHLY' }),
        }),
      );
    });

    it('should filter active budgets (endDate >= now)', async () => {
      jest.spyOn(prismaService.budget, 'findMany').mockResolvedValue([mockBudget]);

      await service.findAll(mockUserId, { active: true });

      expect(prismaService.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            endDate: expect.objectContaining({ gte: expect.any(Date) }),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return budget with progress', async () => {
      // Mock budget WITH category relation (findOne uses findFirst with { include: { category: { select: {...} } } })
      const mockBudgetWithCategory = {
        ...mockBudget,
        category: mockCategory,
      };

      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(mockBudgetWithCategory as any);
      // calculateProgress internally uses findUnique, so mock it too
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(500) },
        _count: { amount: 5 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(150) },
      } as any);

      const result = await service.findOne(mockBudgetId, mockUserId);

      expect(result).toHaveProperty('id', mockBudgetId);
      expect(result).toHaveProperty('progress');
      expect(result.progress).toEqual({
        spent: 500,
        limit: 1000,
        percentage: 50,
        remaining: 500,
        alerts: [],
      });
    });

    it('should throw NotFoundException if budget not found', async () => {
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id', mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress with no transactions (0% spent)', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: null }, // No transactions
        _count: { amount: 0 },
        _avg: { amount: null },
        _min: { amount: null },
        _max: { amount: null },
      });

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.spent).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.remaining).toBe(1000);
      expect(result.alerts).toEqual([]);
    });

    it('should calculate progress at 50% (no alerts)', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(500) },
        _count: { amount: 5 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(150) },
      });

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.spent).toBe(500);
      expect(result.percentage).toBe(50);
      expect(result.remaining).toBe(500);
      expect(result.alerts).toEqual([]);
    });

    it('should show 80% alert when spent is 80-99%', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(850) }, // 85% of 1000
        _count: { amount: 5 },
        _avg: { amount: new Decimal(170) },
        _min: { amount: new Decimal(100) },
        _max: { amount: new Decimal(200) },
      });

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.percentage).toBe(85);
      expect(result.alerts).toContain('80%');
      expect(result.alerts).not.toContain('100%');
    });

    it('should show both 80% and 100% alerts at 100%', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(1000) }, // Exactly 100%
        _count: { amount: 10 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(150) },
      });

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.percentage).toBe(100);
      expect(result.alerts).toEqual(['80%', '100%']);
    });

    it('should handle budget exceeded (>100%)', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(1200) }, // 120%
        _count: { amount: 12 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(200) },
      });

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.percentage).toBe(120);
      expect(result.remaining).toBe(-200);
      expect(result.alerts).toEqual(['80%', '100%']);
    });

    it('should only count EXPENSE transactions (not INCOME)', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(300) },
        _count: { amount: 3 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(150) },
      });

      await service.calculateProgress(mockBudgetId);

      expect(prismaService.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'EXPENSE' }),
        }),
      );
    });

    it('should only count transactions within budget period', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(400) },
        _count: { amount: 4 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(150) },
      });

      await service.calculateProgress(mockBudgetId);

      expect(prismaService.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: mockBudget.startDate,
              lte: mockBudget.endDate,
            },
          }),
        }),
      );
    });

    it('should only count transactions for category', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.transaction, 'aggregate').mockResolvedValue({
        _sum: { amount: new Decimal(600) },
        _count: { amount: 6 },
        _avg: { amount: new Decimal(100) },
        _min: { amount: new Decimal(50) },
        _max: { amount: new Decimal(150) },
      });

      await service.calculateProgress(mockBudgetId);

      expect(prismaService.transaction.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: mockCategoryId }),
        }),
      );
    });

    it('should throw NotFoundException if budget not found', async () => {
      jest.spyOn(prismaService.budget, 'findUnique').mockResolvedValue(null);

      await expect(service.calculateProgress('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateBudgetDto = {
      amount: 1500,
    };

    it('should successfully update budget', async () => {
      const updatedBudget = { ...mockBudget, amount: new Decimal(1500) };
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.budget, 'update').mockResolvedValue(updatedBudget);

      const result = await service.update(mockUserId, mockBudgetId, updateDto);

      expect(result).toEqual(updatedBudget);
      expect(prismaService.budget.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if budget not found', async () => {
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(null);

      await expect(service.update(mockUserId, 'non-existent-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully delete budget', async () => {
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(mockBudget);
      jest.spyOn(prismaService.budget, 'delete').mockResolvedValue(mockBudget);

      // remove() method doesn't return value (void)
      const result = await service.remove(mockBudgetId, mockUserId);

      expect(result).toBeUndefined();
      expect(prismaService.budget.delete).toHaveBeenCalledWith({
        where: { id: mockBudgetId },
      });
    });

    it('should throw NotFoundException if budget not found', async () => {
      jest.spyOn(prismaService.budget, 'findFirst').mockResolvedValue(null);

      await expect(service.remove('non-existent-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
