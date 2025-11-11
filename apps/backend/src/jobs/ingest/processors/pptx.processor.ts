import { Injectable } from '@nestjs/common';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { BaseProcessor } from './base.processor';
import { Fragments, SourceFragment } from '@/fragment';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';
import { FragmentFileMetadata, SourceType } from '@snipet/schemas';

@Injectable()
export class PPTProcessor extends BaseProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: FragmentFileMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new PPTXLoader(pathOrBlob);
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
