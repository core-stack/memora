import { Constructor } from '@/types/constructor';
import { env } from '@/env';
import { BaseFragment, Fragments } from '@/fragment';
import { InvalidPresetError } from '@/infra/llm-manager/errors/invalid-preset.error';
import { LLMManagerService } from '@/infra/llm-manager/llm-manager.service';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  CreateIndexesReq, FieldType, FunctionObject, HybridSearchSingleReq, MilvusClient, RerankerObj,
  RowData, RRFRanker, SearchResultData
} from '@zilliz/milvus2-sdk-node';

import { VectorDeleteError } from '../errors/delete-error';
import { InvalidVectorFiltersError } from '../errors/invalid-vector-filters';
import { VectorMutationError } from '../errors/vector-mutation';
import { VectorSearchError } from '../errors/vector-search';
import { VectorStore, WithSearchOptions } from '../vector-store.service';
import { LLMPreset } from '@/types/llm-preset';

export abstract class MilvusService<T extends BaseFragment>
  extends VectorStore<T> implements OnModuleInit, OnModuleDestroy {
  protected abstract readonly logger: Logger;
  client: MilvusClient;

  constructor(
    protected readonly llmManager: LLMManagerService,
    protected readonly collectionName: string,
    protected readonly Type: Constructor<T>,
    protected readonly fields: FieldType[] | ((model: string, dim: number) => FieldType[]) = [],
    protected readonly functions: FunctionObject[] | (() => FunctionObject[]) = [],
    protected readonly indexSchema: CreateIndexesReq | ((collectionName: string) => CreateIndexesReq) = [],
    protected readonly reranker: RerankerObj = RRFRanker(100),
  ) {
    super();
    this.client = new MilvusClient({ address: env.MILVUS_URL });
  }

  protected buildCollectionName(preset: LLMPreset) {
    if (preset.config.type === "TEXT") {
      throw new InvalidPresetError("Cannot create collection for TEXT preset");
    }
    const { dimension, model } = preset.config;
    let name = `${this.collectionName}_${model}_${dimension}`.toLowerCase().trim();

    // replace special characters to "_"
    name = name.replace(/[^a-z0-9_]+/g, "_");

    // remove consecutive "_"
    name = name.replace(/_+/g, "_").replace(/^_+|_+$/g, "");

    // add "c_" if the name starts with a number
    if (/^[0-9]/.test(name)) {
      name = "c_" + name;
    }

    return name;
  }

  private async setupCollection(preset: LLMPreset) {
    if (preset.config.type === "TEXT") return;
    const { dimension, model } = preset.config;
    const collectionName = this.buildCollectionName(preset);

    const existsCollection = (await this.client.hasCollection({ collection_name: collectionName })).value;

    if (!env.MILVUS_RECREATE_COLLECTION && existsCollection) return;
    if (env.MILVUS_RECREATE_COLLECTION && existsCollection) {
      this.logger.warn("Env var MILVUS_RECREATE_COLLECTION is true, dropping collection");
      await this.client.dropCollection({ collection_name: collectionName });
    }

    await this.client.createCollection({
      collection_name: collectionName,
      fields: this.fields instanceof Function ? this.fields(model, dimension) : this.fields,
      functions: this.functions instanceof Function ? this.functions() : this.functions
    });
    await this.client.createIndex(
      this.indexSchema instanceof Function ? this.indexSchema(collectionName) : this.indexSchema
    );
    await this.client.loadCollectionAsync({ collection_name: collectionName });
  }

  async onModuleInit() {
    await this.client.connectPromise;
    for (const preset of this.llmManager.getPresets()) {
      await this.setupCollection(preset);
    }
  }

  async onModuleDestroy() {
    await this.client.closeConnection();
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

  async addFragments(llmId: string, c: T[] | T | Fragments<T>): Promise<void> {
    // add embeddings
    const embeddingProvider = await this.llmManager.getEmbedding(llmId);
    if (!embeddingProvider) throw new VectorMutationError("Embedding service not found");
    const collectionName = this.buildCollectionName(embeddingProvider.preset);

    const chunks = this.fragmentToChunk(this.toFragments(c));
    const embeddings = await embeddingProvider.embed(chunks.map(c => (c.content as string)));

    for (let i = 0; i < chunks.length; i++) chunks[i].dense = embeddings[i];

    const res = await this.client.insert({ collection_name: collectionName, fields_data: chunks });
    if (res.err_index.length > 0) throw new VectorMutationError("Error adding fragments", res);
    await this.client.flushSync({ collection_names: [collectionName] });
  }

  async deleteFragments(llmId: string, c: T | T[] | Fragments<T>): Promise<void> {
    const embeddingProvider = await this.llmManager.getEmbedding(llmId);
    if (!embeddingProvider) throw new VectorMutationError("Embedding service not found");
    const collectionName = this.buildCollectionName(embeddingProvider.preset);

    const ids = this.toFragments(c).map((f: any) => f.id);
    if (!ids.length) return;

    const res = await this.client.delete({
      collection_name: collectionName,
      filter: `id in [${ids.map(id => `"${id}"`).join(", ")}]`
    });
    if (res.err_index.length > 0) throw new VectorMutationError("Error deleting fragments", res);
    await this.client.flushSync({ collection_names: [collectionName] });
  }

  async search(llmId: string, ...opts: WithSearchOptions[]): Promise<Fragments<T>> {
    const embeddingProvider = await this.llmManager.getEmbedding(llmId);
    if (!embeddingProvider) throw new VectorMutationError("Embedding service not found");

    const collectionName = this.buildCollectionName(embeddingProvider.preset);

    const options = this.buildSearchOptions(...opts);

    const escapeFilterValue = (value: string) => value.replace(/['"]/g, "\\$&");

    let filter = this.buildFilters(options.filters);
    if (options.term) {
      if (typeof options.term !== "string" || options.term.length > 500) {
        throw new InvalidVectorFiltersError("Invalid search term");
      }

      const term = escapeFilterValue(options.term.trim());
      const textMatch = `TEXT_MATCH(content, '${term}')`;

      filter = filter ? `${filter} && ${textMatch}` : textMatch;
    }

    //#region search
    const data: HybridSearchSingleReq[] = [];
    if (options.dense) {
      let topK = options.topK;
      if (typeof options.dense !== "string" && options.dense.topK) topK = options.dense.topK

      const embeddings = await embeddingProvider.embed(
        typeof options.dense === "string" ? options.dense : options.dense.query
      );

      data.push({
        anns_field: "dense",
        data: embeddings,
        limit: topK,
        param: { nprobe: 10 },
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

    if (data.length === 0) throw new InvalidVectorFiltersError("No search data");

    const result = await this.client.search({
      collection_name: collectionName,
      filter,
      data: data,
      topk: options.topK,
      rerank: options.dense && options.sparse ? this.reranker : undefined
    });
    if (!result.results?.length) return new Fragments<T>();
    if (result.status.error_code !== "Success") throw new VectorSearchError("Error searching fragments");

    return this.searchResultToFragment(result.results);
  }

  async deleteByFilter(llmId: string, filter: Record<string, string | number | boolean>): Promise<void> {
    const embeddingProvider = await this.llmManager.getEmbedding(llmId);
    if (!embeddingProvider) throw new VectorMutationError("Embedding service not found");
    const collectionName = this.buildCollectionName(embeddingProvider.preset);

    const res = await this.client.delete({
      collection_name: collectionName,
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
          const safe = String(value).replace(/"/g, '\\"');
          exprParts.push(`${key} == "${safe}"`);
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