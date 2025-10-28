import { Job } from 'bullmq';

import { StorageDeleteError } from '@/infra/storage/errors/delete-error';
import { PrivateStorageService } from '@/infra/storage/private-storage.service';
import { ChatVectorStoreService } from '@/infra/vector/chat-vector-store.service';
import { SourceVectorStoreService } from '@/infra/vector/source-vector-store.service';
import { KnowledgeRepository } from '@/modules/knowledge/knowledge.repository';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Knowledge, Source } from '@snipet/schemas';

import { IngestProcessor } from '../ingest/ingest.processor';
import { JobType } from '../types';

@Processor(JobType.DELETE_KNOWLEDGE, { concurrency: 5 })
export class DeleteKnowledgeProcessor extends WorkerHost {
  private logger = new Logger(IngestProcessor.name);

  constructor(
    @Inject(forwardRef(() => KnowledgeRepository)) private readonly knowledgeRepository: KnowledgeRepository,
    private readonly sourceVectorStore: SourceVectorStoreService,
    private readonly chatVectorStore: ChatVectorStoreService,
    private readonly storageService: PrivateStorageService
  ) { super(); }

  async process(job: Job<Knowledge>) {
    const { id: knowledgeId, tenantId } = job.data;
    const knowledge = await this.knowledgeRepository.findByID(knowledgeId);
    if (!knowledge) return;
    job.updateProgress(10);
    // delete data in vector store
    await this.sourceVectorStore.delete({ knowledgeId });
    job.updateProgress(30);

    await this.chatVectorStore.delete({ knowledgeId });
    job.updateProgress(50);

    // delete files in storage
    try {
      await this.storageService.delete(`source/${tenantId}/${knowledgeId}`, true);
      job.updateProgress(90);
    } catch (error) {
      if (error instanceof StorageDeleteError) {
        console.error(error);
      }
      throw error;
    }

    // delete knowledge in database
    await this.knowledgeRepository.delete(knowledgeId);
    job.updateProgress(100);
  }

  @OnWorkerEvent("active")
  async onStart(job: Job<Source>) {
    this.logger.log("ingest started");
    const knowledge = job.data;
    await this.knowledgeRepository.update(knowledge.id, { status: "DELETING" });
  }

  @OnWorkerEvent("failed")
  async onFailed(job: Job<Source>) {
    const source = job.data;
    await this.knowledgeRepository.update(source.id, { status: "DELETE_ERROR", deleteError: "Error deleting knowledge, try again" });
  }
}
