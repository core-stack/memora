import { Injectable } from '@nestjs/common';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { IProcessor } from './types';
import { BaseProcessor } from './base.processor';
import { Fragments, SourceFragment } from '@/fragment';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';
import { SourceType } from '@snipet/schemas';
import { SourceMetadata } from '@/modules/knowledge/source/metadata.types';

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
