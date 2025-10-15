import { Job } from 'bullmq';
import streamToBlob from 'stream-to-blob';

import { StorageService } from '@/infra/storage/storage.service';
import { SourceVectorStoreService } from '@/infra/vector/source-vector-store.service';
import { SourceRepository } from '@/modules/knowledge/source/source.repository';
import { Source } from '@memora/schemas';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';

import { ProcessorManager } from './processor-manager';

@Processor("ingest", { concurrency: 5 })
export class IngestProcessor extends WorkerHost {
  @Inject() private readonly processor!: ProcessorManager;
  @Inject() private readonly vectorStore!: SourceVectorStoreService;
  @Inject() private readonly storage!: StorageService;

  constructor(
    @Inject(forwardRef(() => SourceRepository)) private readonly sourceRepository: SourceRepository
  ) { super(); }

  async process(job: Job<Source>): Promise<any> {
    const source = job.data;

    const obj = await this.storage.getObject(source.key);
    if (!obj) throw new Error("File not found");

    await this.vectorStore.addFragments(
      await this.processor.process(source, await streamToBlob(obj))
    );
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
