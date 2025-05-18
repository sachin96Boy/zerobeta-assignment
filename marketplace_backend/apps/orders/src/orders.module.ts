import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Order, OrderItem } from './models/order.entity';
import { OrderItemRepository, OrderRepository } from './order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DatabaseModule.forFeature([Order, OrderItem]),
    LoggerModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, OrderItemRepository],
})
export class OrdersModule {}
