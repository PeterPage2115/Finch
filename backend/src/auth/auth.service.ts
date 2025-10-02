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
      throw new ConflictException('Użytkownik o tym adresie email już istnieje');
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
    const isPasswordValid = await this.comparePasswords(password, user.password);

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
}
