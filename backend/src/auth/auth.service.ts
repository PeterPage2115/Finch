import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

// ESLint disable dla Prisma passwordResetToken - false positive z VSCode TypeScript cache
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
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
    } catch {
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
  async updateProfile(
    userId: string,
    updateData: { name?: string; email?: string },
  ) {
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
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // Pobierz użytkownika z hasłem
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    // Sprawdź czy stare hasło jest poprawne
    const isOldPasswordValid = await this.comparePasswords(
      oldPassword,
      user.password,
    );

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

  /**
   * Forgot Password - Generuje token resetowania hasła
   */
  async forgotPassword(email: string) {
    // Znajdź użytkownika po emailu
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Zawsze zwracaj tę samą wiadomość (bezpieczeństwo - nie ujawniaj czy email istnieje)
    if (!user) {
      return {
        message:
          'Jeśli podany email istnieje, link do resetowania hasła został wysłany.',
      };
    }

    // Generuj losowy token (64 znaki hex)
    const token = crypto.randomBytes(32).toString('hex');

    // Token ważny przez 1 godzinę
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Zapisz token w bazie danych
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Wyślij email z linkiem resetowania
    await this.emailService.sendPasswordResetEmail(email, token);

    return {
      message:
        'Jeśli podany email istnieje, link do resetowania hasła został wysłany.',
    };
  }

  /**
   * Reset Password - Resetuje hasło używając tokenu
   */
  async resetPassword(token: string, newPassword: string) {
    // Znajdź token w bazie
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Sprawdź czy token istnieje, nie jest używany i nie wygasł
    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token jest nieprawidłowy lub wygasł');
    }

    // Zahaszuj nowe hasło
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Zaktualizuj hasło użytkownika
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Oznacz token jako użyty
    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return {
      message:
        'Hasło zostało pomyślnie zresetowane. Możesz się teraz zalogować.',
    };
  }
}
