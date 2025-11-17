import { SourceMetadata } from '@/entities/metadata.types';
import { SourceEntity } from '@/entities/source.entity';
import { Fragments, SourceFragment } from '@/fragment';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { Injectable } from '@nestjs/common';
import { SourceType } from '@snipet/schemas';

import { BaseProcessor } from './base.processor';

@Injectable()
export class PPTProcessor extends BaseProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new PPTXLoader(pathOrBlob);
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
