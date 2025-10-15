import { BaseFragment, Fragments } from '@/fragment';

export type SearchOptions = {
  filters?: Record<string, string | number | boolean>;
  topK: number;
  dense?: string | { topK?: number, query: string };
  sparse?: string | { topK?: number, query: string };
  term?: string;
}
export type WithSearchOptions = (currentOpts: Partial<SearchOptions>) =>  Partial<SearchOptions>;

export abstract class VectorStore<T extends BaseFragment> {
  abstract addFragments(fragments: T[] | T | Fragments<T>): Promise<void>;
  abstract deleteFragments(fragments: T[] | T | Fragments<T>): Promise<void>;
  abstract search(...options: Array<WithSearchOptions | undefined>): Promise<Fragments<T>>;

  static withFilters(filters: Record<string, string | number | boolean>): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, filters: { ...currentOpts.filters, ...filters } };
    }
  }
  static withTopK(topK: number): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, topK };
    }
  }
  static withDense(dense: string | { topK?: number, query: string }): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, dense };
    }
  }
  static  withSparse(sparse: string | { topK?: number, query: string }): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, sparse };
    }
  }
  static withQuery(query: string | { topK?: number, query: string }): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, dense: query, sparse: query };
    }
  }
  static  withTerm(term: string): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, term };
    }
  }
  protected buildSearchOptions(...opts: WithSearchOptions[]): SearchOptions {
    let searchOpts: SearchOptions = { topK: 5 };
    for (const opt of opts) {
      searchOpts = { ...searchOpts, ...opt(searchOpts) };
    }
  
    if (!searchOpts.dense || !searchOpts.sparse) throw new Error("dense or sparse is required");
  
    return searchOpts;
  }
  

}