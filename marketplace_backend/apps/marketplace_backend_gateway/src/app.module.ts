import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AUTH_SERVICE,
  DatabaseModule,
  LoggerModule,
  ORDER_SERVICE,
  PRODUCT_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientKafkaProxy,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

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
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
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
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
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
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            consumer: {
              groupId: 'orders-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafkaProxy,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('login_user');
    await this.authClient.connect();
  }
}
