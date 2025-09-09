import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { Chunk, Chunks } from '@/generics/chunk';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Injectable } from '@nestjs/common';

import { IProcessor } from './types';

@Injectable()
export class PDFProcessor implements IProcessor {
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

  async process(knowledgeId: string, pathOrBlob: string | Blob): Promise<Chunks> {
    const docs = await this.load(pathOrBlob);
    const docChunks = await this.splitter.splitDocuments(docs);
    
    return Chunks.fromChunks(
      docChunks.map((chunk, idx) => new Chunk(idx, chunk.pageContent, chunk.metadata, knowledgeId))
    );
  }
}