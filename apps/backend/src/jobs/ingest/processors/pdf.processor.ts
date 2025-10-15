import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { env } from '@/env';
import { Fragments, SourceFragment } from '@/fragment';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { FragmentFileMetadata, Source, SourceType } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

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
    source: Source,
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
        tenantId: env.TENANT_ID,
        seqId,
        metadata,
        sourceType: SourceType.DOC,
      }
      ))
    );
  }
}