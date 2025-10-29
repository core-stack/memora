import { Queue } from 'bullmq';

import { env } from '@/env';
import { CrudService } from '@/generics';
import { HttpContext } from '@/generics/http-context';
import { JobType } from '@/jobs/types';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKnowledge, Knowledge, UpdateKnowledge } from '@snipet/schemas';

import { KnowledgeRepository } from './knowledge.repository';
import { ServiceOptions } from '@/generics/service.interface';
import { CreateKnowledgeEntity, KnowledgeEntity, UpdateKnowledgeEntity } from './knowledge.entity';

@Injectable()
export class KnowledgeService extends CrudService<
  Knowledge, CreateKnowledge, UpdateKnowledge,
  KnowledgeEntity, CreateKnowledgeEntity, UpdateKnowledgeEntity
> {
  constructor(
    protected readonly repository: KnowledgeRepository,
    @InjectQueue(JobType.DELETE_KNOWLEDGE) private readonly deleteKnowledgeQueue: Queue
  ) {
    super(repository);
  }

  async findBySlug(slug: string, opts?: ServiceOptions): Promise<KnowledgeEntity | null> {
    return this.repository.findBySlug(slug, { tx: opts?.tx });
  }

  async loadFromSlug(context?: HttpContext): Promise<KnowledgeEntity> {
    if (!context) throw new BadRequestException("http context is required");
    const knowledgeSlug = context.params.shouldGetString("knowledgeSlug");
    const knowledge = await this.findBySlug(knowledgeSlug, { http: context });
    if (!knowledge) throw new BadRequestException("Knowledge not found");
    return knowledge;
  }

  override create(input: CreateKnowledge, opts?: ServiceOptions): Promise<Knowledge> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.create({
      ...input,
      tenantId: env.TENANT_ID
    }, { tx: opts?.tx });
  }

  override update(id: string, input: UpdateKnowledge, opts?: ServiceOptions): Promise<void> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.update(id, {
      ...input,
      status: "OK",
      tenantId: env.TENANT_ID
    }, { tx: opts?.tx });
  }

  override async delete(id: string, opts?: ServiceOptions): Promise<void> {
    const knowledge = await this.repository.findByID(id, { tx: opts?.tx });
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    await this.deleteKnowledgeQueue.add(JobType.DELETE_KNOWLEDGE, knowledge, { backoff: { type: "exponential", delay: 1000 } });
  }

  increaseFileCount(knowledgeId: string, count: number = 1, opts?: ServiceOptions) {
    return this.repository.increment(knowledgeId, "files", count, { tx: opts?.tx });
  }

  increaseStorageCount(knowledgeId: string, count: number = 1, opts?: ServiceOptions) {
    return this.repository.increment(knowledgeId, "storage", count, { tx: opts?.tx });
  }
}
