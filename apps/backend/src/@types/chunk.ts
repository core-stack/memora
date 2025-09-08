export type Chunk = {
  seqId: number;
  content: string;
  embeddings: number[];
  metadata: Record<string, string>;
  knowledgeId: string;
}