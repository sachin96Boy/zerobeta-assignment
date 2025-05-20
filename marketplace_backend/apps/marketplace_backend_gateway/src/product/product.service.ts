import { PRODUCT_SERVICE } from '@app/common';
import {
  Body,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { catchError } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientKafkaProxy,
  ) {}

  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productClient.send('create.product', createProductDto).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
}
