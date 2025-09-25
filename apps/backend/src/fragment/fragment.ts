import { Fragment as FragmentType, FragmentMetadata, OriginType } from "@memora/schemas";
import { randomUUID } from "crypto";

export interface IFragment extends FragmentType {};

export class Fragment implements IFragment {
  id: string;
  knowledgeId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  metadata: FragmentMetadata;
  cached: boolean;
  originType: OriginType;
  originId: string;

  private embeddings: number[] = [];

  constructor(
    content: string,
    knowledgeId: string,
    sourceId: string,
    tenantId: string,
    metadata: FragmentMetadata = {} as FragmentMetadata,
    id: string = randomUUID(),
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.content = content;
    this.knowledgeId = knowledgeId;
    this.originId = sourceId;
    this.tenantId = tenantId;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromObject(obj: any): Fragment {
    return new Fragment(
      obj.content,
      obj.knowledgeId,
      obj.sourceId,
      obj.tenantId,
      obj.metadata,
      obj.id,
      obj.createdAt ? new Date(obj.createdAt) : new Date(),
      obj.updatedAt ? new Date(obj.updatedAt) : new Date(),
    );
  }

  setEmbedding(embeddings: number[]) {
    if (!embeddings) return;
    this.embeddings = embeddings;
  }
}