import {
  AUTH_SERVICE,
  DatabaseModule,
  INVENTORY_SERVICE,
  LoggerModule,
  ORDER_SERVICE,
  PRODUCT_SERVICE,
} from '@app/common';
import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientKafkaProxy,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { InventoryService } from './inventory/inventory.service';
import { InventoryController } from './inventory/inventory.controller';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
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
      {
        name: PRODUCT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'kafka:9092',
              ],
            },
            consumer: {
              groupId: 'products-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: ORDER_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'kafka:9092',
              ],
            },
            consumer: {
              groupId: 'orders-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
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
    ]),
  ],
  controllers: [
    AuthController,
    OrderController,
    ProductController,
    InventoryController,
  ],
  providers: [AuthService, OrderService, ProductService, InventoryService],
})
export class AppModule {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafkaProxy,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('login.user');
    this.authClient.subscribeToResponseOf('register.user');
    await this.authClient.connect();
  }
}
