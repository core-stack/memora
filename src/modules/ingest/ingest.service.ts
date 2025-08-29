import { Embeddings } from "@langchain/core/embeddings";
import { Inject, Injectable } from "@nestjs/common";

import { Chunk } from "src/@types";
import { VectorDatabaseService } from "src/services/database/vector-database.service";
import { Batcher } from "src/utils/batcher.service";

import { PDFProcessor } from "./processors/pdf.processor";

@Injectable()
export class IngestService {
  @Inject() private readonly embeddings!: Embeddings;
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorDatabase!: VectorDatabaseService;

  async iterate(tenantId: string, path: string) {
    const batcher = new Batcher(async (data: Omit<Chunk, "embeddings">[]) => {
      const embeddings = await this.embeddings.embedDocuments(data.map((chunk) => chunk.content));
      const chunks = data.map<Chunk>((chunk, idx) => ({ ...chunk, embeddings: embeddings[idx] }));
      this.vectorDatabase.save(chunks);
    });

    for await (const chunk of this.pdfProcessor.processIterable(tenantId, path)) {
      batcher.append(chunk);
    }
    batcher.done();
  }
}
