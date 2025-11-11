import { and, asc, desc, eq, getTableColumns, isNull, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';

import * as schema from '@/db/schema';
import { DrizzleAsyncProvider } from '@/infra/database/drizzle.provider';
import { Inject } from '@nestjs/common';

import { FilterOptions } from '../../generics/filter-options';
import { ICrudRepository, RepositoryOptions } from '../../generics/repository.interface';
import { NonUniqueError } from './errors/non-unique.error';
import { TxType } from './types';

export abstract class DrizzleGenericRepository<
  TTable extends PgTable,
  TEntity extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
> implements ICrudRepository<TEntity, TCreateDto, TUpdateDto> {
  @Inject(DrizzleAsyncProvider) protected readonly db: NodePgDatabase<typeof schema>;

  private readonly columns: TTable["_"]["columns"];

  constructor(
    protected readonly table: TTable,
    protected readonly idColumn: keyof TTable["_"]["columns"] = "id" as keyof TTable["_"]["columns"]
  ) {
    this.columns = getTableColumns(table);
  }

  async create(data: TCreateDto, repoOpts?: RepositoryOptions<TxType>): Promise<TEntity> {
    return this.run(async (db) => {
      const [created] = await db.insert(this.table).values(data as unknown as TEntity).returning();
      return created as TEntity;
    }, repoOpts);
  }

  buildFilter(opts: FilterOptions<TEntity>): { filter: SQL[], order: SQL[] } {
    let filter: SQL[] = []
    if (opts.filter) {
      filter = Object.entries(opts.filter)
        .map(([key, value]) => {
          if (value === null) {
            return isNull(this.columns[key as keyof typeof this.columns]);
          }
          return eq(this.columns[key as keyof typeof this.columns], value)
        });
    }

    let order: SQL[] = []
    if (opts.order) {
      order = Object.entries(opts.order)
        .map(([key, value]) =>
          value === "ASC" ?
            asc(this.columns[key as keyof typeof this.columns]) :
            desc(this.columns[key as keyof typeof this.columns])
        );
    }
    return { filter, order };
  }

  async find(opts: FilterOptions<TEntity>, repoOpts?: RepositoryOptions<TxType>): Promise<TEntity[]> {
    return this.run(async (db) => {
      if (!opts.limit) opts.limit = 1000;
      if (!opts.offset) opts.offset = 0;

      const { filter, order } = this.buildFilter(opts);
      const results = await db.select().from(this.table as PgTable)
        .where(and(...filter))
        .limit(opts.limit)
        .offset(opts.offset)
        .orderBy(...order);

      return results as TEntity[];
    }, repoOpts);
  }

  async findUnique(opts: FilterOptions<TEntity>, repoOpts?: RepositoryOptions): Promise<TEntity | null> {
    const findResult = await this.find(opts, repoOpts);
    if (findResult.length === 0) return null;
    if (findResult.length > 1) throw new NonUniqueError("Multiple results found");
    return findResult[0];
  }

  async findFirst(opts: FilterOptions<TEntity>, repoOpts?: RepositoryOptions): Promise<TEntity | null> {
    const findResult = await this.find(opts, repoOpts);
    if (findResult.length === 0) return null;
    return findResult[0];
  }

  async findByID(id: string, repoOpts?: RepositoryOptions<TxType>): Promise<TEntity | null> {
    return this.run(async (db) => {
      const [result] = await db.select()
        .from(this.table as PgTable)
        .where(eq(this.columns.id, id))
        .limit(1);

      return (result as TEntity) || null;
    }, repoOpts);
  }

  async update(id: string, data: TUpdateDto, repoOpts?: RepositoryOptions<TxType>): Promise<void> {
    return this.run(async (db) => {
      await db.update(this.table).set(data).where(eq(this.columns.id, id));
    }, repoOpts)
  }

  async delete(id: string, repoOpts?: RepositoryOptions<TxType>): Promise<void> {
    return this.run(async (db) => {
      await db.delete(this.table).where(eq(this.columns[this.idColumn], id));
    }, repoOpts);
  }

  protected getDB(repoOpts?: RepositoryOptions<TxType>): NodePgDatabase<typeof schema> {
    return repoOpts?.tx ? repoOpts.tx : this.db;
  }

  protected run<T>(
    fn: (tx: NodePgDatabase<typeof schema>) => Promise<T>,
    repoOpts?: RepositoryOptions<TxType>,
    transaction?: boolean
  ): Promise<T> {
    if (transaction && !repoOpts?.tx) return this.db.transaction(fn);
    return fn(this.getDB(repoOpts));
  }
}