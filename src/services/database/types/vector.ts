import { Chunk } from "src/@types";

export type SaveOptions = {
  upsert?: boolean;
}

export interface VectorDatabase {
  save(chunk: Chunk | Chunk[], opts?: SaveOptions): Promise<void>
}