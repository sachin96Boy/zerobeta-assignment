import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly loger: Logger;

  constructor(
    private readonly enntityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    const newItem = this.entityManager.save(entity);
    return newItem;
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.enntityRepository.findOne({ where });

    if (!entity) {
      this.loger.warn('Entity not found with where:', where);
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.enntityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.loger.warn('Entity not found with where:', where);
      throw new NotFoundException('Entity not found');
    }

    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>) {
    return this.enntityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    return this.enntityRepository.delete(where);
  }

  async findAll() {
    return this.enntityRepository.find();
  }
}
