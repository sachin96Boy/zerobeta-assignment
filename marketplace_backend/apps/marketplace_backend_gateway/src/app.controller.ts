import { LoginDto } from '@app/common';
import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('marketplace')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginDto: LoginDto, @Res() response: Response) {
    return this.appService.login(loginDto).subscribe({
      next: (data) => response.send(data),
      error: (err) => response.send(500).send(err),
    });
  }
}
