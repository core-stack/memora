import { Chunk, Chunks } from "@/generics/chunk";

export type SearchOptions = {
  filters?: Record<string, string>;
}
export abstract class VectorStore {
  abstract addChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void>;
  abstract search(queryEmbedding: number[], knowledgeId: string, opts: SearchOptions): Promise<Chunks>;
  abstract deleteChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void>;
}