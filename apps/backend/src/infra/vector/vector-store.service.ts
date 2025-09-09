import { Chunk, Chunks } from "@/generics/chunk";

export type SearchOptions = {
  filters?: Record<string, string>;
}
export abstract class VectorStore {
  abstract addChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void>;
  abstract search(query: string, knowledgeId: string, opts: SearchOptions): Promise<Chunk[]>;
  abstract deleteChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void>;
}