import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderByBuyerId } from '@app/common/dto/orderByBuyerId.dto';
import { CreateOrderDto } from 'apps/orders/src/dto/orderItem.entity';
import { OrderService } from './order.service';
import { removOrderDto } from 'apps/orders/src/dto/removeOrder.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  findAll(@Body() orderbyBuyerId: OrderByBuyerId) {
    return this.orderService.findAll(orderbyBuyerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove')
  remove(@Body() removeOrderDto: removOrderDto) {
    return this.orderService.removeOrder(removeOrderDto);
  }
}
