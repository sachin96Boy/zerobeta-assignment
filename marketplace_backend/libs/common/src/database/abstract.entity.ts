import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
