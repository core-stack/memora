import { Fragment, Fragments } from "@/fragment";

export type SearchByTermOptions = {
  limit?: number;
}
export type SearchByEmbeddingOptions = {
  filters?: Record<string, string>;
}

export abstract class VectorStore {
  abstract addFragments(fragments: Fragment[] | Fragment | Fragments): Promise<void>;
  abstract deleteFragments(fragments: Fragment[] | Fragment | Fragments): Promise<void>;
  abstract searchByEmbeddings(
    knowledgeId: string,
    queryEmbedding: number[],
    opts?: SearchByEmbeddingOptions
  ): Promise<Fragments>;
  abstract searchByTerm(
    knowledgeId: string,
    term: string,
    opts?: SearchByTermOptions
  ): Promise<Fragments>;
}