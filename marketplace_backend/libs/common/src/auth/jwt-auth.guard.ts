import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { User } from 'apps/users/src/models/user.entity';
import { Request } from 'express';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';

export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientGrpcProxy,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      this.authClient
        .send('authenticate', {
          Authorization: token,
        })
        .pipe(
          tap((res: User) => {
            request.user = res;
          }),
          map(() => true),
        );
      return true;
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
