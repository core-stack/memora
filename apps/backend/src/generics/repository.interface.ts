import { FilterOptions } from './filter-options';

export interface ICrudRepository<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> {
  find(opts: FilterOptions<TEntity>): Promise<TEntity[]>;
  findByID(id: string): Promise<TEntity | null>;

  create(data: TCreateDto): Promise<TEntity>;

  update(id: string, data: TUpdateDto): Promise<void>;

  delete(id: string): Promise<void>;
}