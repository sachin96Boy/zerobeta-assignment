import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { currentUser, JwtAuthGuard } from '@app/common';
import { User } from '@app/common/models';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('product')
  @UsePipes(new ValidationPipe())
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @currentUser() user: User,
  ) {
    return this.productService.createProduct(createProductDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProducts() {
    return this.productService.getAllProducts();
  }
}
