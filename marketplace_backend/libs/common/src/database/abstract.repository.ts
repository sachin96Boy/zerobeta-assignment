import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly loger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    const newety = this.entityRepository.create(entity);
    const newItem = await this.entityManager.save(newety);
    return newItem;
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    const entity = await this.entityRepository.findOne({ where });

    if (!entity) {
      this.loger.warn('Entity not found with where:', where);
      // throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.entityRepository.update(
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
    return this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    return this.entityRepository.delete(where);
  }

  async findAll() {
    return this.entityRepository.find();
  }
}
