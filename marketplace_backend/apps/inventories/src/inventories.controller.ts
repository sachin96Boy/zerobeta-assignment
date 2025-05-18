import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InventoryDto } from './dto/inventory.dto';
import { InventoriesService } from './inventories.service';

@Controller()
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @EventPattern('initial_product_inventory')
  async createInventory(@Payload() data: InventoryDto) {
    return this.inventoriesService.createInventory(data);
  }
}
