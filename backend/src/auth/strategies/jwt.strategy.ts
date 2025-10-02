import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Strategia JWT dla Passport.js
 * Automatycznie wyciąga i waliduje JWT token z nagłówka Authorization
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Metoda validate wywoływana automatycznie po pozytywnej weryfikacji tokenu
   * Payload zawiera dane z tokenu (sub = userId, email)
   * Zwracany obiekt jest dodawany do request.user
   */
  async validate(payload: { sub: string; email: string }) {
    // Pobierz użytkownika z bazy danych
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token nieprawidłowy');
    }

    return user;
  }
}
