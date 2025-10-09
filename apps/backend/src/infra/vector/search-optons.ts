export type SearchByTermOptions = {
  limit?: number;
}

export type SearchOptions = {
  filters?: Record<string, string | number | boolean>;
  topK: number;
  dense?: number[] | { vector: number[], topK?: number };
  sparse?: string | { topK?: number, query: string };
}

export type WithSearchOptions = (currentOpts: Partial<SearchOptions>) =>  Partial<SearchOptions>;

export const withKnowledgeId = (knowledgeId: string): WithSearchOptions => {
  return (currentOpts: Partial<SearchOptions>) => {
    return { ...currentOpts, filters: { ...currentOpts.filters, knowledgeId } };
  }
}
export const withFilters = (filters: Record<string, string>): WithSearchOptions => {
  return (currentOpts: Partial<SearchOptions>) => {
    return { ...currentOpts, filters: { ...currentOpts.filters, ...filters } };
  }
}

export const withTopK = (topK: number): WithSearchOptions => {
  return (currentOpts: Partial<SearchOptions>) => {
    return { ...currentOpts, topK };
  }
}
export const withDense = (dense: number[] | { vector: number[], topK?: number }): WithSearchOptions => {
  return (currentOpts: Partial<SearchOptions>) => {
    return { ...currentOpts, dense };
  }
}
export const withSparse = (sparse: string | { topK?: number, query: string }): WithSearchOptions => {
  return (currentOpts: Partial<SearchOptions>) => {
    return { ...currentOpts, sparse };
  }
}

export const buildSearchOptions = (...opts: WithSearchOptions[]) => {
  let searchOpts: SearchOptions = { topK: 5 };
  for (const opt of opts) {
    searchOpts = { ...searchOpts, ...opt(searchOpts) };
  }

  if (!searchOpts.dense || !searchOpts.sparse) throw new Error("dense or sparse is required");

  return searchOpts;
}