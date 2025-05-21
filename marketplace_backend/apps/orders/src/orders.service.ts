import { INVENTORY_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/orderItem.entity';
import { OrderItemRepository, OrderRepository } from './order.repository';

import { catchError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { OrderByBuyerId } from '../../../libs/common/src/dto/orderByBuyerId.dto';
import { removOrderDto } from './dto/removeOrder.dto';
import { OrderStatus } from './enum/orderstatus.enum';
import { OrderItem } from './models/order.entity';

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

    const savedOrder = await this.orderRepository.create({
      orderRefference: orderRef,
      buyerId: data.buyerId,
      totalAmount: totalAmount,
      status: OrderStatus.PENDING,
    });

    for (const item of data.items) {
      await this.orderItemRepositoy.create({
        order: savedOrder,
        productId: item.productId,
        price: item.unitPrice,
        quantity: item.quantity,
      });
    }

    return savedOrder;
  }

  async ordersByBuyer(data: OrderByBuyerId) {
    const ordersList = await this.orderRepository.find({
      buyerId: data.buyerId,
    });

    return ordersList;
  }

  async removeOrder(data: removOrderDto) {
    const order = await this.orderRepository.findOne({
      id: data.orderId,
      buyerId: data.buyerId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = OrderStatus.CANCELLED;

    const updatedOrder = await this.orderRepository.findOneAndUpdate(
      {
        id: order.id,
      },
      order,
    );

    return updatedOrder;
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
    this.inventoryClient
      .emit('update.inventory.order', { ...orderItemList })
      .pipe(
        catchError((err) => {
          throw new UnprocessableEntityException(err);
        }),
      );
  }
}
