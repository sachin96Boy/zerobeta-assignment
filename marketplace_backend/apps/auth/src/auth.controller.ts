import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    // Implement your login logic here
    const data = await this.authService.login(loginDto);
    response.send(data);
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() data: { Authorization: string }) {
    console.log('data', data);

    const authorizationToken = data.Authorization;

    return this.authService.authenticate(authorizationToken);
  }
}
