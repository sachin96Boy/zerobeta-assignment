import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderByBuyerId } from 'apps/orders/src/dto/orderByBuyerId.dto';
import { CreateOrderDto } from 'apps/orders/src/dto/orderItem.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post()
  findAll(@Body() orderbyBuyerId: OrderByBuyerId) {
    return this.orderService.findAll(orderbyBuyerId);
  }
}
