import { StorageService } from "@/infra/storage/storage.service";
import { VectorDatabaseService } from "@/infra/vector/vector-database.service";
import { SourceRepository } from "@/modules/knowledge/source/source.repository";
import { Embeddings } from "@langchain/core/embeddings";
import { Source } from "@memora/schemas";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { forwardRef, Inject } from "@nestjs/common";
import { Job } from "bullmq";
import streamToBlob from "stream-to-blob";

import { PDFProcessor } from "./processors/pdf.processor";

@Processor("ingest")
export class IngestProcessor extends WorkerHost {
  @Inject() private readonly embeddings!: Embeddings;
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorDatabase!: VectorDatabaseService;
  @Inject() private readonly storage!: StorageService;
  constructor(
    @Inject(forwardRef(() => SourceRepository)) private readonly sourceRepository: SourceRepository
  ) {
    super();
  }

  async process(job: Job<Source>): Promise<any> {
    const source = job.data;

    const obj = await this.storage.getObject(source.key);
    if (!obj) throw new Error("File not found");

    const chunks = await this.pdfProcessor.process(source.knowledgeId, await streamToBlob(obj));
    const embeddings = await this.embeddings.embedDocuments(chunks.map(c => c.content));
    await this.vectorDatabase.save(chunks.map((c, idx) => ({ ...c, embeddings: embeddings[idx] })));

    source.indexStatus = "INDEXED";
    await this.sourceRepository.update(source.id, source);
  }
}
