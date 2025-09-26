import { env } from '@/env';
import { Fragment, Fragments } from '@/fragment';
import { OriginType } from '@memora/schemas';
import { Logger, OnModuleInit } from '@nestjs/common';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

import {
  SearchByEmbeddingOptions, SearchByTermOptions, VectorStore
} from '../vector-store.service';
import { COLLECTION_NAME, indexSchema, schema } from './schemas';

export class MilvusService extends VectorStore implements OnModuleInit {
  private readonly logger = new Logger(MilvusService.name);
  client: MilvusClient;
  collectionName = COLLECTION_NAME;

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

    await this.client.createCollection({ collection_name: this.collectionName, fields: schema });
    await this.client.createIndex(indexSchema);
    await this.client.loadCollectionAsync({ collection_name: this.collectionName });
  }

  async addFragments(c: Fragment[] | Fragment | Fragments): Promise<void> {
    const fragments = new Fragments();

    if (c instanceof Fragment) fragments.push(c);
    else if (c instanceof Fragments) fragments.import(c);
    else fragments.push(...c);

    const data = fragments.map(c => ({
      id: c.id,
      seqId: c.metadata.type === OriginType.SOURCE ? c.metadata.seqId : undefined,
      embedding: c.getEmbeddings(),
      content: c.content,
      sourceId: c.sourceId,
      knowledgeId: c.knowledgeId,
      tenantId: c.tenantId,
      sourceType: c.sourceType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: c.metadata
    }));

    if (data.some(d => !d.embedding)) throw new Error("Embedding is required");

    const res = await this.client.insert({ collection_name: this.collectionName, fields_data: data });
    this.logger.verbose(res);
    await this.client.flushSync({ collection_names: [this.collectionName] });
  }

  async deleteFragments(c: Fragment[] | Fragment | Fragments): Promise<void> {
    const fragments = new Fragments();

    if (c instanceof Fragment) fragments.push(c);
    else if (c instanceof Fragments) fragments.import(c);
    else fragments.push(...c);
    const ids = fragments.map(c => c.id);

    await this.client.delete({
      collection_name: this.collectionName,
      filter: `id in [${ids.map(id => `"${id}"`).join(", ")}]`
    });

    await this.client.flushSync({ collection_names: [this.collectionName] });
  }

  async searchByEmbeddings(
    knowledgeId: string,
    queryEmbedding: number[],
    opts?: SearchByEmbeddingOptions
  ): Promise<Fragments> {
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
    });

    return Fragments.fromFragmentArray(result.results.map(r => Fragment.fromObject(r)));
  }

  async searchByTerm(
    knowledgeId: string,
    term: string,
    opts: SearchByTermOptions = { limit: 10 }
  ): Promise<Fragments> {
    const exprParts: string[] = [];
    if (knowledgeId) exprParts.push(`knowledgeId == "${knowledgeId}"`);
    if (term) exprParts.push(`TEXT_MATCH(content, '${term}')`);

    const expr = exprParts.join(" && ");

    const result = await this.client.query({
      collection_name: this.collectionName,
      filter: expr,
      limit: opts.limit ?? 10,
    });

    return Fragments.fromFragmentArray(result.data.map(r => Fragment.fromObject(r)));
  }
}