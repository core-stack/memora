import { SourceMetadata } from '@/entities/metadata.types';
import { SourceEntity } from '@/entities/source.entity';
import { Fragments, SourceFragment } from '@/fragment';
import { JSONLinesLoader } from '@langchain/classic/document_loaders/fs/json';
import { Injectable } from '@nestjs/common';
import { SourceType } from '@/entities';

import { BaseProcessor } from './base.processor';
import { IProcessor } from './types';

@Injectable()
export class JSONLProcessor extends BaseProcessor implements IProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new JSONLinesLoader(pathOrBlob, "text");
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
