import { Chunk, Chunks } from "@/generics/chunk";
import { MilvusClient } from "@zilliz/milvus2-sdk-node";

import { SearchOptions, VectorStore } from "../vector-store.service";

export class MilvusService extends VectorStore {
  client: MilvusClient
  constructor() {
    super();
    this.client = new MilvusClient({
      address: "",
    });
  }

  async addChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void> {
    this.client.insert({
      collection_name: "",
      data: [{}]
    })
  }

  async search(query: string, knowledgeId: string, opts: SearchOptions): Promise<Chunk[]> {
    throw new Error("Method not implemented.");
  }

  async deleteChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void> {
    throw new Error("Method not implemented.");
  }

}