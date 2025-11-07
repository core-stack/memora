import { Queue } from 'bullmq';

import { HttpContext } from '@/generics/http-context';
import { ServiceOptions } from '@/generics/service.interface';
import { GenericTenantService } from '@/generics/tenant.service';
import { JobType } from '@/jobs/types';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateKnowledge, Knowledge, UpdateKnowledge } from '@snipet/schemas';

import { CreateKnowledgeEntity, KnowledgeEntity, UpdateKnowledgeEntity } from './knowledge.entity';
import { KnowledgeRepository } from './knowledge.repository';

@Injectable()
export class KnowledgeService extends GenericTenantService<
  Knowledge, CreateKnowledge, UpdateKnowledge,
  KnowledgeEntity, CreateKnowledgeEntity, UpdateKnowledgeEntity
> {
  logger = new Logger(KnowledgeService.name);
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
    return super.create(input as CreateKnowledgeEntity, opts);
  }

  override update(id: string, input: UpdateKnowledge, opts?: ServiceOptions): Promise<void> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.update(id, {
      ...input,
      status: "OK"
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
