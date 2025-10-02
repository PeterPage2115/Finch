import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Guard JWT używany do ochrony endpointów wymagających autentykacji
 * Użycie: @UseGuards(JwtAuthGuard) na kontrolerze lub metodzie
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Dodaj własną logikę przed wywołaniem super.canActivate()
    return super.canActivate(context);
  }
}
