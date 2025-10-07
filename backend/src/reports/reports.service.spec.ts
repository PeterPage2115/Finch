import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaService: PrismaService;

  // Mock data
  const mockUserId = 'user-123';
  const startDate = new Date('2025-10-01');
  const endDate = new Date('2025-10-31');

  const mockCategory1 = {
    id: 'category-food',
    name: 'Jedzenie',
    icon: 'ShoppingCart',
    color: '#10B981',
  };

  const mockCategory2 = {
    id: 'category-transport',
    name: 'Transport',
    icon: 'Car',
    color: '#3B82F6',
  };

  const mockTransactions = [
    {
      id: 'trans-1',
      amount: new Decimal(500),
      description: 'Zakupy',
      type: 'EXPENSE' as const,
      date: new Date('2025-10-05'),
      categoryId: 'category-food',
      userId: mockUserId,
      createdAt: new Date('2025-10-05'),
      updatedAt: new Date('2025-10-05'),
      category: mockCategory1,
    },
    {
      id: 'trans-2',
      amount: new Decimal(300),
      description: 'Paliwo',
      type: 'EXPENSE' as const,
      date: new Date('2025-10-10'),
      categoryId: 'category-transport',
      userId: mockUserId,
      createdAt: new Date('2025-10-10'),
      updatedAt: new Date('2025-10-10'),
      category: mockCategory2,
    },
    {
      id: 'trans-3',
      amount: new Decimal(200),
      description: 'Restauracja',
      type: 'EXPENSE' as const,
      date: new Date('2025-10-15'),
      categoryId: 'category-food',
      userId: mockUserId,
      createdAt: new Date('2025-10-15'),
      updatedAt: new Date('2025-10-15'),
      category: mockCategory1,
    },
    {
      id: 'trans-4',
      amount: new Decimal(5000),
      description: 'Pensja',
      type: 'INCOME' as const,
      date: new Date('2025-10-01'),
      categoryId: 'category-salary',
      userId: mockUserId,
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2025-10-01'),
      category: { id: 'category-salary', name: 'Wynagrodzenie', icon: 'DollarSign', color: '#10B981' },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              aggregate: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return summary report with income and expenses', async () => {
      // Arrange
      const incomeAggregate = {
        _sum: { amount: new Decimal(5000) },
        _count: 1,
      };

      const expenseAggregate = {
        _sum: { amount: new Decimal(1000) },
        _count: 3,
      };

      jest
        .spyOn(prismaService.transaction, 'aggregate')
        .mockResolvedValueOnce(incomeAggregate as any)
        .mockResolvedValueOnce(expenseAggregate as any);

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
      jest
        .spyOn(prismaService.transaction, 'aggregate')
        .mockResolvedValueOnce({ _sum: { amount: null }, _count: 0 } as any)
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(500) }, _count: 2 } as any);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(500);
      expect(result.balance).toBe(-500);
    });

    it('should handle zero expenses', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'aggregate')
        .mockResolvedValueOnce({ _sum: { amount: new Decimal(3000) }, _count: 1 } as any)
        .mockResolvedValueOnce({ _sum: { amount: null }, _count: 0 } as any);

      // Act
      const result = await service.getSummary(mockUserId, startDate, endDate);

      // Assert
      expect(result.totalIncome).toBe(3000);
      expect(result.totalExpenses).toBe(0);
      expect(result.balance).toBe(3000);
    });

    it('should handle no transactions', async () => {
      // Arrange
      jest
        .spyOn(prismaService.transaction, 'aggregate')
        .mockResolvedValueOnce({ _sum: { amount: null }, _count: 0 } as any)
        .mockResolvedValueOnce({ _sum: { amount: null }, _count: 0 } as any);

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
      jest
        .spyOn(prismaService.transaction, 'aggregate')
        .mockResolvedValue({ _sum: { amount: null }, _count: 0 } as any);

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
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(
        mockTransactions.filter((t) => t.type === 'EXPENSE'),
      );

      // Act
      const result = await service.getByCategoryReport(mockUserId, startDate, endDate);

      // Assert
      expect(result.startDate).toBe('2025-10-01');
      expect(result.endDate).toBe('2025-10-31');
      expect(result.type).toBe('ALL');
      expect(result.totalAmount).toBe(1000); // 500 + 300 + 200
      expect(result.categories).toHaveLength(2);
      
      // Jedzenie (700) should be first (sorted DESC)
      expect(result.categories[0]).toEqual({
        categoryId: 'category-food',
        categoryName: 'Jedzenie',
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
      const expenseTransactions = mockTransactions.filter((t) => t.type === 'EXPENSE');
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(expenseTransactions);

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
      const incomeTransactions = mockTransactions.filter((t) => t.type === 'INCOME');
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(incomeTransactions);

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
      expect(result.categories[0].categoryName).toBe('Wynagrodzenie');
      expect(result.totalAmount).toBe(5000);
    });

    it('should handle no transactions', async () => {
      // Arrange
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue([]);

      // Act
      const result = await service.getByCategoryReport(mockUserId, startDate, endDate);

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
          type: 'EXPENSE' as const,
          date: new Date('2025-10-05'),
          categoryId: 'cat-1',
          userId: mockUserId,
          createdAt: new Date('2025-10-05'),
          updatedAt: new Date('2025-10-05'),
          category: { id: 'cat-1', name: 'Cat1', icon: 'A', color: '#AAA' },
        },
        {
          id: 'trans-2',
          amount: new Decimal(200),
          description: 'Test 2',
          type: 'EXPENSE' as const,
          date: new Date('2025-10-10'),
          categoryId: 'cat-2',
          userId: mockUserId,
          createdAt: new Date('2025-10-10'),
          updatedAt: new Date('2025-10-10'),
          category: { id: 'cat-2', name: 'Cat2', icon: 'B', color: '#BBB' },
        },
        {
          id: 'trans-3',
          amount: new Decimal(300),
          description: 'Test 3',
          type: 'EXPENSE' as const,
          date: new Date('2025-10-15'),
          categoryId: 'cat-3',
          userId: mockUserId,
          createdAt: new Date('2025-10-15'),
          updatedAt: new Date('2025-10-15'),
          category: { id: 'cat-3', name: 'Cat3', icon: 'C', color: '#CCC' },
        },
      ];

      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(testTransactions);

      // Act
      const result = await service.getByCategoryReport(mockUserId, startDate, endDate);

      // Assert
      expect(result.totalAmount).toBe(600);
      expect(result.categories[0].percentage).toBe(50); // 300/600
      expect(result.categories[1].percentage).toBe(33.33); // 200/600
      expect(result.categories[2].percentage).toBe(16.67); // 100/600
    });

    it('should sort categories by total DESC', async () => {
      // Arrange
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(
        mockTransactions.filter((t) => t.type === 'EXPENSE'),
      );

      // Act
      const result = await service.getByCategoryReport(mockUserId, startDate, endDate);

      // Assert
      expect(result.categories[0].total).toBeGreaterThan(result.categories[1].total);
      expect(result.categories[0].categoryName).toBe('Jedzenie'); // 700
      expect(result.categories[1].categoryName).toBe('Transport'); // 300
    });

    it('should handle category with null icon/color', async () => {
      // Arrange
      const transactionWithNullCategory = [
        {
          id: 'trans-1',
          amount: new Decimal(100),
          description: 'Test Null',
          type: 'EXPENSE' as const,
          date: new Date('2025-10-05'),
          categoryId: 'cat-null',
          userId: mockUserId,
          createdAt: new Date('2025-10-05'),
          updatedAt: new Date('2025-10-05'),
          category: { id: 'cat-null', name: 'NoCat', icon: null, color: null },
        },
      ];

      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(transactionWithNullCategory);

      // Act
      const result = await service.getByCategoryReport(mockUserId, startDate, endDate);

      // Assert
      expect(result.categories[0].categoryIcon).toBeNull();
      expect(result.categories[0].categoryColor).toBeNull();
    });
  });
});
