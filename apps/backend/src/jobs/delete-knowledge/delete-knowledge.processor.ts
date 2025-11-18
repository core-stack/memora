import { Job } from 'bullmq';
import { DataSource } from 'typeorm';

import { KnowledgeEntity, KnowledgeStatus } from '@/entities/knowledge.entity';
import { LLMType } from '@/entities/llm.entity';
import { StorageDeleteError } from '@/infra/storage/errors/delete-error';
import { PrivateStorageService } from '@/infra/storage/private-storage.service';
import { ChatVectorStoreService } from '@/infra/vector/chat-vector-store.service';
import { SourceVectorStoreService } from '@/infra/vector/source-vector-store.service';
import { KnowledgeService } from '@/modules/knowledge/knowledge.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject, Logger } from '@nestjs/common';

import { JobType } from '../types';
import { SourceEntity } from '@/entities';

@Processor(JobType.DELETE_KNOWLEDGE, { concurrency: 10 })
export class DeleteKnowledgeProcessor extends WorkerHost {
  private logger = new Logger(DeleteKnowledgeProcessor.name);

  constructor(
    @Inject(forwardRef(() => KnowledgeService)) private readonly knowledgeService: KnowledgeService,
    private readonly sourceVectorStore: SourceVectorStoreService,
    private readonly chatVectorStore: ChatVectorStoreService,
    private readonly storageService: PrivateStorageService,
    private readonly dataSource: DataSource
  ) { super(); }

  async process(job: Job<KnowledgeEntity>) {
    const { id: knowledgeId, tenantId } = job.data;
    const knowledge = await this.knowledgeService.findByID(knowledgeId, { relations: ['knowledgeLLMs.llm'] });
    if (!knowledge) return;
    const knEmbeddings = knowledge.knowledgeLLMs.find(kllm => kllm.default && kllm.llm.type === LLMType.EMBEDDING);
    if (!knEmbeddings) return;
    job.updateProgress(10);
    // delete data in vector store
    await this.sourceVectorStore.deleteByFilter(knEmbeddings.llmId, {});
    job.updateProgress(30);

    await this.chatVectorStore.deleteByFilter(knEmbeddings.llmId, {});
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
    await this.dataSource.getRepository(KnowledgeEntity).delete({ id: knowledgeId });
    job.updateProgress(100);
  }

  @OnWorkerEvent("active")
  async onStart(job: Job<KnowledgeEntity>) {
    this.logger.log("ingest started");
    const knowledge = job.data;
    await this.knowledgeService.update(knowledge.id, { status: KnowledgeStatus.DELETING });
  }

  @OnWorkerEvent("failed")
  async onFailed(job: Job<KnowledgeEntity>) {
    const source = job.data;
    await this.knowledgeService.update(source.id,
      {
        status: KnowledgeStatus.DELETE_ERROR,
        deleteError: "Error deleting knowledge, try again"
      }
    );
  }
}
