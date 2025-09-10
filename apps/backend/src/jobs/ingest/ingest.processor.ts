import { Job } from 'bullmq';
import streamToBlob from 'stream-to-blob';

import { StorageService } from '@/infra/storage/storage.service';
import { VectorStore } from '@/infra/vector/vector-store.service';
import { SourceRepository } from '@/modules/knowledge/source/source.repository';
import { Embeddings } from '@langchain/core/embeddings';
import { Source } from '@memora/schemas';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';

import { PDFProcessor } from './processors/pdf.processor';

@Processor("ingest", { concurrency: 5 })
export class IngestProcessor extends WorkerHost {
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorStore!: VectorStore;
  @Inject() private readonly embeddings!: Embeddings;
  @Inject() private readonly storage!: StorageService;

  constructor(
    @Inject(forwardRef(() => SourceRepository)) private readonly sourceRepository: SourceRepository
  ) { super(); }

  async process(job: Job<Source>): Promise<any> {
    const source = job.data;
    const obj = await this.storage.getObject(source.key);
    if (!obj) throw new Error("File not found");

    const chunks = await this.pdfProcessor.process(source, await streamToBlob(obj));
    const embeddings = await this.embeddings.embedDocuments(chunks.map(c => c.content));
    chunks.setEmbeddings(embeddings);
    await this.vectorStore.addChunks(chunks);
  }

  @OnWorkerEvent("active")
  async onStart(job: Job<Source>) {
    const source = job.data;
    await this.sourceRepository.update(source.id, { indexStatus: "INDEXING" });
  }

  @OnWorkerEvent("completed")
  async onCompleted(job: Job<Source>) {
    const source = job.data;
    await this.sourceRepository.update(source.id, { indexStatus: "INDEXED" });
  }

  @OnWorkerEvent("error")
  @OnWorkerEvent("failed")
  async onError(job: Job<Source>, error: Error) {
    const source = job.data;
    await this.sourceRepository.update(source.id, { indexStatus: "ERROR", indexError: error.message });
  }
}
