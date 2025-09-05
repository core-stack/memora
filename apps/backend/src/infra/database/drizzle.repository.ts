import * as schema from "@/db/schema";
import { DrizzleAsyncProvider } from "@/infra/database/drizzle.provider";
import { Inject } from "@nestjs/common";
import { and, asc, desc, eq, getTableColumns, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgTable, PgUpdateSetSource } from "drizzle-orm/pg-core";

import { FilterOptions } from "../../generics/filter-options";
import { ICrudRepository } from "../../generics/repository.interface";

export abstract class DrizzleGenericRepository<
  TTable extends PgTable,
  TEntity extends PgUpdateSetSource<TTable> = PgUpdateSetSource<TTable>,
> implements ICrudRepository<TEntity> {
  @Inject(DrizzleAsyncProvider) protected readonly db: NodePgDatabase<typeof schema>;
  private readonly columns: TTable["_"]["columns"];

  constructor(protected readonly table: TTable) {
    this.columns = getTableColumns(table);
  }

  async create(data: Partial<TEntity>): Promise<TEntity> {
    const [created] = await this.db.insert(this.table).values(data as TEntity).returning();
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

  async update(id: string, data: Partial<TEntity>): Promise<void> {
    this.db.update(this.table).set(data).where(eq(this.columns.id, id))
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.table).where(eq(this.columns.id, id));
  }
}