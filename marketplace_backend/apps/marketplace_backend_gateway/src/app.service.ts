import {
  AUTH_SERVICE,
  CreateUserDto,
  LoginDto,
  ORDER_SERVICE,
  PRODUCT_SERVICE,
} from '@app/common';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { catchError } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafkaProxy,
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientKafkaProxy,
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientKafkaProxy,
  ) {}

  login(loginDto: LoginDto) {
    return this.authClient.send('login.user', loginDto).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }

  register(createUserDto: CreateUserDto) {
    return this.authClient.send('register.user', createUserDto).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }

  createProduct(createProductDto: CreateProductDto) {
    return this.productClient.send('create.product', createProductDto).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
}
