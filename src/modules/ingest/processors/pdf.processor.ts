import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Injectable } from "@nestjs/common";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { Chunk } from "src/@types";

import { IProcessor } from "./types";

@Injectable()
export class PDFProcessor implements IProcessor {
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });

  private load(path: string) {
    const loader = new PDFLoader(path, {
      pdfjs: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
      splitPages: false,
      parsedItemSeparator: "",
    });
    return loader.load();
  }

  async *processIterable(tenantId: string, path: string): AsyncGenerator<Omit<Chunk, "embeddings">> {
    for (const doc of await this.load(path)) {
      const docChunks = await this.splitter.splitDocuments([doc]);
      let idx = 0;
      for (const chunk of docChunks) {
        idx++;
        yield {
          tenantId,
          content: chunk.pageContent,
          metadata: chunk.metadata,
          seqId: idx,
        } as Chunk;
      }
    }
  }
}