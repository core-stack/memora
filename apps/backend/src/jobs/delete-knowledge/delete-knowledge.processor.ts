import { Job } from 'bullmq';

import { StorageService } from '@/infra/storage/storage.service';
import { ChatVectorStoreService } from '@/infra/vector/chat-vector-store.service';
import { SourceVectorStoreService } from '@/infra/vector/source-vector-store.service';
import { KnowledgeRepository } from '@/modules/knowledge/knowledge.repository';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { Knowledge } from '@snipet/schemas';

import { JobType } from '../types';

@Processor(JobType.DELETE_KNOWLEDGE, { concurrency: 5 })
export class DeleteKnowledgeProcessor extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => KnowledgeRepository)) private readonly knowledgeRepository: KnowledgeRepository,
    private readonly sourceVectorStore: SourceVectorStoreService,
    private readonly chatVectorStore: ChatVectorStoreService,
    private readonly storageService: StorageService
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
    await this.storageService.delete(`source/${tenantId}/${knowledgeId}`, true);
    job.updateProgress(90);  
  
    // delete knowledge in database
    await this.knowledgeRepository.delete(knowledgeId);
    job.updateProgress(100);
  }
}
