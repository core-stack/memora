import { randomUUID } from "crypto";

export class Chunk {
  id: string;
  seqId: number;
  content: string;
  knowledgeId: string;
  sourceId: string;
  tenantId: string;
  embedding: number[];

  constructor(seqId: number, content: string, knowledgeId: string, sourceId: string, tenantId: string, id: string = randomUUID(), embedding: number[] = []) {
    this.id = id;
    this.seqId = seqId;
    this.content = content;
    this.knowledgeId = knowledgeId;
    this.sourceId = sourceId;
    this.tenantId = tenantId;
    this.embedding = embedding;
  }

  static fromObject(obj: any): Chunk {
    return new Chunk(
      obj.seqId,
      obj.content,
      obj.knowledgeId,
      obj.sourceId,
      obj.tenantId,
      obj.id,
      obj.embedding
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