import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Jeśli podano nazwę pola (np. 'id'), zwróć tylko to pole
    return data ? user?.[data] : user;
  },
);
