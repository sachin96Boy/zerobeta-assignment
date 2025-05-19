import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/orderItem.entity';
import { OrdersService } from './orders.service';
import { OrderByBuyerId } from './dto/orderByBuyerId.dto';
import { Cron } from '@nestjs/schedule';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('order.create.request')
  @UsePipes(new ValidationPipe())
  async handleOrderCreation(@Payload() data: CreateOrderDto) {
    return this.ordersService.createOrder(data);
  }
  @MessagePattern('order.by.buyer')
  @UsePipes(new ValidationPipe())
  async orderBybuyer(@Payload() data: OrderByBuyerId) {
    return this.ordersService.ordersByBuyer(data);
  }

  @Cron('*/10 * * * *')
  handleUnCompletedOrders() {
    return this.ordersService.handleUncompletedOrders();
  }
}
