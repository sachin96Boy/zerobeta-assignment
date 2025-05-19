import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderItemRepository, OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/orderItem.entity';
import { INVENTORY_SERVICE } from '@app/common';
import { ClientKafkaProxy } from '@nestjs/microservices';

import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem } from './models/order.entity';
import { OrderStatus } from './enum/orderstatus.enum';
import { catchError } from 'rxjs';
import { OrderByBuyerId } from './dto/orderByBuyerId.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepositoy: OrderItemRepository,
    @Inject(INVENTORY_SERVICE)
    private readonly inventoryClient: ClientKafkaProxy,
  ) {}

  async createOrder(data: CreateOrderDto) {
    const orderRef = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    const totalAmount = data.items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    );

    const newOrder = new Order({
      orderRefference: orderRef,
      buyerId: data.buyerId,
      totalAmount: totalAmount,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.create(newOrder);

    const orderItems = data.items.map((item) => {
      const orderItem = new OrderItem({
        order: savedOrder,
        productId: item.productId,
        price: item.unitPrice,
        quantity: item.quantity,
      });

      return orderItem;
    });

    for (const orderItem of orderItems) {
      await this.orderItemRepositoy.create(orderItem);
    }

    return savedOrder;
  }

  async ordersByBuyer(data: OrderByBuyerId) {
    const ordersList = await this.orderRepository.find({
      buyerId: data.buyerId,
    });

    return ordersList;
  }

  async handleUncompletedOrders() {
    const unfinishedOrdrs = await this.orderRepository.find({
      status: OrderStatus.PENDING,
    });

    const orderItemList: { id: string; items: OrderItem[] }[] = [];

    for (const order of unfinishedOrdrs) {
      order.status = OrderStatus.COMPLETED;

      orderItemList.push({
        id: order.id,
        items: order.items,
      });

      await this.orderRepository.findOneAndUpdate({ id: order.id }, order);
    }

    // update inventory
    this.inventoryClient.emit('update.inventory.order', orderItemList).pipe(
      catchError((err) => {
        throw new UnprocessableEntityException(err);
      }),
    );
  }
}
