import { FilterOptions } from './filter-options';
import { HttpContext } from './http-context';

export interface ICrudService<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> {
  find(opts: FilterOptions<TEntity>, ctx: HttpContext): Promise<TEntity[]>
  findByID(id: string, ctx: HttpContext): Promise<TEntity | null>
  create(input: TCreateDto, ctx: HttpContext): Promise<TEntity>
  update(id: string, input: TUpdateDto, ctx: HttpContext): Promise<void>
  delete(id: string, ctx: HttpContext): Promise<void>
}