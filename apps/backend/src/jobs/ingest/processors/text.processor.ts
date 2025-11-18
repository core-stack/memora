import { SourceMetadata, SourceType } from '@/entities';
import { SourceEntity } from '@/entities/source.entity';
import { Fragments, SourceFragment } from '@/fragment';
import { TextLoader } from '@langchain/classic/document_loaders/fs/text';
import { Injectable } from '@nestjs/common';

import { BaseProcessor } from './base.processor';
import { IProcessor } from './types';

@Injectable()
export class TextProcessor extends BaseProcessor implements IProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new TextLoader(pathOrBlob);
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.TEXT);
  }
}
