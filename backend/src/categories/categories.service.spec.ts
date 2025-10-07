import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  // Mock data
  const mockUserId = 'user-123';
  const mockCategoryId = 'category-456';

  const mockCategory = {
    id: mockCategoryId,
    name: 'Jedzenie',
    type: 'EXPENSE' as const,
    color: '#FF5733',
    icon: 'ShoppingCart',
    userId: mockUserId,
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-10-01'),
  };

  const mockCategories = [
    mockCategory,
    {
      id: 'category-789',
      name: 'Transport',
      type: 'EXPENSE' as const,
      color: '#3B82F6',
      icon: 'Car',
      userId: mockUserId,
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2025-10-01'),
    },
    {
      id: 'category-101',
      name: 'Wynagrodzenie',
      type: 'INCOME' as const,
      color: '#10B981',
      icon: 'DollarSign',
      userId: mockUserId,
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2025-10-01'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            transaction: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories for user', async () => {
      // Arrange
      const categoriesWithoutUpdatedAt = mockCategories.map(({ updatedAt, ...rest }) => rest);
      jest.spyOn(prismaService.category, 'findMany').mockResolvedValue(categoriesWithoutUpdatedAt as any);

      // Act
      const result = await service.findAll(mockUserId);

      // Assert
      expect(result).toEqual(categoriesWithoutUpdatedAt);
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

    it('should return empty array if user has no categories', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findMany').mockResolvedValue([]);

      // Act
      const result = await service.findAll(mockUserId);

      // Assert
      expect(result).toEqual([]);
    });

    it('should order categories by type then name', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findMany').mockResolvedValue(mockCategories as any);

      // Act
      await service.findAll(mockUserId);

      // Assert
      expect(prismaService.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ type: 'asc' }, { name: 'asc' }],
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single category by id', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);

      // Act
      const result = await service.findOne(mockCategoryId, mockUserId);

      // Assert
      expect(result).toEqual(mockCategory);
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, userId: mockUserId },
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent', mockUserId)).rejects.toThrow(
        `Kategoria o ID non-existent nie została znaleziona`,
      );
    });

    it('should throw NotFoundException if category belongs to another user', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(mockCategoryId, 'other-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Nowa Kategoria',
      type: 'EXPENSE',
      color: '#8B5CF6',
      icon: 'Package',
    };

    it('should successfully create a new category', async () => {
      // Arrange
      const newCategory = {
        id: 'new-category-id',
        ...createCategoryDto,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.category, 'create').mockResolvedValue(newCategory);

      // Act
      const result = await service.create(mockUserId, createCategoryDto);

      // Assert
      expect(result).toEqual(newCategory);
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: {
          ...createCategoryDto,
          userId: mockUserId,
        },
      });
    });

    it('should create category with correct user association', async () => {
      // Arrange
      const newCategory = {
        id: 'new-id',
        ...createCategoryDto,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.category, 'create').mockResolvedValue(newCategory);

      // Act
      await service.create(mockUserId, createCategoryDto);

      // Assert
      expect(prismaService.category.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUserId,
          }),
        }),
      );
    });
  });

  describe('update', () => {
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Zaktualizowana Kategoria',
      color: '#EF4444',
    };

    it('should successfully update a category', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      jest.spyOn(prismaService.category, 'update').mockResolvedValue(updatedCategory);

      // Act
      const result = await service.update(mockCategoryId, mockUserId, updateCategoryDto);

      // Assert
      expect(result).toEqual(updatedCategory);
      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: mockCategoryId },
        data: updateCategoryDto,
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('non-existent', mockUserId, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.category.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if updating another user\'s category', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update(mockCategoryId, 'other-user', updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should successfully delete a category with no transactions', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.category, 'delete').mockResolvedValue(mockCategory);

      // Act
      const result = await service.remove(mockCategoryId, mockUserId);

      // Assert
      expect(result).toEqual({ message: 'Kategoria została usunięta' });
      expect(prismaService.transaction.count).toHaveBeenCalledWith({
        where: { categoryId: mockCategoryId },
      });
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id: mockCategoryId },
      });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('non-existent', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.transaction.count).not.toHaveBeenCalled();
      expect(prismaService.category.delete).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if category has related transactions', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(mockCategory);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(5);

      // Act & Assert
      await expect(service.remove(mockCategoryId, mockUserId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.remove(mockCategoryId, mockUserId)).rejects.toThrow(
        'Nie można usunąć kategorii, ponieważ jest powiązana z 5 transakcjami',
      );
      expect(prismaService.category.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if deleting another user\'s category', async () => {
      // Arrange
      jest.spyOn(prismaService.category, 'findFirst').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(mockCategoryId, 'other-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
