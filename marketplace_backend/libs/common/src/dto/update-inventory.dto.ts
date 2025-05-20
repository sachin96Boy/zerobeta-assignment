import { PartialType } from '@nestjs/swagger';
import { InventoryDto } from '../../../../apps/inventories/src/dto/inventory.dto';

export class UpdateInventoryDto extends PartialType(InventoryDto) {}
