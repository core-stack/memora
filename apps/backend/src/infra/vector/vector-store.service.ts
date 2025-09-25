import { Chunk, Chunks } from '@/generics/chunk';

export type SearchByTermOptions = {
  limit?: number;
}
export type SearchByEmbeddingOptions = {
  filters?: Record<string, string>;
}

export abstract class VectorStore {
  abstract addChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void>;
  abstract deleteChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void>;
  abstract searchByEmbeddings(
    knowledgeId: string,
    queryEmbedding: number[],
    opts?: SearchByEmbeddingOptions
  ): Promise<Chunks>;
  abstract searchByTerm(
    knowledgeId: string,
    term: string,
    opts?: SearchByTermOptions
  ): Promise<Chunks>;
}