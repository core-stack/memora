import { Job } from 'bullmq';
import streamToBlob from 'stream-to-blob';

import { StorageService } from '@/infra/storage/storage.service';
import { SourceRepository } from '@/modules/knowledge/source/source.repository';
import { VectorStore } from '@langchain/core/vectorstores';
import { Source } from '@memora/schemas';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';

import { PDFProcessor } from './processors/pdf.processor';

@Processor("ingest")
export class IngestProcessor extends WorkerHost {
  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly vectorStore!: VectorStore;
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
    
    await this.vectorStore.addDocuments(chunks.toDocuments());
    
    await this.sourceRepository.update(source.id, { indexStatus: "INDEXED" });
  }
}
