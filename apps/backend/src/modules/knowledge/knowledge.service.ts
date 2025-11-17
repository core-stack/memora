import { Queue } from 'bullmq';
import { EntityManager } from 'typeorm';

import { JobType } from '@/jobs/types';
import { Service } from '@/shared/service';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { KnowledgeEntity } from '../../entities/knowledge.entity';

@Injectable()
export class KnowledgeService extends Service<KnowledgeEntity> {
  logger = new Logger(KnowledgeService.name);
  entity = KnowledgeEntity;

  @InjectQueue(JobType.DELETE_KNOWLEDGE) private readonly deleteKnowledgeQueue: Queue

  async findBySlug(slug: string, tenantId: string, manager?: EntityManager): Promise<KnowledgeEntity | null> {
    return this.repository(manager).findOne({
      where: { slug, tenantId },
    });
  }

  async loadFromSlug(): Promise<KnowledgeEntity> {
    const knowledgeSlug = this.context.params.shouldGetString("knowledgeSlug");
    const knowledge = await this.findBySlug(knowledgeSlug, this.context.params.shouldGetString("tenantId"));
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    return knowledge;
  }

  override async delete(id: string, manager?: EntityManager): Promise<void> {
    const knowledge = await this.repository(manager).findOneOrFail({ where: { id } });
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    await this.deleteKnowledgeQueue.add(
      JobType.DELETE_KNOWLEDGE,
      knowledge,
      { backoff: { type: "exponential", delay: 1000 } }
    );
  }

  increaseFileCount(knowledgeId: string, count: number = 1, manager?: EntityManager) {
    return this.repository(manager).increment({ id: knowledgeId }, "files", count);
  }

  increaseStorageCount(knowledgeId: string, count: number = 1, manager?: EntityManager) {
    return this.repository(manager).increment({ id: knowledgeId }, "storage", count);
  }
}
