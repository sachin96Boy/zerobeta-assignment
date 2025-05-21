import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductWithUser } from './dto/create-prod-with-ser.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('create.product')
  async createProduct(@Payload() data: CreateProductWithUser) {
    console.log(data);
    return this.productsService.createProduct(data, data.id);
  }
}
