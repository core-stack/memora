import { Document } from '@langchain/core/documents';

export class Chunk {
  seqId: number;
  content: string;
  metadata: Record<string, string>;
  knowledgeId: string;

  constructor(
    seqId: number,
    content: string,
    metadata: Record<string, string>,
    knowledgeId: string
  ) {
    this.seqId = seqId;
    this.content = content;
    this.metadata = metadata;
    this.knowledgeId = knowledgeId;
  }

  toDocument(): Document {
    return {
      pageContent: this.content,
      metadata: {
        ...this.metadata,
        seqId: this.seqId,
        knowledgeId: this.knowledgeId
      }
    } as Document;
  }
}

export class Chunks {
  constructor(private list: Chunk[] = []) {}

  toDocuments(): Document[] {
    return this.list.map(c => c.toDocument());
  }

  static fromChunks(chunks: Chunk[]): Chunks {
    return new Chunks(chunks);
  }
}