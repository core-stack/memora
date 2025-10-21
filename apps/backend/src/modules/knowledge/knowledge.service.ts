import { Queue } from 'bullmq';

import { env } from '@/env';
import { CrudService } from '@/generics';
import { HttpContext } from '@/generics/http-context';
import { JobType } from '@/jobs/types';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKnowledge, Knowledge, UpdateKnowledge } from '@snipet/schemas';

import { KnowledgeRepository } from './knowledge.repository';

@Injectable()
export class KnowledgeService extends CrudService<Knowledge, CreateKnowledge, UpdateKnowledge> {
  constructor(
    protected readonly repository: KnowledgeRepository,
    @InjectQueue(JobType.DELETE_KNOWLEDGE) private readonly deleteKnowledgeQueue: Queue    
  ) {
    super(repository);
  }

  async findBySlug(slug: string): Promise<Knowledge | null> {
    return this.repository.findBySlug(slug);
  }

  async loadFromSlug(context: HttpContext): Promise<Knowledge> {
    const knowledgeSlug = context.params.shouldGetString("knowledgeSlug");
    const knowledge = await this.findBySlug(knowledgeSlug);
    if (!knowledge) throw new BadRequestException("Knowledge not found");
    return knowledge;
  }

  override create(input: CreateKnowledge): Promise<Knowledge> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.create({
      ...input,
      tenantId: env.TENANT_ID
    });
  }

  override update(id: string, input: UpdateKnowledge): Promise<void> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.update(id, {
      ...input,
      tenantId: env.TENANT_ID
    });
  }

  override async delete(id: string): Promise<void> {
    const knowledge = await this.repository.findByID(id);
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    await this.deleteKnowledgeQueue.add(JobType.DELETE_KNOWLEDGE, knowledge, { backoff: { type: "exponential", delay: 1000 } });
  }

  increaseFileCount(knowledgeId: string, count: number = 1) {
    return this.repository.increment(knowledgeId, "files", count);
  }

  increaseStorageCount(knowledgeId: string, count: number = 1) {
    return this.repository.increment(knowledgeId, "storage", count);
  }
}
