import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AUTH_SERVICE,
  DatabaseModule,
  INVENTORY_SERVICE,
  LoggerModule,
} from '@app/common';
import { Order, OrderItem } from './models/order.entity';
import { OrderItemRepository, OrderRepository } from './order.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    DatabaseModule.forFeature([Order, OrderItem]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: INVENTORY_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'kafka:9092',
              ],
            },
            consumer: {
              groupId: 'inventories-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'kafka:9092',
              ],
            },
            consumer: {
              groupId: 'auth-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, OrderItemRepository],
})
export class OrdersModule {}
