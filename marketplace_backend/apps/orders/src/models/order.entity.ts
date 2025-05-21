import { AbstractEntity } from '@app/common';
import { OrderStatus } from '../enum/orderstatus.enum';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Order extends AbstractEntity {
  @Column({ unique: true })
  orderRefference: string;

  @Column()
  buyerId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}

@Entity()
export class OrderItem extends AbstractEntity {
  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
