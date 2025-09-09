

export class Chunk {
  seqId: number;
  content: string;
  metadata: Record<string, string>;
  knowledgeId: string;
  sourceId: string;
  embedding?: number[];

  constructor(
    seqId: number,
    content: string,
    metadata: Record<string, string>,
    knowledgeId: string,
    sourceId: string
  ) {
    this.seqId = seqId;
    this.content = content;
    this.metadata = metadata;
    this.knowledgeId = knowledgeId;
    this.sourceId = sourceId;
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

  static fromChunks(chunks: Chunk[]): Chunks {
    return new Chunks(chunks);
  }

}