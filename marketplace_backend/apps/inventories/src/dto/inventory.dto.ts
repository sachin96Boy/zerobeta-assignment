import { IsInt, IsNumber, IsString } from 'class-validator';

export class InventoryDto {
  @IsString()
  productId: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}
