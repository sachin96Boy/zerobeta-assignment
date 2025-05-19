import { Test, TestingModule } from '@nestjs/testing';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';

describe('InventoriesController', () => {
  let inventoriesController: InventoriesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InventoriesController],
      providers: [InventoriesService],
    }).compile();

    inventoriesController = app.get<InventoriesController>(
      InventoriesController,
    );
  });

  it('should be defined', () => {
    expect(inventoriesController).toBeDefined();
  });
});
