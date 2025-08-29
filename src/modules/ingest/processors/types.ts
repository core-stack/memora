
import { Chunk } from "src/@types";

export interface IProcessor {
  processIterable(tenantId: string, input: string): AsyncGenerator<Omit<Chunk, "embeddings">>
}