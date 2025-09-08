

import { Chunk } from "src/@types";

import { SaveOptions, VectorDatabase } from "./types/vector";

export abstract class VectorDatabaseService implements VectorDatabase {
  abstract save(chunk: Chunk | Chunk[], opts?: SaveOptions): Promise<void>;
}