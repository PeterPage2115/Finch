import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

type MockUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type SafeUser = Omit<MockUser, 'password'>;

type PrismaServiceMock = {
  user: {
    findUnique: jest.Mock<Promise<MockUser | SafeUser | null>, [unknown?]>;
    create: jest.Mock<Promise<MockUser>, [unknown]>;
  };
  category: {
    createMany: jest.Mock<Promise<{ count: number }>, [unknown]>;
  };
};

type JwtServiceMock = {
  signAsync: jest.Mock<Promise<string>, [unknown?]>;
};

type EmailServiceMock = {
  sendPasswordResetEmail: jest.Mock<Promise<void>, [unknown]>;
  sendWelcomeEmail: jest.Mock<Promise<void>, [unknown]>;
};

const isCreateArgs = (
  value: unknown,
): value is { data: { password: string } } => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('data' in value)) {
    return false;
  }

  const data = (value as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return (
    'password' in (data as Record<string, unknown>) &&
    typeof (data as Record<string, unknown>).password === 'string'
  );
};

// Mock bcrypt module
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaServiceMock;
  let jwtService: JwtServiceMock;

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
    const prismaMock: PrismaServiceMock = {
      user: {
        findUnique: jest.fn<Promise<MockUser | SafeUser | null>, [unknown]>(),
        create: jest.fn<Promise<MockUser>, [unknown]>(),
      },
      category: {
        createMany: jest.fn<Promise<{ count: number }>, [unknown]>(),
      },
    };

    const jwtMock: JwtServiceMock = {
      signAsync: jest.fn<Promise<string>, [unknown]>(),
    };

    const emailMock: EmailServiceMock = {
      sendPasswordResetEmail: jest.fn<Promise<void>, [unknown]>(),
      sendWelcomeEmail: jest.fn<Promise<void>, [unknown]>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: EmailService, useValue: emailMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = prismaMock;
    jwtService = jwtMock;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: mockRegisterDto.email,
        name: mockRegisterDto.name,
      });
      prismaService.category.createMany.mockResolvedValue({ count: 7 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jwtService.signAsync.mockResolvedValue('mock-jwt-token');

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
      prismaService.user.findUnique.mockResolvedValue(mockUser);

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
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);
      prismaService.category.createMany.mockResolvedValue({ count: 7 });
      jwtService.signAsync.mockResolvedValue('mock-jwt-token');

      // Act
      await service.register(mockRegisterDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      const createArgs = prismaService.user.create.mock.calls[0]?.[0];
      expect(isCreateArgs(createArgs)).toBe(true);
      if (isCreateArgs(createArgs)) {
        expect(createArgs.data.password).toBe('hashedPassword');
      }
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const hashedPassword = 'hashed-password';
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('mock-jwt-token');

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
      prismaService.user.findUnique.mockResolvedValue(null);

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
      prismaService.user.findUnique.mockResolvedValue(mockUser);
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
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('mock-jwt-token');

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
      } satisfies {
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(userWithoutPassword);

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
      prismaService.user.findUnique.mockResolvedValue(null);

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
      jwtService.signAsync.mockResolvedValue('mock-jwt-token');
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);
      prismaService.category.createMany.mockResolvedValue({ count: 7 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      await service.register(mockRegisterDto);

      // Assert
      const signArgs = jwtService.signAsync.mock.calls[0]?.[0];
      expect(signArgs).toBeDefined();
      if (typeof signArgs === 'object' && signArgs !== null) {
        const payload = signArgs as Record<string, unknown>;
        expect(typeof payload.sub).toBe('string');
        expect(typeof payload.email).toBe('string');
      } else {
        throw new Error('Expected signAsync to be called with payload object');
      }
    });
  });
});
