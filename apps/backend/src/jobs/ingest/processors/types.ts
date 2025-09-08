
import { Chunk } from 'src/@types';

export interface IProcessor {
  processIterable(tenantId: string, input: string | Blob): AsyncGenerator<Omit<Chunk, "embeddings">>
}