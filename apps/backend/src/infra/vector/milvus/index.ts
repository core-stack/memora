import { env } from '@/env';
import { Chunk, Chunks } from '@/generics/chunk';
import { Logger, OnModuleInit } from '@nestjs/common';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

import {
  SearchByEmbeddingOptions, SearchByTermOptions, VectorStore
} from '../vector-store.service';
import { schema } from './schemas';

export class MilvusService extends VectorStore implements OnModuleInit {
  private readonly logger = new Logger(MilvusService.name);
  client: MilvusClient;
  collectionName = env.MILVUS_COLLECTION;

  constructor() {
    super();
    this.client = new MilvusClient({ address: env.MILVUS_URL });
  }

  async onModuleInit() {
    await this.client.connectPromise;
    const existsCollection = (await this.client.hasCollection({ collection_name: this.collectionName })).value;
    if (!env.MULVUS_RECREATE_COLLECTION && existsCollection) return;
    if (env.MULVUS_RECREATE_COLLECTION && existsCollection) {
      this.logger.warn("Env var MULVUS_RECREATE_COLLECTION is true, dropping collection");
      await this.client.dropCollection({ collection_name: this.collectionName });
    }

    await this.client.createCollection({
      collection_name: this.collectionName,
      fields: schema
    });

    await this.client.createIndex({
      collection_name: this.collectionName,
      field_name: "embedding",
      index_name: "embedding_idx",
      extra_params: {
        index_type: "IVF_FLAT",
        metric_type: "IP",
        params: JSON.stringify({ nlist: 128 }),
      },
    });
    await this.client.loadCollectionAsync({ collection_name: this.collectionName });
  }

  async addChunks(c: Chunk[] | Chunk | Chunks): Promise<void> {
    const chunks = new Chunks();

    if (c instanceof Chunk) chunks.push(c);
    else if (c instanceof Chunks) chunks.import(c);
    else chunks.push(...c);

    const data = chunks.map(c => ({
      id: c.id,
      seqId: c.seqId,
      embedding: c.embedding,
      content: c.content,
      sourceId: c.sourceId,
      knowledgeId: c.knowledgeId,
      tenantId: c.tenantId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    if (data.some(d => !d.embedding)) throw new Error("Invalid chunk data");

    const res = await this.client.insert({
      collection_name: this.collectionName,
      fields_data: data
    });

    await this.client.flushSync({ collection_names: [this.collectionName] });
  }

  async deleteChunks(c: Chunk[] | Chunk | Chunks): Promise<void> {
    const chunks = new Chunks();

    if (c instanceof Chunk) chunks.push(c);
    else if (c instanceof Chunks) chunks.import(c);
    else chunks.push(...c);
    const keys = chunks.map(c => `${c.knowledgeId}-${c.seqId}`);

    await this.client.delete({
      collection_name: "default",
      filter: `key in [${keys.map(k => `"${k}"`).join(", ")}]`
    });

    await this.client.flushSync({ collection_names: ["default"] });
  }

  async searchByEmbeddings(
    knowledgeId: string,
    queryEmbedding: number[],
    opts?: SearchByEmbeddingOptions
  ): Promise<Chunks> {
    const exprParts: string[] = [];
    if (knowledgeId) exprParts.push(`knowledgeId == "${knowledgeId}"`);
    const expr = exprParts.join(" && ");

    const result = await this.client.search({
      collection_name: this.collectionName,
      filter: expr,
      vectors: [queryEmbedding],
      search_params: {
        anns_field: "embedding",
        topk: 5,
        metric_type: "IP",
        params: JSON.stringify({ nprobe: 10 }),
      },
      output_fields: ["seqId", "content", "knowledgeId", "sourceId", "tenantId", "createdAt", "updatedAt"],
    });

    return Chunks.fromChunkArray(result.results.map(r => Chunk.fromObject(r)));
  }

  async searchByTerm(knowledgeId: string, term: string, opts: SearchByTermOptions = { limit: 10}): Promise<Chunks> {
    const exprParts: string[] = [];
    if (knowledgeId) exprParts.push(`knowledgeId == "${knowledgeId}"`);
    if (term) exprParts.push(`TEXT_MATCH(content, '${term}')`);

    const expr = exprParts.join(" && ");
    
    const result = await this.client.query({
      collection_name: this.collectionName,
      filter: expr,
      limit: opts.limit ?? 10,
      output_fields: ["seqId", "content", "knowledgeId", "sourceId", "tenantId", "createdAt", "updatedAt"],
    });
    
    return Chunks.fromChunkArray(result.data.map(r => Chunk.fromObject(r)));
  }
}