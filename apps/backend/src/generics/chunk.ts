import { randomUUID } from "crypto";

export class Chunk {
  constructor(
    public seqId: number,
    public content: string,
    public knowledgeId: string,
    public sourceId: string,
    public tenantId: string,
    public embedding: number[] = [],
    public metadata: any = {},
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public id: string = randomUUID(),
  ) {}

  static fromObject(obj: any): Chunk {
    return new Chunk(
      obj.seqId,
      obj.content,
      obj.knowledgeId,
      obj.sourceId,
      obj.tenantId,
      obj.embedding,
      obj.metadata,
      obj.createdAt ? new Date(obj.createdAt) : new Date(),
      obj.updatedAt ? new Date(obj.updatedAt) : new Date(),
      obj.id,
    );
  }

  setEmbedding(embedding: number[]) {
    this.embedding = embedding;
  }
}

export class Chunks {
  constructor(private list: Chunk[] = []) {}

  push(...chunk: Chunk[]) {
    this.list.push(...chunk);
  }

  import(chunks: Chunks) {
    this.list = this.list.concat(chunks.list);
  }

  setEmbeddings(embeddings: number[][]) {
    this.list.forEach((chunk, idx) => {
      chunk.setEmbedding(embeddings[idx]);
    });
  }

  map<T>(fn: (chunk: Chunk) => T) {
    return this.list.map<T>(fn);
  }

  static fromChunkArray(chunks: Chunk[]): Chunks {
    return new Chunks(chunks);
  }

}