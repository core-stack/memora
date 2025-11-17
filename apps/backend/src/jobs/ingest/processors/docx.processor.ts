import { SourceMetadata } from '@/entities/metadata.types';
import { SourceEntity } from '@/entities/source.entity';
import { Fragments, SourceFragment } from '@/fragment';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { Injectable } from '@nestjs/common';
import { SourceType } from '@snipet/schemas';

import { BaseProcessor } from './base.processor';

@Injectable()
export class DocxProcessor extends BaseProcessor {
  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>> {
    const loader = new DocxLoader(pathOrBlob, { type: source.metadata.extension === "doc" ? "doc" : "docx" });
    const docs = await loader.load();
    const chunks = await this.splitter.splitDocuments(docs);
    return this.createFragments(chunks, source, metadata, SourceType.DOC);
  }
}
