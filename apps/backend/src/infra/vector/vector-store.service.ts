import { BaseFragment, Fragments } from "@/fragment";
import { buildOptions } from "@/utils/build-options";

import { InvalidVectorFiltersError } from "./errors/invalid-vector-filters";

export type SearchOptions = {
  filters?: Record<string, string | number | boolean>;
  topK: number;
  dense?: string | { topK?: number, query: string };
  sparse?: string | { topK?: number, query: string };
  term?: string;
}
export type WithSearchOptions = (currentOpts: Partial<SearchOptions>) =>  Partial<SearchOptions>;

export abstract class VectorStore<T extends BaseFragment> {
  abstract addFragments(llmId: string, fragments: T[] | T | Fragments<T>): Promise<void>;
  abstract deleteFragments(llmId: string, fragments: T[] | T | Fragments<T>): Promise<void>;
  abstract search(llmId: string, ...options: Array<WithSearchOptions | undefined>): Promise<Fragments<T>>;

  abstract deleteByFilter(llmId: string, filter: Record<string, string | number | boolean>): Promise<void>;

  static withFilters(filters: Record<string, string | number | boolean>): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, filters: { ...currentOpts.filters, ...filters } };
    };
  }
  static withTopK(topK: number): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, topK };
    };
  }
  static withDense(dense: string | { topK?: number, query: string }): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, dense };
    };
  }
  static  withSparse(sparse: string | { topK?: number, query: string }): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, sparse };
    };
  }
  static withQuery(query: string | { topK?: number, query: string }): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, dense: query, sparse: query };
    };
  }
  static  withTerm(term: string): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, term };
    };
  }
  protected buildSearchOptions(...opts: WithSearchOptions[]): SearchOptions {
    const options = buildOptions<WithSearchOptions, SearchOptions>({ topK: 5 }, opts);
    if (!options.dense && !options.sparse) throw new InvalidVectorFiltersError("Dense or sparse query must be provided");
    return options;
  }
}
