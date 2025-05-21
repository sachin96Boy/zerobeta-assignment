import {
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { User } from 'apps/auth/src/users/models/user.entity';
import { Request } from 'express';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';

export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafkaProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    console.log(token);

    if (!token) {
      return false;
    }

    try {
      return this.authClient
        .send('authenticate', {
          Authorization: token,
        })
        .pipe(
          tap((res: User) => {
            request.user = res;
          }),
          map(() => true),
          catchError((err) => {
            this.logger.error(err);
            return of(false);
          }),
        );
    } catch (err) {
      console.error('Error verifying token:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
