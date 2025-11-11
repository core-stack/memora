import { Injectable } from '@nestjs/common';
import { JSONLinesLoader } from '@langchain/classic/document_loaders/fs/json';
import { IProcessor } from './types';
import { BaseProcessor } from './base.processor';
import { Fragments, SourceFragment } from '@/fragment';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';
import { FragmentFileMetadata, SourceType } from '@snipet/schemas';

@Injectable()
export class JSONLProcessor extends BaseProcessor implements IProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: FragmentFileMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new JSONLinesLoader(pathOrBlob, "text");
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
