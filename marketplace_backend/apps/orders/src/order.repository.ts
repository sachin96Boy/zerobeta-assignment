import { AbstractRepository } from '@app/common';
import { Order, OrderItem } from './models/order.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
  protected readonly loger = new Logger(OrderRepository.name);

  constructor(
    @InjectRepository(Order) orderRepository: Repository<Order>,
    entityManager: EntityManager,
  ) {
    super(orderRepository, entityManager);
  }
}
@Injectable()
export class OrderItemRepository extends AbstractRepository<OrderItem> {
  protected readonly loger = new Logger(OrderItemRepository.name);

  constructor(
    @InjectRepository(OrderItem) orderItemRepository: Repository<OrderItem>,
    entityManager: EntityManager,
  ) {
    super(orderItemRepository, entityManager);
  }
}
