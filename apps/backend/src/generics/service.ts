import { PgTable, PgUpdateSetSource } from "drizzle-orm/pg-core";

import { FilterOptions } from "./filter-options";
import { GenericRepository } from "./repository";

export abstract class GenericService<
  TTable extends PgTable,
  TEntity,
  CreateDto extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
  UpdateDto extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
> {

  // hooks
  protected beforeCreate?: (data: CreateDto) => CreateDto;
  protected afterCreate?: (data: TEntity) => TEntity;

  protected beforeUpdate?: (id: string, data: UpdateDto) => UpdateDto;
  protected afterUpdate?: (id: string, data: TEntity) => TEntity;


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
    if (this.beforeCreate) data = this.beforeCreate(data);
    const res = await this.repository.create(data);
    if (this.afterCreate) return this.afterCreate(res);
    return res;
  }

  async update(id: string, data: UpdateDto): Promise<TEntity> {
    if (this.beforeUpdate) data = this.beforeUpdate(id, data);
    const res = await this.repository.update(id, data);
    if (this.afterUpdate) return this.afterUpdate(id, res);
    return res;
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}