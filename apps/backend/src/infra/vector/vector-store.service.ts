import { Fragment, Fragments } from '@/fragment';

import { SearchByTermOptions, WithSearchOptions } from './search-optons';

export abstract class VectorStore {
  abstract addFragments(fragments: Fragment[] | Fragment | Fragments): Promise<void>;
  abstract deleteFragments(fragments: Fragment[] | Fragment | Fragments): Promise<void>;
  abstract search(...options: WithSearchOptions[]): Promise<Fragments>;
  abstract searchByTerm(
    knowledgeId: string,
    term: string,
    opts?: SearchByTermOptions
  ): Promise<Fragments>;
}