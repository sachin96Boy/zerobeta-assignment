import { ORDER_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { OrderByBuyerId } from '@app/common/dto/orderByBuyerId.dto';
import { CreateOrderDto } from 'apps/orders/src/dto/orderItem.entity';
import { removOrderDto } from 'apps/orders/src/dto/removeOrder.dto';
import { catchError } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientKafkaProxy,
  ) {}

  create(createOrderdto: CreateOrderDto) {
    return this.orderClient
      .send('order.create.request', { ...createOrderdto })
      .pipe(
        catchError((err) => {
          throw new UnprocessableEntityException(err);
        }),
      );
  }

  findAll(orderbyBuyerId: OrderByBuyerId) {
    return this.orderClient.send('order.by.buyer', { ...orderbyBuyerId }).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
  removeOrder(removeOrderDto: removOrderDto) {
    return this.orderClient.emit('remove.order', { ...removeOrderDto }).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
}
