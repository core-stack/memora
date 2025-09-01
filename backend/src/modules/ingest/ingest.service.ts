import { Embeddings } from "@langchain/core/embeddings";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import streamToBlob from "stream-to-blob";

import { Chunk } from "src/@types";
import { VectorDatabaseService } from "src/services/database/vector-database.service";
import { StorageService } from "src/services/storage/storage.service";
import { Batcher } from "src/utils/batcher.service";

import { PDFProcessor } from "./processors/pdf.processor";

@Injectable()
export class IngestService {
  @Inject() private readonly embeddings!: Embeddings;
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorDatabase!: VectorDatabaseService;
  @Inject() private readonly storage!: StorageService;

  async iterate(tenantId: string, path: string) {
    const obj = await this.storage.getObject(path);
    if (!obj) throw new NotFoundException("File not found");

    const batcher = new Batcher(async (data: Omit<Chunk, "embeddings">[]) => {
      const embeddings = await this.embeddings.embedDocuments(data.map((chunk) => chunk.content));
      const chunks = data.map<Chunk>((chunk, idx) => ({ ...chunk, embeddings: embeddings[idx] }));
      this.vectorDatabase.save(chunks);
    });

    for await (const chunk of this.pdfProcessor.processIterable(tenantId, await streamToBlob(obj))) {
      batcher.append(chunk);
    }
    batcher.done();
  }
}
