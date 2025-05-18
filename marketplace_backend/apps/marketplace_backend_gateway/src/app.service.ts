import {
  AUTH_SERVICE,
  LoginDto,
  ORDER_SERVICE,
  PRODUCT_SERVICE,
} from '@app/common';
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafkaProxy,
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientKafkaProxy,
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientKafkaProxy,
  ) {}

  login(loginDto: LoginDto) {
    return this.authClient.send('login_user', loginDto).pipe(
      catchError((err) => {
        throw new NotAcceptableException(err);
      }),
    );
  }
}
