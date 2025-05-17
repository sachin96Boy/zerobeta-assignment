import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { UsersService } from '../users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

interface JwtPayload {
  email: string;
  sub: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    // Implement your login logic here
    const data = await this.authService.login(loginDto);
    response.send(data);
  }

  @MessagePattern('authenticate')
  authenticate(@Payload() data: { Authorization: string }) {
    console.log('data', data);
    const authorizationToken = data.Authorization;
    try {
      const payload = this.jwtService.verify<JwtPayload>(authorizationToken);

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = this.usersService.getUser({
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
