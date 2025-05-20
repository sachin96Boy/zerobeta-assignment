import { IsString } from 'class-validator';

export class OrderByBuyerId {
  @IsString()
  buyerId: string;
}
