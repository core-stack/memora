import { Job } from 'bullmq';
import streamToBlob from 'stream-to-blob';

import { PrivateStorageService } from '@/infra/storage/private-storage.service';
import { SourceVectorStoreService } from '@/infra/vector/source-vector-store.service';
import { SourceRepository } from '@/modules/knowledge/source/source.repository';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Source } from '@snipet/schemas';

import { JobType } from '../types';
import { ProcessorManager } from './processor-manager';

@Processor(JobType.INGEST, { concurrency: 1 })
export class IngestProcessor extends WorkerHost {
  private logger = new Logger(IngestProcessor.name);
  @Inject() private readonly processor!: ProcessorManager;
  @Inject() private readonly vectorStore!: SourceVectorStoreService;
  @Inject() private readonly storage!: PrivateStorageService;

  @Inject(forwardRef(() => SourceRepository)) private readonly sourceRepository: SourceRepository;

  async process(job: Job<Source>): Promise<any> {
    const source = job.data;
    
    const obj = await this.storage.getObject(source.key);
    if (!obj) throw new Error("File not found");
    const fragments = await this.processor.process(source, await streamToBlob(obj));
    
    await this.vectorStore.addFragments(source.knowledgeId, fragments);
  }

  @OnWorkerEvent("active")
  async onStart(job: Job<Source>) {
    this.logger.log("ingest started");
    const source = job.data;
    await this.sourceRepository.update(source.id, { indexStatus: "INDEXING" });
  }

  @OnWorkerEvent("completed")
  async onCompleted(job: Job<Source>) {
    this.logger.log("ingest completed");
    const source = job.data;
    await this.sourceRepository.update(source.id, { indexStatus: "INDEXED" });
  }

  @OnWorkerEvent("failed")
  async onFailed(job: Job<Source>, error: Error) {
    this.logger.log(error);
    
    const source = job.data;
    await this.sourceRepository.update(source.id, { indexStatus: "ERROR", indexError: error.message });
  }
}
