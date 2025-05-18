import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Inventory } from './models/inventory.entity';
import { InventoryRepository } from './inventory.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DatabaseModule.forFeature([Inventory]),
    LoggerModule,
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService, InventoryRepository],
})
export class InventoriesModule {}
