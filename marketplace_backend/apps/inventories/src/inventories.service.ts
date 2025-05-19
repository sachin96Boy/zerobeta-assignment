import { ConflictException, Injectable } from '@nestjs/common';
import { OrderItem } from 'apps/orders/src/models/order.entity';
import { InventoryDto } from './dto/inventory.dto';
import { InventoryRepository } from './inventory.repository';
import { Inventory } from './models/inventory.entity';

@Injectable()
export class InventoriesService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async createInventory(data: InventoryDto) {
    // check if inventory is available
    const availableInventory = await this.inventoryRepository.findOne({
      productId: data.productId,
    });

    if (availableInventory) {
      throw new ConflictException('inventory item already created');
    }
    const newInventory = new Inventory({
      ...data,
    });

    return await this.inventoryRepository.create(newInventory);
  }

  async updateInventoriesAfterOrder(
    data: { id: string; items: OrderItem[] }[],
  ) {
    const availableInventories = await this.inventoryRepository.findAll();
    for (const itemObj of data) {
      const orderItems = itemObj.items;

      const updted = availableInventories.map((inventory) => {
        const selectedOrderItem = orderItems.find(
          (oi) => oi.productId == inventory.productId,
        );

        if (selectedOrderItem) {
          const updatedCount = inventory.quantity - selectedOrderItem.quantity;
          inventory.quantity = updatedCount;
        }

        return inventory;
      });
      for (const inv of updted) {
        await this.inventoryRepository.findOneAndUpdate({ id: inv.id }, inv);
      }
    }
  }
}
