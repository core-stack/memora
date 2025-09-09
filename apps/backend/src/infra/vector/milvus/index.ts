import { Chunk, Chunks } from "@/generics/chunk";
import { OnModuleInit } from "@nestjs/common";
import { DataType, FieldType, MilvusClient } from "@zilliz/milvus2-sdk-node";

import { SearchOptions, VectorStore } from "../vector-store.service";

export class MilvusService extends VectorStore implements OnModuleInit {
  client: MilvusClient;
  collectionName = "default";

  constructor() {
    super();
    this.client = new MilvusClient({ address: "localhost:19530" });
  }

  async onModuleInit() {
    await this.client.connectPromise;
    const schema: FieldType[] = [
      {
        name: "key",
        data_type: DataType.VarChar,
        max_length: 255,
        is_primary_key: true,
      },
      {
        name: "embedding",
        data_type: DataType.FloatVector,
        dim: 1536
      },
      {
        name: "content",
        data_type: DataType.VarChar,
      },
      {
        name: "sourceId",
        data_type: DataType.VarChar,
        max_length: 36,
      },
      {
        name: "knowledgeId",
        data_type: DataType.VarChar,
        max_length: 36
      },
      {
        name: "tenantId",
        data_type: DataType.VarChar,
        max_length: 36
      },
      {
        name: "createdAt",
        data_type: DataType.Int64
      },
      {
        name: "updatedAt",
        data_type: DataType.Int64
      }
    ];

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
  }

  async addChunks(c: Chunk[] | Chunk | Chunks): Promise<void> {
    const chunks = new Chunks();

    if (c instanceof Chunk) chunks.push(c);
    else if (c instanceof Chunks) chunks.import(c);
    else chunks.push(...c);

    const data = chunks.map(c => ({
      key: `${c.knowledgeId}-${c.seqId}`,
      embedding: c.embedding,
      content: c.content,
      sourceId: c.sourceId,
      knowledgeId: c.knowledgeId,
      tenantId: c.metadata.tenantId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

    if (data.some(d => !d.key || !d.embedding)) throw new Error("Invalid chunk data");

    await this.client.insert({
      collection_name: this.collectionName,
      fields_data: data
    });

    await this.client.flushSync({ collection_names: [this.collectionName] });
  }


  async search(queryEmbedding: number[], knowledgeId?: string, opts?: SearchOptions): Promise<Chunks> {
    const exprParts: string[] = [];
    if (knowledgeId) exprParts.push(`knowledgeId == "${knowledgeId}"`);
    const expr = exprParts.join(" && ");

    const result = await this.client.search({
      collection_name: "default",
      vectors: [queryEmbedding],
      search_params: {
        anns_field: "embedding",
        topk: 5,
        metric_type: "IP",
        params: JSON.stringify({ nprobe: 10 }),
      },
      output_fields: ["key", "content", "knowledgeId", "sourceId", "tenantId", "createdAt", "updatedAt"],
      expr: expr || undefined
    });

    return Chunks.fromChunks(result.results.map(r => new Chunk(
      Number(r.key.split("-")[1]),
      r.content,
      {
        tenantId: r.tenantId,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      },
      r.knowledgeId,
      r.sourceId
    )));
  }

  async deleteChunks(chunks: Chunk[] | Chunk | Chunks): Promise<void> {
    const keys = (chunks instanceof Chunk ? [chunks] :
      chunks instanceof Chunks ? chunks.toDocuments().map(d => d.metadata.seqId) :
      chunks).map(c => `${c.knowledgeId}-${c.seqId}`);

    await this.client.delete({
      collection_name: "default",
      exprValues: keys,
      expr: `key in [${keys.map(k => `"${k}"`).join(", ")}]`
    });

    await this.client.flushSync({ collection_names: ["default"] });
  }

}