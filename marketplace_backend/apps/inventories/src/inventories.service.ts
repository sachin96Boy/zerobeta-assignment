import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoriesService {
  getHello(): string {
    return 'Hello World!';
  }
}
