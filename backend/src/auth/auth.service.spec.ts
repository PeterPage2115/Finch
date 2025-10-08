import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

// Mock bcrypt module
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  // Mock data
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegisterDto: RegisterDto = {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            category: {
              createMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
            sendWelcomeEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        ...mockUser,
        email: mockRegisterDto.email,
        name: mockRegisterDto.name,
      });
      jest
        .spyOn(prismaService.category, 'createMany')
        .mockResolvedValue({ count: 7 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');

      // Act
      const result = await service.register(mockRegisterDto);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe(mockRegisterDto.email);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRegisterDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(prismaService.category.createMany).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        'Użytkownik o tym adresie email już istnieje',
      );
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should hash the password before storing', async () => {
      // Arrange
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.category, 'createMany')
        .mockResolvedValue({ count: 7 });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');

      // Act
      await service.register(mockRegisterDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          password: 'hashedPassword',
        }),
      });
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash(mockLoginDto.password, 10);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');

      // Act
      const result = await service.login(mockLoginDto);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Nieprawidłowy email lub hasło',
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Nieprawidłowy email lub hasło',
      );
    });

    it('should compare password with hashed password', async () => {
      // Arrange
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');

      // Act
      await service.login(mockLoginDto);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password field', async () => {
      // Arrange
      const userWithoutPassword = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(userWithoutPassword as any);

      // Act
      const result = await service.validateUser(mockUser.id);

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser('non-existent-id')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('non-existent-id')).rejects.toThrow(
        'Użytkownik nie istnieje',
      );
    });
  });

  describe('generateTokens', () => {
    it('should generate JWT token with correct payload', async () => {
      // Arrange
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('mock-jwt-token');
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.category, 'createMany')
        .mockResolvedValue({ count: 7 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      await service.register(mockRegisterDto);

      // Assert
      expect(signAsyncSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: expect.any(String),
          email: expect.any(String),
        }),
      );
    });
  });
});
