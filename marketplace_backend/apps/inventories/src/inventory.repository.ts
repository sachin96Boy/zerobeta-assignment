import { AbstractRepository } from '@app/common';
import { Inventory } from './models/inventory.entity';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class InventoryRepository extends AbstractRepository<Inventory> {
  protected readonly loger = new Logger(InventoryRepository.name);

  constructor(
    @InjectRepository(Inventory) inventoryRepository: Repository<Inventory>,
    entityManager: EntityManager,
  ) {
    super(inventoryRepository, entityManager);
  }
}
