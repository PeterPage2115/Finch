import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Decorator do wyciągania zalogowanego użytkownika z request
 * Użycie:
 * - @CurrentUser() user - zwraca cały obiekt użytkownika
 * - @CurrentUser('id') userId - zwraca tylko ID użytkownika
 * - @CurrentUser('email') email - zwraca tylko email użytkownika
 *
 * Przykład:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser('id') userId: string) {
 *   return this.service.findOne(userId);
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    const { user } = request;

    if (!user) {
      return undefined;
    }

    // Jeśli podano nazwę pola (np. 'id'), zwróć tylko to pole
    return data ? user[data] : user;
  },
);
