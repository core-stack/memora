export type FilterOptions<TEntity> = {
  limit?: number;
  offset?: number;
  filter?: Partial<TEntity>;
  order?: Partial<Record<keyof TEntity, 'ASC' | 'DESC'>>;
}