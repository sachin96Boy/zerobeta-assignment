import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { currentUser, JwtAuthGuard } from '@app/common';
import { User } from 'apps/auth/src/users/models/user.entity';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @MessagePattern('create_product')
  async createProduct(
    @Payload() data: CreateProductDto,
    @currentUser() user: User,
  ) {
    return this.productsService.createProduct(data, user.id);
  }
}
