import { SourceMetadata } from '@/entities/metadata.types';
import { SourceEntity } from '@/entities/source.entity';
import { Fragments, SourceFragment } from '@/fragment';
import { JSONLoader } from '@langchain/classic/document_loaders/fs/json';
import { Injectable } from '@nestjs/common';
import { SourceType } from '@snipet/schemas';

import { BaseProcessor } from './base.processor';
import { IProcessor } from './types';

@Injectable()
export class JSONProcessor extends BaseProcessor implements IProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new JSONLoader(pathOrBlob);
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
