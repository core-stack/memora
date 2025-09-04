import { FilterOptions } from "./filter-options";

export interface IService<TEntity> {
  find(opts: FilterOptions<TEntity>): Promise<TEntity[]>
  findByID(id: string): Promise<TEntity | null>
  create(input: Partial<TEntity>): Promise<TEntity>
  update(id: string, input: Partial<TEntity>): Promise<void>
  delete(id: string): Promise<void>
}