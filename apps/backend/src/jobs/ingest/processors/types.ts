
import { Chunk } from "src/@types";

export interface IProcessor {
  processIterable(tenantId: string, input: string | Blob): AsyncGenerator<Omit<Chunk, "embeddings">>
  process(tenantId: string, input: string | Blob): Promise<Array<Omit<Chunk, "embeddings">>>
}