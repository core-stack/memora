

import { ContextProvider } from '@/infra/context/context.provider';
import { Inject } from '@nestjs/common';

import { FilterOptions } from './filter-options';
import { ICrudRepository } from './repository.interface';
import { ICrudService } from './service.interface';

export abstract class CrudService<TEntity> implements ICrudService<TEntity> {
  @Inject() protected readonly ctxProvider: ContextProvider;
  constructor(
    protected readonly repository: ICrudRepository<TEntity>,
  ) { }

  async find(opts: FilterOptions<TEntity>): Promise<TEntity[]> {
    let res = await this.repository.find(opts);
    return res;
  }

  async findByID(id: string): Promise<TEntity | null> {
    return this.repository.findByID(id);
  }

  async create(input: Partial<TEntity>): Promise<TEntity> {
    let res = await this.repository.create(input);
    return res;
  }

  async update(id: string, input: Partial<TEntity>): Promise<void> {
    await this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}