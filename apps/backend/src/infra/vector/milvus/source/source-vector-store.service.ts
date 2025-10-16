import moment from 'moment';

import { Fragments, SourceFragment } from '@/fragment';
import { OriginType } from '@memora/schemas';
import { Logger } from '@nestjs/common';
import { RowData, SearchResultData } from '@zilliz/milvus2-sdk-node';

import { MilvusService } from '../base';
import { sourceFields, sourceFunctions, sourceIndexSchema } from './source-schemas';

export class MilvusSourceVectorStoreService extends MilvusService<SourceFragment> {
  protected override logger = new Logger(MilvusSourceVectorStoreService.name);
  constructor() {
    super(SourceFragment, "source", sourceFields, sourceFunctions, sourceIndexSchema)
  }

  fragmentToChunk(c: SourceFragment | SourceFragment[] | Fragments<SourceFragment>): RowData[] {
    const fragments = this.toFragments(c);

    return fragments.map<RowData>(c => ({
      id: c.id,
      seqId: c.metadata.type === OriginType.FILE ? c.seqId : undefined,
      content: c.content,
      sourceId: c.sourceId,
      knowledgeId: c.knowledgeId,
      tenantId: c.tenantId,
      sourceType: c.sourceType,
      createdAt: c.createdAt.getTime() ?? Date.now(),
      updatedAt: c.updatedAt.getTime() ?? Date.now(),
      metadata: c.metadata
    }));
  }

  searchResultToFragment(data: SearchResultData[]): Fragments<SourceFragment> {
    return Fragments.fromFragmentArray(
      data.map(c => new SourceFragment({
        content: c.content,
        id: c.id,
        seqId: c.seqId,
        sourceId: c.sourceId,
        knowledgeId: c.knowledgeId,
        metadata: c.metadata,
        sourceType: c.sourceType,
        tenantId: c.tenantId,
        createdAt: moment(Number(c.createdAt)).toDate(),
        updatedAt: moment(Number(c.updatedAt)).toDate(),
      }))
    );
  }
}