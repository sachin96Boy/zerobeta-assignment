import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login.user')
  async loginUser(@Payload() data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() data: { Authorization: string }) {
    console.log('data', data);

    const authorizationToken = data.Authorization;

    return this.authService.authenticate(authorizationToken);
  }
}
