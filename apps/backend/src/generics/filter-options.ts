export type FilterOptions<TEntity> = {
  limit?: number;
  offset?: number;
  filter?: {
    [P in keyof TEntity]?: TEntity[P] | Array<TEntity[P]> | null | undefined
  };
  order?: Partial<Record<keyof TEntity, 'ASC' | 'DESC'>>;
  include?: Array<keyof TEntity>;
}