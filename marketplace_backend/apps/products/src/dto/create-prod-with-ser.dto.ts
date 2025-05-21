import { IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class CreateProductWithUser extends CreateProductDto {
  @IsString()
  id: string;
}
