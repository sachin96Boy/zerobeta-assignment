import { CreateUserDto, LoginDto } from '@app/common';
import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
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

  @Post('signup')
  @UsePipes(new ValidationPipe())
  register(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    return this.appService.register(createUserDto).subscribe({
      next: (data) => response.send(data),
      error: (err) => response.status(500).send(err),
    });
  }

  @Post('product')
  @UsePipes(new ValidationPipe())
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Res() response: Response,
  ) {
    return this.appService.createProduct(createProductDto).subscribe({
      next: (data) => response.send(data),
      error: (err) => response.status(500).send(err),
    });
  }
}
