import { Context } from "./context";
import { FilterOptions } from "./filter-options";

export interface ICrudService<TEntity> {
  find(opts: FilterOptions<TEntity>, ctx: Context): Promise<TEntity[]>
  findByID(id: string, ctx: Context): Promise<TEntity | null>
  create(input: Partial<TEntity>, ctx: Context): Promise<TEntity>
  update(id: string, input: Partial<TEntity>, ctx: Context): Promise<void>
  delete(id: string, ctx: Context): Promise<void>
}