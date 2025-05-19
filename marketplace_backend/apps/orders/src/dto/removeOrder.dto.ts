import { IsString } from 'class-validator';

export class removOrderDto {
  @IsString()
  orderId: string;

  @IsString()
  buyerId: string;
}
