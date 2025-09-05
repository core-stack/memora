import { FilterOptions } from "./filter-options";

export interface ICrudRepository<TEntity> {

  find(opts: FilterOptions<TEntity>): Promise<TEntity[]>;
  findByID(id: string): Promise<TEntity | null>;

  create(data: Partial<TEntity>): Promise<TEntity>;

  update(id: string, data: Partial<TEntity>): Promise<void>;

  delete(id: string): Promise<void>;
}