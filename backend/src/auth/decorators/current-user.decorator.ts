import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator do wyciągania zalogowanego użytkownika z request
 * Użycie: @CurrentUser() user: User
 *
 * Przykład:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
