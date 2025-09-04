import { and, asc, desc, eq, getTableColumns, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';

import * as schema from '@/db/schema';
import { DrizzleAsyncProvider } from '@/services/repository/drizzle.provider';
import { Inject } from '@nestjs/common';

import { FilterOptions } from './filter-options';

export abstract class GenericRepository<
  TTable extends PgTable,
  TEntity,
  CreateDto extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
  UpdateDto extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
> {
  @Inject(DrizzleAsyncProvider) protected readonly db: NodePgDatabase<typeof schema>;
  private readonly columns: TTable["_"]["columns"];

  // hooks
  protected beforeCreate?: (data: CreateDto) => CreateDto;
  protected afterCreate?: (data: TEntity) => TEntity;

  protected beforeUpdate?: (id: string, data: UpdateDto) => UpdateDto;
  protected afterUpdate?: (id: string, data: TEntity) => TEntity;

  constructor(protected readonly table: TTable) {
    this.columns = getTableColumns(table);
  }

  async create(data: CreateDto): Promise<TEntity> {
    if (this.beforeCreate) data = this.beforeCreate(data);
    const [created] = await this.db.insert(this.table).values(data).returning();

    if (this.afterCreate) return this.afterCreate(created as TEntity);
    return created as TEntity;
  }

  async find(opts: FilterOptions<TEntity>): Promise<TEntity[]> {
    if (!opts.limit) opts.limit = 1000;
    if (!opts.offset) opts.offset = 0;

    let filters: SQL[] = []
    if (opts.filter) {
      filters = Object.entries(opts.filter)
        .map(([key, value]) => eq(this.columns[key as keyof typeof this.columns], value));
    }

    let order: SQL[] = []
    if (opts.order) {
      order = Object.entries(opts.order)
        .map(([key, value]) => value === "ASC" ? asc(this.columns[key as keyof typeof this.columns]) : desc(this.columns[key as keyof typeof this.columns]));
    }

    const results = await this.db.select().from(this.table as PgTable)
      .where(and(...filters))
      .limit(opts.limit)
      .offset(opts.offset)
      .orderBy(...order);

    return results as TEntity[];
  }

  async findByID(id: string): Promise<TEntity | null> {
    const [result] = await this.db
      .select()
      .from(this.table as PgTable)
      .where(eq(this.columns.id, id))
      .limit(1);

    return (result as TEntity) || null;
  }

  async update(id: string, data: UpdateDto): Promise<TEntity> {
    if (this.beforeUpdate) data = this.beforeUpdate(id, data);
    const updated = await this.db
      .update(this.table)
      .set(data)
      .where(eq(this.columns.id, id))
      .returning();

    if (this.afterUpdate) return this.afterUpdate(id, updated as TEntity);
    return updated as TEntity;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.table).where(eq(this.columns.id, id));
  }
}