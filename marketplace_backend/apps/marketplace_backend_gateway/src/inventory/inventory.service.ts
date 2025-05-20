import { INVENTORY_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { UpdateInventoryDto } from 'apps/inventories/src/dto/update-inventory.dto';
import { catchError } from 'rxjs';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(INVENTORY_SERVICE)
    private readonly inventoryClient: ClientKafkaProxy,
  ) {}

  updateInventory(updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryClient
      .emit('inventory.update.request', updateInventoryDto)
      .pipe(
        catchError((err) => {
          throw new UnprocessableEntityException(err);
        }),
      );
  }
}
