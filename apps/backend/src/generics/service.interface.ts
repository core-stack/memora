import { FilterOptions } from "./filter-options";
import { HttpContext } from "./http-context";

export interface ICrudService<TEntity> {
  find(opts: FilterOptions<TEntity>, ctx: HttpContext): Promise<TEntity[]>
  findByID(id: string, ctx: HttpContext): Promise<TEntity | null>
  create(input: Partial<TEntity>, ctx: HttpContext): Promise<TEntity>
  update(id: string, input: Partial<TEntity>, ctx: HttpContext): Promise<void>
  delete(id: string, ctx: HttpContext): Promise<void>
}