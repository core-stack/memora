export type FilterOptions = {
  limit?: number;
  offset?: number;
  filter?: Record<string, unknown>;
  order?: Record<string, 'ASC' | 'DESC'>;
}