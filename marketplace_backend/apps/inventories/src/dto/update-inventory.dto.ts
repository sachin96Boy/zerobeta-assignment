import { PartialType } from '@nestjs/swagger';
import { InventoryDto } from './inventory.dto';

export class UpdateInventoryDto extends PartialType(InventoryDto) {}
