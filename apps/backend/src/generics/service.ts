import { InferSelectModel } from 'drizzle-orm';
import { PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';

import { FilterOptions } from './filter-options';
import { GenericRepository } from './repository';

export abstract class GenericService<
  TTable extends PgTable = PgTable,
  TEntity = InferSelectModel<TTable>,
  CreateDto extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
  UpdateDto extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
> {
  constructor(
    protected readonly repository: GenericRepository<TTable, TEntity, CreateDto, UpdateDto>
  ) { }

  async findMany(opts: FilterOptions): Promise<TEntity[]> {
    return this.repository.findMany(opts);
  }

  async findByID(id: string): Promise<TEntity | null> {
    return this.repository.findByID(id);
  }

  async create(data: CreateDto): Promise<TEntity> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateDto): Promise<TEntity> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}