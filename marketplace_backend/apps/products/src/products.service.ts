import { INVENTORY_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(INVENTORY_SERVICE)
    private readonly inventoryClient: ClientKafkaProxy,
  ) {}

  async createProduct(data: CreateProductDto, sellerId: string) {
    // check if product already exists

    const existProductbyCode = await this.productRepository.findOne({
      code: data.code,
    });

    if (existProductbyCode) {
      throw new Error('Product is already available');
    }

    const product = await this.productRepository.create({
      ...data,
      sellerId,
    });

    const invData = {
      productId: product.id,
      price: data.price,
      quantity: 0,
    };

    this.inventoryClient.emit('initial.product.inventory', { ...invData }).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );

    return { ...product };
  }
  async getAllProducts() {
    return this.productRepository.findAll();
  }
}
