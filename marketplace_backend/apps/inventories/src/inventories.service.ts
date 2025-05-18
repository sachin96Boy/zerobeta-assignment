import { Injectable, ConflictException } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { InventoryDto } from './dto/inventory.dto';
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
}
