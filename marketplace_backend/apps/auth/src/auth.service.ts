import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { UsersService } from './users/users.service';
import { IPayload } from './types/payload.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.validate(email, password);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const userwithoutpassword = {
      ...user,
      password: undefined,
    };

    const payload = {
      email: userwithoutpassword.email,
      sub: userwithoutpassword.id,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });
    return {
      access_token: accessToken,
      userwithoutpassword,
    };
  }

  async authenticate(authorizationToken: string) {
    try {
      const payload = this.jwtService.verify<IPayload>(authorizationToken);

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = this.userService.getUser({
        email: payload.email,
        sub: payload.sub,
      });

      return user;
    } catch (err) {
      console.error('Error verifying token:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
