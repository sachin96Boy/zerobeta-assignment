import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderItem } from 'apps/orders/src/models/order.entity';
import { InventoryDto } from './dto/inventory.dto';
import { InventoriesService } from './inventories.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller()
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @EventPattern('initial.product.inventory')
  async createInventory(@Payload() data: InventoryDto) {
    return this.inventoriesService.createInventory(data);
  }
  @EventPattern('inventory.update.request')
  async updateInentory(@Payload() data: UpdateInventoryDto) {
    return this.inventoriesService.updateInventories(data);
  }
  @EventPattern('update.inventory.order')
  async createInventoryAfterOrder(
    @Payload() data: { id: string; items: OrderItem[] }[],
  ) {
    return this.inventoriesService.updateInventoriesAfterOrder(data);
  }
}
