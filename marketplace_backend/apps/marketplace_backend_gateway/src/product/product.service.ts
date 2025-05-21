import { PRODUCT_SERVICE } from '@app/common';
import { User } from '@app/common/models';
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

  createProduct(createProductDto: CreateProductDto, user: User) {
    return this.productClient
      .send('create.product', { ...createProductDto, id: user.id })
      .pipe(
        catchError((err) => {
          throw new UnprocessableEntityException(err);
        }),
      );
  }
  getAllProducts() {
    return this.productClient.send('get.all.product', {}).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
}
