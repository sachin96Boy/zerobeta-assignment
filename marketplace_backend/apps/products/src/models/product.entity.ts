import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Product extends AbstractEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column()
  sellerId: string;
}
