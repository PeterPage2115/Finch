import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';
import {
  Category,
  CategoryType,
  Prisma,
  TransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

type CategorySummary = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
};

type TransactionWithCategory = {
  id: string;
  amount: Decimal;
  description: string | null;
  type: TransactionType;
  date: Date;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category: CategorySummary | null;
};

type TransactionSummary = {
  id: string;
  amount: Decimal;
  description: string | null;
  date: Date;
  type: TransactionType;
};

type TransactionAggregateResult = {
  _sum: { amount: Decimal | null };
  _count: number;
};

type TransactionDelegateMock = {
  aggregate: jest.MockedFunction<
    (
      args: Prisma.TransactionAggregateArgs,
    ) => Promise<TransactionAggregateResult>
  >;
  findMany: jest.MockedFunction<
    (
      args: Prisma.TransactionFindManyArgs,
    ) => Promise<TransactionWithCategory[] | TransactionSummary[]>
  >;
};

type CategoryDelegateMock = {
  findFirst: jest.MockedFunction<
    (args: Prisma.CategoryFindFirstArgs) => Promise<Category | null>
  >;
};

type MockedPrismaService = {
  transaction: TransactionDelegateMock;
  category: CategoryDelegateMock;
};

const createMockFn = <ReturnValue, Args extends unknown[]>(
  implementation?: (...args: Args) => ReturnValue,
): jest.MockedFunction<(...args: Args) => ReturnValue> =>
  jest.fn<ReturnValue, Args>(implementation) as jest.MockedFunction<
    (...args: Args) => ReturnValue
  >;

const createPrismaMock = (): MockedPrismaService => ({
  transaction: {
    aggregate: createMockFn<
      Promise<TransactionAggregateResult>,
      [Prisma.TransactionAggregateArgs]
    >(),
    findMany: createMockFn<
      Promise<TransactionWithCategory[] | TransactionSummary[]>,
      [Prisma.TransactionFindManyArgs]
    >(),
  },
  category: {
    findFirst: createMockFn<
      Promise<Category | null>,
      [Prisma.CategoryFindFirstArgs]
    >(),
  },
});

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaService: MockedPrismaService;

  const mockUserId = 'user-123';
  const startDate = new Date('2025-10-01T00:00:00.000Z');
  const endDate = new Date('2025-10-31T00:00:00.000Z');

  const mockCategory1: Category = {
    id: 'category-food',
    name: 'Food',
    icon: 'ShoppingCart',
    color: '#10B981',
    type: CategoryType.EXPENSE,
    userId: mockUserId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };
  const mockCategory2: Category = {
    id: 'category-transport',
    name: 'Transport',
    icon: 'Car',
    color: '#3B82F6',
    type: CategoryType.EXPENSE,
    userId: mockUserId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  const mockIncomeCategory: Category = {
    id: 'category-salary',
    name: 'Salary',
    icon: 'DollarSign',
    color: '#10B981',
    type: CategoryType.INCOME,
    userId: mockUserId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  const mockTransactions: TransactionWithCategory[] = [
    {
      id: 'trans-1',
      amount: new Decimal(500),
      description: 'Zakupy',
      type: TransactionType.EXPENSE,
      date: new Date('2025-10-05T00:00:00.000Z'),
      categoryId: mockCategory1.id,
      userId: mockUserId,
      createdAt: new Date('2025-10-05T00:00:00.000Z'),
      updatedAt: new Date('2025-10-05T00:00:00.000Z'),
      category: {
        id: mockCategory1.id,
        name: mockCategory1.name,
        icon: mockCategory1.icon,
        color: mockCategory1.color,
      },
    },
    {
      id: 'trans-2',
      amount: new Decimal(300),
      description: 'Paliwo',
      type: TransactionType.EXPENSE,
      date: new Date('2025-10-10T00:00:00.000Z'),
      categoryId: mockCategory2.id,
      userId: mockUserId,
      createdAt: new Date('2025-10-10T00:00:00.000Z'),
      updatedAt: new Date('2025-10-10T00:00:00.000Z'),
      category: {
        id: mockCategory2.id,
        name: mockCategory2.name,
        icon: mockCategory2.icon,
        color: mockCategory2.color,
      },
    },
    {
      id: 'trans-3',
      amount: new Decimal(200),
      description: 'Restauracja',
      type: TransactionType.EXPENSE,
      date: new Date('2025-10-15T00:00:00.000Z'),
      categoryId: mockCategory1.id,
      userId: mockUserId,
      createdAt: new Date('2025-10-15T00:00:00.000Z'),
      updatedAt: new Date('2025-10-15T00:00:00.000Z'),
      category: {
        id: mockCategory1.id,
        name: mockCategory1.name,
        icon: mockCategory1.icon,
        color: mockCategory1.color,
      },
    },
    {
      id: 'trans-4',
      amount: new Decimal(5000),
      description: 'Pensja',
      type: TransactionType.INCOME,
      date: new Date('2025-10-01T00:00:00.000Z'),
      categoryId: mockIncomeCategory.id,
      userId: mockUserId,
      createdAt: new Date('2025-10-01T00:00:00.000Z'),
      updatedAt: new Date('2025-10-01T00:00:00.000Z'),
      category: {
        id: mockIncomeCategory.id,
        name: mockIncomeCategory.name,
        icon: mockIncomeCategory.icon,
        color: mockIncomeCategory.color,
      },
    },
  ];

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get(ReportsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return summary report with income and expenses', async () => {
      // Arrange
      const incomeAggregate: TransactionAggregateResult = {
        _sum: { amount: new Decimal(5000) },
        _count: 1,
      };

      const expenseAggregate: TransactionAggregateResult = {
        _sum: { amount: new Decimal(1000) },
        _count: 3,
      };

      prismaService.transaction.aggregate
        .mockResolvedValueOnce(incomeAggregate)
        .mockResolvedValueOnce(expenseAggregate);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result).toEqual({
        startDate: '2025-10-01',
        endDate: '2025-10-31',
        totalIncome: 5000,
        totalExpenses: 1000,
        balance: 4000,
        transactionCount: {
          income: 1,
          expenses: 3,
        },
      });

      expect(prismaService.transaction.aggregate).toHaveBeenCalledTimes(2);
      expect(prismaService.transaction.aggregate).toHaveBeenNthCalledWith(1, {
        where: {
          userId: mockUserId,
          type: 'INCOME',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
        _count: true,
      });
      expect(prismaService.transaction.aggregate).toHaveBeenNthCalledWith(2, {
        where: {
          userId: mockUserId,
          type: 'EXPENSE',
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
        _count: true,
      });
    });

    it('should handle zero income', async () => {
      // Arrange
      const zeroAggregate: TransactionAggregateResult = {
        _sum: { amount: null },
        _count: 0,
      };
      const expenseAggregate: TransactionAggregateResult = {
        _sum: { amount: new Decimal(500) },
        _count: 2,
      };

      prismaService.transaction.aggregate
        .mockResolvedValueOnce(zeroAggregate)
        .mockResolvedValueOnce(expenseAggregate);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(500);
      expect(result.balance).toBe(-500);
    });

    it('should handle zero expenses', async () => {
      // Arrange
      const incomeAggregate: TransactionAggregateResult = {
        _sum: { amount: new Decimal(3000) },
        _count: 1,
      };
      const zeroAggregate: TransactionAggregateResult = {
        _sum: { amount: null },
        _count: 0,
      };

      prismaService.transaction.aggregate
        .mockResolvedValueOnce(incomeAggregate)
        .mockResolvedValueOnce(zeroAggregate);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result.totalIncome).toBe(3000);
      expect(result.totalExpenses).toBe(0);
      expect(result.balance).toBe(3000);
    });

    it('should handle no transactions', async () => {
      // Arrange
      const zeroAggregate: TransactionAggregateResult = {
        _sum: { amount: null },
        _count: 0,
      };

      prismaService.transaction.aggregate
        .mockResolvedValueOnce(zeroAggregate)
        .mockResolvedValueOnce(zeroAggregate);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.balance).toBe(0);
      expect(result.transactionCount).toEqual({ income: 0, expenses: 0 });
    });

    it('should format dates correctly', async () => {
      // Arrange
      const zeroAggregate: TransactionAggregateResult = {
        _sum: { amount: null },
        _count: 0,
      };

      prismaService.transaction.aggregate.mockResolvedValue(zeroAggregate);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result.startDate).toBe('2025-10-01');
      expect(result.endDate).toBe('2025-10-31');
    });
  });

  describe('getByCategoryReport', () => {
    it('should return category breakdown for all transactions', async () => {
      // Arrange
      prismaService.transaction.findMany.mockResolvedValue(
        mockTransactions.filter((t) => t.type === TransactionType.EXPENSE),
      );

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
      );

      // Assert
      expect(result.startDate).toBe('2025-10-01');
      expect(result.endDate).toBe('2025-10-31');
      expect(result.type).toBe('ALL');
      expect(result.totalAmount).toBe(1000); // 500 + 300 + 200
      expect(result.categories).toHaveLength(2);

      // Food (700) should be first (sorted DESC)
      expect(result.categories[0]).toEqual({
        categoryId: 'category-food',
        categoryName: 'Food',
        categoryIcon: 'ShoppingCart',
        categoryColor: '#10B981',
        total: 700,
        transactionCount: 2,
        percentage: 70, // 700/1000 * 100
      });

      // Transport (300) should be second
      expect(result.categories[1]).toEqual({
        categoryId: 'category-transport',
        categoryName: 'Transport',
        categoryIcon: 'Car',
        categoryColor: '#3B82F6',
        total: 300,
        transactionCount: 1,
        percentage: 30,
      });
    });

    it('should filter by EXPENSE type', async () => {
      // Arrange
      const expenseTransactions = mockTransactions.filter(
        (t) => t.type === TransactionType.EXPENSE,
      );
      prismaService.transaction.findMany.mockResolvedValue(expenseTransactions);

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
        'EXPENSE',
      );

      // Assert
      expect(result.type).toBe('EXPENSE');
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          date: { gte: startDate, lte: endDate },
          type: 'EXPENSE',
        },
        include: {
          category: {
            select: { id: true, name: true, icon: true, color: true },
          },
        },
      });
    });

    it('should filter by INCOME type', async () => {
      // Arrange
      const incomeTransactions = mockTransactions.filter(
        (t) => t.type === TransactionType.INCOME,
      );
      prismaService.transaction.findMany.mockResolvedValue(incomeTransactions);

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
        'INCOME',
      );

      // Assert
      expect(result.type).toBe('INCOME');
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].categoryName).toBe('Salary');
      expect(result.totalAmount).toBe(5000);
    });

    it('should handle no transactions', async () => {
      // Arrange
      prismaService.transaction.findMany.mockResolvedValue([]);

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
      );

      // Assert
      expect(result.categories).toEqual([]);
      expect(result.totalAmount).toBe(0);
    });

    it('should calculate percentages correctly', async () => {
      // Arrange
      const testTransactions = [
        {
          id: 'trans-1',
          amount: new Decimal(100),
          description: 'Test 1',
          type: TransactionType.EXPENSE,
          date: new Date('2025-10-05T00:00:00.000Z'),
          categoryId: 'cat-1',
          userId: mockUserId,
          createdAt: new Date('2025-10-05T00:00:00.000Z'),
          updatedAt: new Date('2025-10-05T00:00:00.000Z'),
          category: {
            id: 'cat-1',
            name: 'Cat1',
            icon: 'A',
            color: '#AAA',
          },
        },
        {
          id: 'trans-2',
          amount: new Decimal(200),
          description: 'Test 2',
          type: TransactionType.EXPENSE,
          date: new Date('2025-10-10T00:00:00.000Z'),
          categoryId: 'cat-2',
          userId: mockUserId,
          createdAt: new Date('2025-10-10T00:00:00.000Z'),
          updatedAt: new Date('2025-10-10T00:00:00.000Z'),
          category: {
            id: 'cat-2',
            name: 'Cat2',
            icon: 'B',
            color: '#BBB',
          },
        },
        {
          id: 'trans-3',
          amount: new Decimal(300),
          description: 'Test 3',
          type: TransactionType.EXPENSE,
          date: new Date('2025-10-15T00:00:00.000Z'),
          categoryId: 'cat-3',
          userId: mockUserId,
          createdAt: new Date('2025-10-15T00:00:00.000Z'),
          updatedAt: new Date('2025-10-15T00:00:00.000Z'),
          category: {
            id: 'cat-3',
            name: 'Cat3',
            icon: 'C',
            color: '#CCC',
          },
        },
      ];

      prismaService.transaction.findMany.mockResolvedValue(testTransactions);

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
      );

      // Assert
      expect(result.totalAmount).toBe(600);
      expect(result.categories[0].percentage).toBe(50); // 300/600
      expect(result.categories[1].percentage).toBe(33.33); // 200/600
      expect(result.categories[2].percentage).toBe(16.67); // 100/600
    });

    it('should sort categories by total DESC', async () => {
      // Arrange
      prismaService.transaction.findMany.mockResolvedValue(
        mockTransactions.filter((t) => t.type === TransactionType.EXPENSE),
      );

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
      );

      // Assert
      expect(result.categories[0].total).toBeGreaterThan(
        result.categories[1].total,
      );
      expect(result.categories[0].categoryName).toBe('Food'); // 700
      expect(result.categories[1].categoryName).toBe('Transport'); // 300
    });

    it('should handle category with null icon/color', async () => {
      // Arrange
      const transactionWithNullCategory = [
        {
          id: 'trans-1',
          amount: new Decimal(100),
          description: 'Test Null',
          type: TransactionType.EXPENSE,
          date: new Date('2025-10-05T00:00:00.000Z'),
          categoryId: 'cat-null',
          userId: mockUserId,
          createdAt: new Date('2025-10-05T00:00:00.000Z'),
          updatedAt: new Date('2025-10-05T00:00:00.000Z'),
          category: {
            id: 'cat-null',
            name: 'NoCat',
            icon: null,
            color: null,
          },
        },
      ];

      prismaService.transaction.findMany.mockResolvedValue(
        transactionWithNullCategory,
      );

      // Act
      const result = await service.getByCategoryReport(
        mockUserId,
        startDate,
        endDate,
      );

      // Assert
      expect(result.categories[0].categoryIcon).toBeNull();
      expect(result.categories[0].categoryColor).toBeNull();
    });
  });

  describe('getCategoryDetails', () => {
    it('should return category details with transactions', async () => {
      // Arrange
      const categoryId = 'category-food';
      const mockTransactionsForCategory: TransactionSummary[] = [
        {
          id: 'trans-1',
          amount: new Decimal(500),
          description: 'Zakupy',
          date: new Date('2025-10-05T00:00:00.000Z'),
          type: TransactionType.EXPENSE,
        },
        {
          id: 'trans-2',
          amount: new Decimal(300),
          description: 'Restauracja',
          date: new Date('2025-10-10T00:00:00.000Z'),
          type: TransactionType.EXPENSE,
        },
      ];

      prismaService.category.findFirst.mockResolvedValue(mockCategory1);
      prismaService.transaction.findMany.mockResolvedValue(
        mockTransactionsForCategory,
      );

      // Act
      const result = await service.getCategoryDetails(
        mockUserId,
        categoryId,
        startDate,
        endDate,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.category.id).toBe(categoryId);
      expect(result.category.name).toBe('Food');
      expect(result.summary.totalAmount).toBe(800);
      expect(result.summary.transactionCount).toBe(2);
      expect(result.summary.averageAmount).toBe(400);
      expect(result.transactions).toHaveLength(2);
      expect(result.period.startDate).toBe('2025-10-01');
      expect(result.period.endDate).toBe('2025-10-31');

      // Verify Prisma calls
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUserId },
      });
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          categoryId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'desc' },
        select: {
          id: true,
          amount: true,
          description: true,
          date: true,
          type: true,
        },
      });
    });

    it('should throw error if category not found', async () => {
      // Arrange
      const categoryId = 'non-existent';
      prismaService.category.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getCategoryDetails(mockUserId, categoryId, startDate, endDate),
      ).rejects.toThrow('Category not found');
    });

    it('should return zero values when no transactions', async () => {
      // Arrange
      const categoryId = 'category-empty';
      prismaService.category.findFirst.mockResolvedValue(mockCategory1);
      prismaService.transaction.findMany.mockResolvedValue([]);

      // Act
      const result = await service.getCategoryDetails(
        mockUserId,
        categoryId,
        startDate,
        endDate,
      );

      // Assert
      expect(result.summary.totalAmount).toBe(0);
      expect(result.summary.transactionCount).toBe(0);
      expect(result.summary.averageAmount).toBe(0);
      expect(result.transactions).toHaveLength(0);
    });

    it('should handle category not belonging to user', async () => {
      // Arrange
      const categoryId = 'other-user-category';
      prismaService.category.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getCategoryDetails(mockUserId, categoryId, startDate, endDate),
      ).rejects.toThrow('Category not found');

      // Verify correct where clause was used
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: categoryId, userId: mockUserId },
      });
    });
  });
});
