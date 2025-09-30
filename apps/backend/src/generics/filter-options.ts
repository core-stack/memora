type PartialNullable<T> = { [P in keyof T]?: T[P] | null | undefined };   
export type FilterOptions<TEntity> = {
  limit?: number;
  offset?: number;
  filter?: PartialNullable<TEntity>;
  order?: Partial<Record<keyof TEntity, 'ASC' | 'DESC'>>;
}