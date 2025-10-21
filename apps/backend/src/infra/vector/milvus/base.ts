import { Constructor } from '@/@types/constructor';
import { env } from '@/env';
import { BaseFragment, Fragments } from '@/fragment';
import { Embeddings } from '@langchain/core/embeddings';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import {
  CreateIndexesReq, FieldType, FunctionObject, HybridSearchSingleReq, MilvusClient, RerankerObj,
  RowData, RRFRanker, SearchResultData
} from '@zilliz/milvus2-sdk-node';

import { VectorDeleteError } from '../errors/delete-error';
import { InvalidVectorFiltersError } from '../errors/invalid-vector-filters';
import { VectorMutationError } from '../errors/vector-mutation';
import { VectorSearchError } from '../errors/vector-search';
import { VectorStore, WithSearchOptions } from '../vector-store.service';

export abstract class MilvusService<T extends BaseFragment> extends VectorStore<T> implements OnModuleInit {
  protected abstract readonly logger: Logger;
  client: MilvusClient;

  @Inject() private readonly embeddings: Embeddings;

  constructor(
    protected readonly Type: Constructor<T>,
    protected readonly collectionName: string,
    protected readonly fields: FieldType[] = [],
    protected readonly functions: FunctionObject[] = [],
    protected readonly indexSchema: CreateIndexesReq | ((collectionName: string) => CreateIndexesReq) = [],
    protected readonly reranker: RerankerObj = RRFRanker(100)
  ) {
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
      fields: this.fields,
      functions: this.functions
    });
    await this.client.createIndex(this.indexSchema instanceof Function ? this.indexSchema(this.collectionName) : this.indexSchema);
    await this.client.loadCollectionAsync({ collection_name: this.collectionName });
  }

  abstract fragmentToChunk(fragment: T | T[] | Fragments<T>): RowData[];
  abstract searchResultToFragment(data: SearchResultData[]): Fragments<T>;

  toFragments(c: T | T[] | Fragments<T>): Fragments<T> {
    const fragments = new Fragments<T>();

    if (c instanceof this.Type) fragments.push(c);
    else if (c instanceof Fragments) fragments.import(c);
    else fragments.push(...(c as T[]));

    return fragments;
  }

  async addFragments(c: T[] | T | Fragments<T>): Promise<void> {
    const chunks = this.fragmentToChunk(this.toFragments(c));
    // add embeddings
    const embeddings = await this.embeddings.embedDocuments(chunks.map(c => (c.content as string)));

    for (let i = 0; i < chunks.length; i++) {
      chunks[i].dense = embeddings[i];
    }
    const res = await this.client.insert({ collection_name: this.collectionName, fields_data: chunks });
    if (res.err_index.length > 0) throw new VectorMutationError("Error adding fragments", res);
    await this.client.flushSync({ collection_names: [this.collectionName] });
  }

  async deleteFragments(c: T | T[] | Fragments<T>): Promise<void> {
    const ids = this.toFragments(c).map((f: any) => f.id);
    if (!ids.length) return;

    const res = await this.client.delete({
      collection_name: this.collectionName,
      filter: `id in [${ids.map(id => `"${id}"`).join(", ")}]`
    });
    if (res.err_index.length > 0) throw new VectorMutationError("Error deleting fragments", res);
    await this.client.flushSync({ collection_names: [this.collectionName] });
  }

  async search(...opts: WithSearchOptions[]): Promise<Fragments<T>> {
    const options = this.buildSearchOptions(...opts);

    let filter = this.buildFilters(options.filters);
    if (options.term) filter += ` && TEXT_MATCH(content, '${options.term}')`;

    //#region search
    const data: HybridSearchSingleReq[] = [];
    if (options.dense) {
      let topK = options.topK;
      if (typeof options.dense !== "string" && options.dense.topK) topK = options.dense.topK

      const embeddings = await this.embeddings.embedQuery(typeof options.dense === "string" ? options.dense : options.dense.query);

      data.push({
        anns_field: "dense",
        data: embeddings,
        limit: topK,
        param: {nprobe: 10},
      } as HybridSearchSingleReq);
    }
    if (options.sparse) {
      let topK = options.topK;
      if (typeof options.sparse !== "string" && options.sparse.topK) topK = options.sparse.topK;
      data.push({
        anns_field: "sparse",
        data: typeof options.sparse === "string" ? options.sparse : options.sparse.query,
        limit: topK,
        param: { drop_ratio_search: 0.2 },
      } as HybridSearchSingleReq);
    }
    //#endregion
    
    if (!data) throw new InvalidVectorFiltersError("No search data");
    
    const result = await this.client.search({
      collection_name: this.collectionName,
      filter,
      data: data,
      topk: options.topK,
      rerank: options.dense && options.sparse ? this.reranker : undefined
    });
    if (result.status.error_code !== "Success") throw new VectorSearchError("Error searching fragments");
    
    return this.searchResultToFragment(result.results);
  }

  async delete(filter: Record<string, string | number | boolean>): Promise<void> {
    const res = await this.client.delete({
      collection_name: this.collectionName,
      filter: this.buildFilters(filter),
    });
    if (res.err_index.length > 0) {
      this.logger.error("Error deleting fragments", res);
      throw new VectorDeleteError("Error deleting fragments");
    }
  }

  private buildFilters(filters?: Record<string, string | number | boolean>): string {
    const exprParts: string[] = [];
    Object.entries(filters ?? {}).map(([key, value]) => {
      switch(typeof value) {
        case "string":
          exprParts.push(`${key} == "${value}"`);
          break;
        case "number":
        case "boolean":
          exprParts.push(`${key} == ${value}`);
          break;
        default:
          break;
      }
    })
  
    return exprParts.join(" && ");
  }
}