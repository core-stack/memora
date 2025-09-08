import { StorageService } from "@/infra/storage/storage.service";
import { VectorDatabaseService } from "@/infra/vector/vector-database.service";
import { Embeddings } from "@langchain/core/embeddings";
import { Source } from "@memora/schemas";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { Job } from "bullmq";
import streamToBlob from "stream-to-blob";

import { Chunk } from "src/@types";
import { Batcher } from "src/utils/batcher.service";

import { PDFProcessor } from "./processors/pdf.processor";

type IngestJob = {
  source: Source;
}
@Processor("ingest")
export class IngestService extends WorkerHost {
  @Inject() private readonly embeddings!: Embeddings;
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorDatabase!: VectorDatabaseService;
  @Inject() private readonly storage!: StorageService;

  async process(job: Job<IngestJob>): Promise<any> {
    const { knowledgeId, key: path } = job.data.source;
    const obj = await this.storage.getObject(path);
    if (!obj) throw new Error("File not found");

    const batcher = new Batcher(async (data: Omit<Chunk, "embeddings">[]) => {
      const embeddings = await this.embeddings.embedDocuments(data.map((chunk) => chunk.content));
      const chunks = data.map<Chunk>((chunk, idx) => ({ ...chunk, embeddings: embeddings[idx] }));
      await this.vectorDatabase.save(chunks);
    });

    for await (const chunk of this.pdfProcessor.processIterable(knowledgeId, await streamToBlob(obj))) {
      batcher.append(chunk);
    }
    batcher.done();
  }
}
