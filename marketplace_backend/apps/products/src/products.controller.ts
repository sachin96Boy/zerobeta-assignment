import { currentUser, JwtAuthGuard } from '@app/common';
import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from 'apps/auth/src/users/models/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @MessagePattern('create.product')
  async createProduct(
    @Payload() data: CreateProductDto,
    @currentUser() user: User,
  ) {
    return this.productsService.createProduct(data, user.id);
  }
}
