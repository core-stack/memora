import { StorageService } from "@/infra/storage/storage.service";
import { VectorDatabaseService } from "@/infra/vector/vector-database.service";
import { Embeddings } from "@langchain/core/embeddings";
import { Source } from "@memora/schemas";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import streamToBlob from "stream-to-blob";

import { PDFProcessor } from "./processors/pdf.processor";

@Processor("ingest")
export class IngestService extends WorkerHost {
  @Inject() private readonly embeddings!: Embeddings;
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorDatabase!: VectorDatabaseService;
  @Inject() private readonly storage!: StorageService;

  async process(job: Job<Source>): Promise<any> {
    const { knowledgeId, key: path } = job.data;

    const obj = await this.storage.getObject(path);
    if (!obj) throw new Error("File not found");

    const chunks = await this.pdfProcessor.process(knowledgeId, await streamToBlob(obj));
    const embeddings = await this.embeddings.embedDocuments(chunks.map(c => c.content));
    await this.vectorDatabase.save(chunks.map((c, idx) => ({ ...c, embeddings: embeddings[idx] })));
  }
}
