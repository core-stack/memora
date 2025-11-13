import { DataSource, EntityManager, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

import { Inject, Logger } from '@nestjs/common';

import { FilterOptions } from './filter-options';
import { HTTPContext } from './http-context';

export abstract class Service<
  TEntity extends ObjectLiteral,
  TCreateDto extends TEntity = TEntity,
  TUpdateDto extends TEntity = TEntity
> {
  @Inject() protected readonly context: HTTPContext;
  @Inject() protected readonly dataSource: DataSource;

  abstract readonly entity: new (...args: any) => TEntity;
  abstract readonly logger: Logger;
  readonly idField: keyof TEntity = "id";


  repository(manager?: EntityManager): Repository<TEntity> {
    return manager ? manager.getRepository(this.entity) : this.dataSource.getRepository(this.entity);
  }

  async transaction<T>(callback: (manager: EntityManager) => Promise<T>, manager?: EntityManager): Promise<T> {
    if (manager) return await callback(manager);
    return await this.dataSource.transaction(callback);
  }

  async find(filterOptions: FilterOptions<TEntity>, manager?: EntityManager): Promise<TEntity[]> {
    return await this.repository(manager).find(filterOptions);
  }

  async findUnique(filterOptions: FilterOptions<TEntity>, manager?: EntityManager): Promise<TEntity | null> {
    return await this.repository(manager).findOneOrFail(filterOptions);
  }

  async findFirst(filterOptions: FilterOptions<TEntity>, manager?: EntityManager): Promise<TEntity | null> {
    filterOptions.take = 1;
    filterOptions.skip = 0;

    const data = await this.repository(manager).find(filterOptions);

    return data.length === 0 ? null : data[0];
  }

  async findByID(id: string, manager?: EntityManager): Promise<TEntity | null> {
    return await this.repository(manager).findOneBy({ [this.idField]: id } as FindOptionsWhere<TEntity>);
  }

  async create(input: TCreateDto, manager?: EntityManager): Promise<TEntity> {
    return await this.repository(manager).save(input);
  }

  async update(id: string, input: TUpdateDto, manager?: EntityManager): Promise<void> {
    await this.repository(manager).update(id, input);
  }

  async delete(id: string, manager?: EntityManager): Promise<void> {
    await this.repository(manager).delete(id);
  }
}
