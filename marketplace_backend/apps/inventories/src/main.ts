import { NestFactory } from '@nestjs/core';
import { InventoriesModule } from './inventories.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(InventoriesModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('PORT') ?? 3004,
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
}
bootstrap();
