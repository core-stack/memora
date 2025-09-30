

import { randomUUID } from 'crypto';

import {
  Fragment as FragmentType, FragmentMetadata, fragmentSchema, SourceType
} from '@memora/schemas';

export interface IFragment extends FragmentType {};

export class Fragment implements IFragment {
  id: string;
  knowledgeId: string;
  tenantId: string;
  sourceId: string;
  sourceType: SourceType;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  metadata: FragmentMetadata;
  cached: boolean;

  private embeddings: number[] = [];

  constructor(
    f: Omit<FragmentType, "id" | "createdAt" | "updatedAt" | "cached"> & { id?: string, createdAt?: Date, updatedAt?: Date, cached?: boolean }
  ) {
    this.content = f.content;
    this.knowledgeId = f.knowledgeId;
    this.sourceType = f.sourceType;
    this.tenantId = f.tenantId;
    this.metadata = f.metadata;
    this.sourceId = f.sourceId;
    this.id = f.id || randomUUID();
    this.createdAt = f.createdAt || new Date();
    this.updatedAt = f.updatedAt || new Date();
    this.cached = f.cached || false;
  }

  static fromObject(obj: any): Fragment {
    return new Fragment(fragmentSchema.parse(obj));
  }

  setEmbeddings(embeddings: number[]) {
    if (!embeddings) return;
    this.embeddings = embeddings;
  }
  getEmbeddings() {
    return this.embeddings;
  }
}