import { SourceMetadata } from '@/entities/metadata.types';
import { SourceEntity } from '@/entities/source.entity';
import { Fragments, SourceFragment } from '@/fragment';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { Injectable } from '@nestjs/common';
import { SourceType } from '@/entities';

import { BaseProcessor } from './base.processor';
import { IProcessor } from './types';

@Injectable()
export class CSVProcessor extends BaseProcessor implements IProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new CSVLoader(pathOrBlob, { column: 'text' });
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
