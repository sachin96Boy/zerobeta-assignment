import { NestFactory } from '@nestjs/core';
import { InventoriesModule } from './inventories.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoriesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
