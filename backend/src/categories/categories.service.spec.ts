import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryType as CategoryDtoType,
} from './dto';
import {
  Category,
  CategoryType as PrismaCategoryType,
  Prisma,
} from '@prisma/client';

type CategorySummary = Pick<
  Category,
  'id' | 'name' | 'type' | 'color' | 'icon' | 'createdAt'
>;

type CategoryDelegateMock = {
  findMany: jest.MockedFunction<
    (args: Prisma.CategoryFindManyArgs) => Promise<CategorySummary[]>
  >;
  findFirst: jest.MockedFunction<
    (args: Prisma.CategoryFindFirstArgs) => Promise<Category | null>
  >;
  create: jest.MockedFunction<
    (args: Prisma.CategoryCreateArgs) => Promise<Category>
  >;
  update: jest.MockedFunction<
    (args: Prisma.CategoryUpdateArgs) => Promise<Category>
  >;
  delete: jest.MockedFunction<
    (args: Prisma.CategoryDeleteArgs) => Promise<Category>
  >;
};

type TransactionDelegateMock = {
  count: jest.MockedFunction<
    (args: Prisma.TransactionCountArgs) => Promise<number>
  >;
};

type MockedPrismaService = {
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
  category: {
    findMany: createMockFn<
      Promise<CategorySummary[]>,
      [Prisma.CategoryFindManyArgs]
    >(),
    findFirst: createMockFn<
      Promise<Category | null>,
      [Prisma.CategoryFindFirstArgs]
    >(),
    create: createMockFn<Promise<Category>, [Prisma.CategoryCreateArgs]>(),
    update: createMockFn<Promise<Category>, [Prisma.CategoryUpdateArgs]>(),
    delete: createMockFn<Promise<Category>, [Prisma.CategoryDeleteArgs]>(),
  },
  transaction: {
    count: createMockFn<Promise<number>, [Prisma.TransactionCountArgs]>(),
  },
});

const getFirstCallArgs = <Args extends unknown[]>(
  mockFn: jest.MockedFunction<(...args: Args) => unknown>,
): Args | undefined => mockFn.mock.calls.at(0);

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: MockedPrismaService;

  const mockUserId = 'user-123';
  const mockCategoryId = 'category-456';
  const mockCategory: Category = {
    id: mockCategoryId,
    name: 'Jedzenie',
    type: PrismaCategoryType.EXPENSE,
    color: '#FF5733',
    icon: 'ShoppingCart',
    userId: mockUserId,
    createdAt: new Date('2025-10-01T00:00:00.000Z'),
    updatedAt: new Date('2025-10-01T00:00:00.000Z'),
  };

  const mockCategories: Category[] = [
    mockCategory,
    {
      id: 'category-789',
      name: 'Transport',
      type: PrismaCategoryType.EXPENSE,
      color: '#3B82F6',
      icon: 'Car',
      userId: mockUserId,
      createdAt: new Date('2025-10-01T00:00:00.000Z'),
      updatedAt: new Date('2025-10-01T00:00:00.000Z'),
    },
    {
      id: 'category-101',
      name: 'Wynagrodzenie',
      type: PrismaCategoryType.INCOME,
      color: '#10B981',
      icon: 'DollarSign',
      userId: mockUserId,
      createdAt: new Date('2025-10-01T00:00:00.000Z'),
      updatedAt: new Date('2025-10-01T00:00:00.000Z'),
    },
  ];

  const mockCategorySummaries: CategorySummary[] = mockCategories.map(
    ({ id, name, type, color, icon, createdAt }) => ({
      id,
      name,
      type,
      color,
      icon,
      createdAt,
    }),
  );

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all categories for the user', async () => {
      prismaService.category.findMany.mockResolvedValue(mockCategorySummaries);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual(mockCategorySummaries);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        select: {
          id: true,
          name: true,
          type: true,
          color: true,
          icon: true,
          createdAt: true,
        },
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
      });
    });

    it('returns empty array when user has no categories', async () => {
      prismaService.category.findMany.mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns category when it exists for the user', async () => {
      prismaService.category.findFirst.mockResolvedValue(mockCategory);

      const result = await service.findOne(mockCategoryId, mockUserId);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
    });

    it('throws NotFoundException when category does not exist', async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne('non-existent', mockUserId)).rejects.toThrow(
        new NotFoundException(
          'Kategoria o ID non-existent nie została znaleziona',
        ),
      );
    });

    it('throws NotFoundException when category belongs to another user', async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(mockCategoryId, 'other-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Nowa Kategoria',
      type: CategoryDtoType.EXPENSE,
      color: '#8B5CF6',
      icon: 'Package',
    };

    it('creates a new category for the user', async () => {
      const newCategory: Category = {
        id: 'new-category-id',
        name: createCategoryDto.name,
        type: PrismaCategoryType.EXPENSE,
        color: createCategoryDto.color,
        icon: createCategoryDto.icon,
        userId: mockUserId,
        createdAt: new Date('2025-11-01T00:00:00.000Z'),
        updatedAt: new Date('2025-11-01T00:00:00.000Z'),
      };

      prismaService.category.create.mockResolvedValue(newCategory);

      const result = await service.create(mockUserId, createCategoryDto);

      expect(result).toEqual(newCategory);
      const createCallArgs = getFirstCallArgs(prismaService.category.create);
      const createArgs = createCallArgs?.[0];

      expect(createArgs?.data).toEqual({
        ...createCategoryDto,
        userId: mockUserId,
      });
    });

    it('assigns the provided userId when creating category', async () => {
      prismaService.category.create.mockResolvedValue({
        ...mockCategory,
        id: 'new-id',
        name: createCategoryDto.name,
        color: createCategoryDto.color,
        icon: createCategoryDto.icon,
      });

      await service.create(mockUserId, createCategoryDto);

      const createCallArgs = getFirstCallArgs(prismaService.category.create);
      const createArgs = createCallArgs?.[0];

      expect(createArgs?.data?.userId).toBe(mockUserId);
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Zaktualizowana Kategoria',
      color: '#EF4444',
    };

    it('updates category when it exists for the user', async () => {
      const updatedCategory: Category = {
        ...mockCategory,
        ...updateCategoryDto,
      };

      prismaService.category.findFirst.mockResolvedValue(mockCategory);
      prismaService.category.update.mockResolvedValue(updatedCategory);

      const result = await service.update(
        mockCategoryId,
        mockUserId,
        updateCategoryDto,
      );

      expect(result).toEqual(updatedCategory);
      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: mockCategoryId },
        data: updateCategoryDto,
      });
    });

    it('throws NotFoundException when category does not exist', async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.update('non-existent', mockUserId, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.category.update).not.toHaveBeenCalled();
    });

    it("throws NotFoundException when updating another user's category", async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.update(mockCategoryId, 'other-user', updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes category when there are no related transactions', async () => {
      prismaService.category.findFirst.mockResolvedValue(mockCategory);
      prismaService.transaction.count.mockResolvedValue(0);
      prismaService.category.delete.mockResolvedValue(mockCategory);

      const result = await service.remove(mockCategoryId, mockUserId);

      expect(result).toEqual({ message: 'Kategoria została usunięta' });
      expect(prismaService.transaction.count).toHaveBeenCalledWith({
        where: { categoryId: mockCategoryId },
      });
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id: mockCategoryId },
      });
    });

    it('throws NotFoundException when category does not exist', async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(service.remove('non-existent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.transaction.count).not.toHaveBeenCalled();
      expect(prismaService.category.delete).not.toHaveBeenCalled();
    });

    it('throws ConflictException when category has related transactions', async () => {
      prismaService.category.findFirst.mockResolvedValue(mockCategory);
      prismaService.transaction.count.mockResolvedValue(5);

      await expect(service.remove(mockCategoryId, mockUserId)).rejects.toThrow(
        new ConflictException(
          'Nie można usunąć kategorii, ponieważ jest powiązana z 5 transakcjami',
        ),
      );
      expect(prismaService.category.delete).not.toHaveBeenCalled();
    });

    it("throws NotFoundException when deleting another user's category", async () => {
      prismaService.category.findFirst.mockResolvedValue(null);

      await expect(
        service.remove(mockCategoryId, 'other-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
