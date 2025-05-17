import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  const connfigService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: connfigService.get<number>('PORT') ?? 3003,
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
}
bootstrap();
