import { FilterOptions } from './filter-options';
import { HttpContext } from './http-context';

export type ServiceOptions<TxType = any> = {
  http?: HttpContext;
  tx?: TxType;
}

export interface ICrudService<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> {
  find(filterOptions: FilterOptions<TEntity>, opts?: ServiceOptions): Promise<TEntity[]>
  findByID(id: string, opts?: ServiceOptions): Promise<TEntity | null>
  create(input: TCreateDto, opts?: ServiceOptions): Promise<TEntity>
  update(id: string, input: TUpdateDto, opts?: ServiceOptions): Promise<void>
  delete(id: string, opts?: ServiceOptions): Promise<void>
}