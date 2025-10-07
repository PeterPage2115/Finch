import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Rejestracja nowego użytkownika
   */
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Użytkownik o tym adresie email już istnieje',
      );
    }

    // Hashuj hasło
    const hashedPassword = await this.hashPassword(password);

    // Utwórz użytkownika
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      // Utwórz domyślne kategorie dla nowego użytkownika
      await this.createDefaultCategories(user.id);

      // Zwróć tokeny
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new InternalServerErrorException(
        'Błąd podczas tworzenia użytkownika',
      );
    }
  }

  /**
   * Logowanie użytkownika
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Znajdź użytkownika
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    // Sprawdź hasło
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    // Zwróć tokeny
    return this.generateTokens(user.id, user.email);
  }

  /**
   * Walidacja użytkownika (używana przez JWT Strategy)
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    return user;
  }

  /**
   * Aktualizacja profilu użytkownika
   */
  async updateProfile(userId: string, updateData: { name?: string; email?: string }) {
    // Sprawdź czy email nie jest już zajęty przez innego użytkownika
    if (updateData.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Podany adres email jest już używany');
      }
    }

    // Aktualizuj profil
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Zmiana hasła użytkownika
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // Pobierz użytkownika z hasłem
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    // Sprawdź czy stare hasło jest poprawne
    const isOldPasswordValid = await this.comparePasswords(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Obecne hasło jest nieprawidłowe');
    }

    // Zahashuj nowe hasło
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Zaktualizuj hasło
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Hasło zostało pomyślnie zmienione' };
  }

  /**
   * Hashowanie hasła
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Porównanie hasła z hashem
   */
  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generowanie tokenów JWT
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: userId,
        email,
      },
    };
  }

  /**
   * Utworzenie domyślnych kategorii dla nowego użytkownika
   */
  private async createDefaultCategories(userId: string) {
    const defaultCategories = [
      // Kategorie wydatków
      {
        name: 'Jedzenie',
        type: 'EXPENSE' as const,
        icon: '🍔',
        color: '#10B981',
      },
      {
        name: 'Transport',
        type: 'EXPENSE' as const,
        icon: '🚗',
        color: '#3B82F6',
      },
      {
        name: 'Rozrywka',
        type: 'EXPENSE' as const,
        icon: '🎮',
        color: '#8B5CF6',
      },
      {
        name: 'Zdrowie',
        type: 'EXPENSE' as const,
        icon: '⚕️',
        color: '#EF4444',
      },
      {
        name: 'Rachunki',
        type: 'EXPENSE' as const,
        icon: '📄',
        color: '#F59E0B',
      },
      // Kategorie przychodów
      {
        name: 'Wynagrodzenie',
        type: 'INCOME' as const,
        icon: '💰',
        color: '#10B981',
      },
      {
        name: 'Inne przychody',
        type: 'INCOME' as const,
        icon: '💵',
        color: '#06B6D4',
      },
    ];

    await this.prisma.category.createMany({
      data: defaultCategories.map((cat) => ({
        ...cat,
        userId,
      })),
    });
  }
}
