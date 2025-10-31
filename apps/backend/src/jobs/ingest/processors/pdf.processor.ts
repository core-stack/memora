import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { Fragments, SourceFragment } from '@/fragment';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Injectable } from '@nestjs/common';
import { FragmentFileMetadata, Source, SourceType } from '@snipet/schemas';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';

@Injectable()
export class PDFProcessor {
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });

  private load(pathOrBlob: string | Blob) {
    const loader = new PDFLoader(pathOrBlob, {
      pdfjs: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
      splitPages: false,
      parsedItemSeparator: "",
    });
    return loader.load();
  }

  async process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: FragmentFileMetadata
  ): Promise<Fragments<SourceFragment>> {
    const docs = await this.load(pathOrBlob);
    const docChunks = await this.splitter.splitDocuments(docs);

    return Fragments.fromFragmentArray(
      docChunks.map((chunk, seqId) => new SourceFragment({
        content: chunk.pageContent,
        sourceId: source.id,
        knowledgeId: source.knowledgeId,
        tenantId: source.tenantId,
        seqId,
        metadata,
        sourceType: SourceType.DOC,
      }))
    );
  }
}