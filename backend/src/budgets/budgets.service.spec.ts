import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import {
  Budget,
  BudgetPeriod,
  Category,
  CategoryType,
  Prisma,
  TransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

type CategorySummary = Pick<
  Category,
  'id' | 'name' | 'type' | 'color' | 'icon'
>;
type BudgetWithCategory = Budget & { category: CategorySummary };

type TransactionAggregateResult = {
  _sum: { amount: Decimal | null };
  _count?: { amount: number };
  _avg?: { amount: Decimal | null };
  _min?: { amount: Decimal | null };
  _max?: { amount: Decimal | null };
};

type BudgetDelegateMock = {
  findUnique: jest.MockedFunction<
    (args: Prisma.BudgetFindUniqueArgs) => Promise<Budget | null>
  >;
  findFirst: jest.MockedFunction<
    (
      args: Prisma.BudgetFindFirstArgs,
    ) => Promise<Budget | BudgetWithCategory | null>
  >;
  findMany: jest.MockedFunction<
    (args: Prisma.BudgetFindManyArgs) => Promise<BudgetWithCategory[]>
  >;
  create: jest.MockedFunction<
    (args: Prisma.BudgetCreateArgs) => Promise<BudgetWithCategory>
  >;
  update: jest.MockedFunction<
    (args: Prisma.BudgetUpdateArgs) => Promise<BudgetWithCategory>
  >;
  delete: jest.MockedFunction<
    (args: Prisma.BudgetDeleteArgs) => Promise<Budget>
  >;
};

type CategoryDelegateMock = {
  findFirst: jest.MockedFunction<
    (args: Prisma.CategoryFindFirstArgs) => Promise<Category | null>
  >;
};

type TransactionDelegateMock = {
  aggregate: jest.MockedFunction<
    (
      args: Prisma.TransactionAggregateArgs,
    ) => Promise<TransactionAggregateResult>
  >;
};

type MockedPrismaService = {
  budget: BudgetDelegateMock;
  category: CategoryDelegateMock;
  transaction: TransactionDelegateMock;
};

const createMockFn = <ReturnValue, Args extends unknown[]>(
  implementation?: (...args: Args) => ReturnValue,
): jest.MockedFunction<(...args: Args) => ReturnValue> =>
  jest.fn<ReturnValue, Args>(implementation) as jest.MockedFunction<
    (...args: Args) => ReturnValue
  >;

const createPrismaMock = (): MockedPrismaService => ({
  budget: {
    findUnique: createMockFn<
      Promise<Budget | null>,
      [Prisma.BudgetFindUniqueArgs]
    >(),
    findFirst: createMockFn<
      Promise<Budget | BudgetWithCategory | null>,
      [Prisma.BudgetFindFirstArgs]
    >(),
    findMany: createMockFn<
      Promise<BudgetWithCategory[]>,
      [Prisma.BudgetFindManyArgs]
    >(),
    create: createMockFn<
      Promise<BudgetWithCategory>,
      [Prisma.BudgetCreateArgs]
    >(),
    update: createMockFn<
      Promise<BudgetWithCategory>,
      [Prisma.BudgetUpdateArgs]
    >(),
    delete: createMockFn<Promise<Budget>, [Prisma.BudgetDeleteArgs]>(),
  },
  category: {
    findFirst: createMockFn<
      Promise<Category | null>,
      [Prisma.CategoryFindFirstArgs]
    >(),
  },
  transaction: {
    aggregate: createMockFn<
      Promise<TransactionAggregateResult>,
      [Prisma.TransactionAggregateArgs]
    >(),
  },
});

describe('BudgetsService', () => {
  let service: BudgetsService;
  let prismaService: MockedPrismaService;

  // Mock data
  const mockUserId = 'user-123';
  const mockCategoryId = 'category-456';
  const mockBudgetId = 'budget-789';

  const mockCategory: Category = {
    id: mockCategoryId,
    name: 'Jedzenie',
    type: CategoryType.EXPENSE,
    color: '#FF5733', // Required field in schema
    icon: '🍔',
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategorySummary: CategorySummary = {
    id: mockCategoryId,
    name: mockCategory.name,
    type: mockCategory.type,
    color: mockCategory.color,
    icon: mockCategory.icon,
  };

  const mockBudget: Budget = {
    id: mockBudgetId,
    amount: new Decimal(1000),
    categoryId: mockCategoryId,
    userId: mockUserId,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBudgetWithCategory: BudgetWithCategory = {
    ...mockBudget,
    category: mockCategorySummary,
  };

  const mockBudgetsList: BudgetWithCategory[] = [mockBudgetWithCategory];

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBudgetDto: CreateBudgetDto = {
      amount: 1000,
      categoryId: mockCategoryId,
      period: BudgetPeriod.MONTHLY,
      startDate: '2025-01-01', // String format for DTO
    };

    it('should successfully create a budget with auto-calculated endDate', async () => {
      prismaService.category.findFirst.mockResolvedValue(mockCategory);
      prismaService.budget.findFirst.mockResolvedValue(null);
      prismaService.budget.create.mockResolvedValue(mockBudgetWithCategory);

      const result = await service.create(mockUserId, createBudgetDto);

      expect(result).toEqual(mockBudgetWithCategory);
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
      const createArgs = prismaService.budget.create.mock.calls[0]?.[0];
      expect(createArgs).toBeDefined();
      expect(createArgs?.data?.userId).toBe(mockUserId);
    });

    it('should throw BadRequestException if category not found', async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.create(mockUserId, createBudgetDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if budget already exists', async () => {
      prismaService.category.findFirst.mockResolvedValue(mockCategory);
      prismaService.budget.findFirst.mockResolvedValue(mockBudget);

      await expect(service.create(mockUserId, createBudgetDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should require endDate for CUSTOM period', async () => {
      const customDto = {
        ...createBudgetDto,
        period: BudgetPeriod.CUSTOM,
      };
      prismaService.category.findFirst.mockResolvedValue(mockCategory);
      prismaService.budget.findFirst.mockResolvedValue(null);

      await expect(service.create(mockUserId, customDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all budgets for user', async () => {
      prismaService.budget.findMany.mockResolvedValue(mockBudgetsList);

      const result = await service.findAll(mockUserId, {});

      expect(result).toEqual(mockBudgetsList);
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
      prismaService.budget.findMany.mockResolvedValue(mockBudgetsList);

      await service.findAll(mockUserId, { categoryId: mockCategoryId });

      const findManyArgs = prismaService.budget.findMany.mock.calls[0]?.[0];
      expect(findManyArgs?.where?.categoryId).toBe(mockCategoryId);
    });

    it('should filter budgets by period', async () => {
      prismaService.budget.findMany.mockResolvedValue(mockBudgetsList);

      await service.findAll(mockUserId, { period: BudgetPeriod.MONTHLY });

      const findManyArgs = prismaService.budget.findMany.mock.calls[0]?.[0];
      expect(findManyArgs?.where?.period).toBe(BudgetPeriod.MONTHLY);
    });

    it('should filter active budgets (endDate >= now)', async () => {
      prismaService.budget.findMany.mockResolvedValue(mockBudgetsList);

      await service.findAll(mockUserId, { active: true });

      const findManyArgs = prismaService.budget.findMany.mock.calls[0]?.[0];
      const endDateFilter = findManyArgs?.where?.endDate;
      if (!endDateFilter || typeof endDateFilter !== 'object') {
        throw new Error('Expected endDate filter with gte');
      }
      if (!('gte' in endDateFilter)) {
        throw new Error('Expected endDate filter to include gte');
      }
      expect(endDateFilter.gte).toBeInstanceOf(Date);
    });
  });

  describe('findOne', () => {
    it('should return budget with progress', async () => {
      prismaService.budget.findFirst.mockResolvedValue(mockBudgetWithCategory);
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      prismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: new Decimal(500) },
      });

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
      prismaService.budget.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateProgress', () => {
    const setAggregateAmount = (amount: number | null) =>
      prismaService.transaction.aggregate.mockResolvedValue({
        _sum: {
          amount: amount === null ? null : new Decimal(amount),
        },
      });

    it('should calculate progress with no transactions (0% spent)', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(null);

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.spent).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.remaining).toBe(1000);
      expect(result.alerts).toEqual([]);
    });

    it('should calculate progress at 50% (no alerts)', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(500);

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.spent).toBe(500);
      expect(result.percentage).toBe(50);
      expect(result.remaining).toBe(500);
      expect(result.alerts).toEqual([]);
    });

    it('should show 80% alert when spent is 80-99%', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(850);

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.percentage).toBe(85);
      expect(result.alerts).toContain('80%');
      expect(result.alerts).not.toContain('100%');
    });

    it('should show both 80% and 100% alerts at 100%', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(1000);

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.percentage).toBe(100);
      expect(result.alerts).toEqual(['80%', '100%']);
    });

    it('should handle budget exceeded (>100%)', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(1200);

      const result = await service.calculateProgress(mockBudgetId);

      expect(result.percentage).toBe(120);
      expect(result.remaining).toBe(-200);
      expect(result.alerts).toEqual(['80%', '100%']);
    });

    it('should only count EXPENSE transactions (not INCOME)', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(300);

      await service.calculateProgress(mockBudgetId);

      const aggregateArgs =
        prismaService.transaction.aggregate.mock.calls[0]?.[0];
      expect(aggregateArgs?.where?.type).toBe(TransactionType.EXPENSE);
    });

    it('should only count transactions within budget period', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(400);

      await service.calculateProgress(mockBudgetId);

      const aggregateArgs =
        prismaService.transaction.aggregate.mock.calls[0]?.[0];
      const dateFilter = aggregateArgs?.where?.date;
      if (!dateFilter || typeof dateFilter !== 'object') {
        throw new Error('Expected date filter in aggregate where clause');
      }

      expect('gte' in dateFilter ? dateFilter.gte : undefined).toEqual(
        mockBudget.startDate,
      );
      expect('lte' in dateFilter ? dateFilter.lte : undefined).toEqual(
        mockBudget.endDate,
      );
    });

    it('should only count transactions for category', async () => {
      prismaService.budget.findUnique.mockResolvedValue(mockBudget);
      setAggregateAmount(600);

      await service.calculateProgress(mockBudgetId);

      const aggregateArgs =
        prismaService.transaction.aggregate.mock.calls[0]?.[0];
      expect(aggregateArgs?.where?.categoryId).toBe(mockCategoryId);
    });

    it('should throw NotFoundException if budget not found', async () => {
      prismaService.budget.findUnique.mockResolvedValue(null);

      await expect(
        service.calculateProgress('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateBudgetDto = {
      amount: 1500,
    };

    it('should successfully update budget', async () => {
      const updatedBudget: BudgetWithCategory = {
        ...mockBudgetWithCategory,
        amount: new Decimal(1500),
      };
      prismaService.budget.findFirst.mockResolvedValue(mockBudget);
      prismaService.budget.update.mockResolvedValue(updatedBudget);

      const result = await service.update(mockUserId, mockBudgetId, updateDto);

      expect(result).toEqual(updatedBudget);
      expect(prismaService.budget.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if budget not found', async () => {
      prismaService.budget.findFirst.mockResolvedValue(null);

      await expect(
        service.update(mockUserId, 'non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should successfully delete budget', async () => {
      prismaService.budget.findFirst.mockResolvedValue(mockBudget);
      prismaService.budget.delete.mockResolvedValue(mockBudget);

      // remove() method doesn't return value (void)
      const result = await service.remove(mockBudgetId, mockUserId);

      expect(result).toBeUndefined();
      expect(prismaService.budget.delete).toHaveBeenCalledWith({
        where: { id: mockBudgetId },
      });
    });

    it('should throw NotFoundException if budget not found', async () => {
      prismaService.budget.findFirst.mockResolvedValue(null);

      await expect(
        service.remove('non-existent-id', mockUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
