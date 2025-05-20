import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from '@app/common/dto/update-inventory.dto';

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  updateInventory(@Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.updateInventory(updateInventoryDto);
  }
}
