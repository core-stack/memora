import { Queue } from "bullmq";
import { EntityManager } from "typeorm";

import { JobType } from "@/jobs/types";
import { Service } from "@/shared/service";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

import { KnowledgeEntity } from "../../entities/knowledge.entity";

@Injectable()
export class KnowledgeService extends Service<KnowledgeEntity> {
  logger = new Logger(KnowledgeService.name);
  entity = KnowledgeEntity;

  @InjectQueue(JobType.DELETE_KNOWLEDGE) private readonly deleteKnowledgeQueue: Queue;

  override async delete(id: string, manager?: EntityManager): Promise<void> {
    const knowledge = await this.repository(manager).findOneOrFail({ where: { id } });
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    await this.deleteKnowledgeQueue.add(
      JobType.DELETE_KNOWLEDGE,
      knowledge,
      { backoff: { type: "exponential", delay: 1000 } }
    );
  }

  async increaseFileCount(knowledgeId: string, count: number = 1, manager?: EntityManager): Promise<boolean> {
    const res = await this.repository(manager).increment({ id: knowledgeId }, "files", count);
    return !!res.affected && res.affected > 0;
  }

  async increaseStorageCount(
    knowledgeId: string,
    count: number = 1,
    manager?: EntityManager
  ): Promise<boolean> {
    const res = await this.repository(manager).increment({ id: knowledgeId }, "storage", count);
    return !!res.affected && res.affected > 0;
  }
}
