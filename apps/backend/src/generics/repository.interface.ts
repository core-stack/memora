import { FilterOptions } from './filter-options';
export type RepositoryOptions<T = any> = {
  tx?: T
}
export interface ICrudRepository<TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>> {
  find(opts: FilterOptions<TEntity>, repoOpts?: RepositoryOptions): Promise<TEntity[]>;
  findByID(id: string, repoOpts?: RepositoryOptions): Promise<TEntity | null>;

  create(data: TCreateDto, repoOpts?: RepositoryOptions): Promise<TEntity>;

  update(id: string, data: TUpdateDto, repoOpts?: RepositoryOptions): Promise<void>;

  delete(id: string, repoOpts?: RepositoryOptions): Promise<void>;
}