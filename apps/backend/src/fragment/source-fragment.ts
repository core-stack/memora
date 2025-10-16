import { SourceFragmentMetadata, sourceFragmentSchema, SourceType } from '@memora/schemas';

import { BaseFragment } from './fragment';

export class SourceFragment extends BaseFragment {
  seqId?: number;
  knowledgeId: string;
  tenantId: string;
  sourceId: string;
  sourceType: SourceType;
  metadata: SourceFragmentMetadata;

  constructor(
    f: Omit<SourceFragment, "id" | "createdAt" | "updatedAt"> & { id?: string, createdAt?: Date, updatedAt?: Date }
  ) {
    super(f);
    this.knowledgeId = f.knowledgeId;
    this.sourceType = f.sourceType;
    this.tenantId = f.tenantId;
    this.metadata = f.metadata;
    this.sourceId = f.sourceId;
    this.seqId = f.seqId;
    sourceFragmentSchema.parse(this);
  }

  static fromObject(obj: any): SourceFragment {
    return new SourceFragment(sourceFragmentSchema.parse(obj));
  }
}