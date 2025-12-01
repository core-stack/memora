import { Queue } from "bullmq";
import { EntityManager } from "typeorm";

import { JobType } from "@/jobs/types";
import { Service } from "@/shared/service";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";

import { KnowledgeEntity } from "../../entities/knowledge.entity";
import { CreateKnowledgeDto } from "./dto/create-knowledge.dto";
import { KnowledgeLLMEntity, LLMEntity, LLMType } from "@/entities";

@Injectable()
export class KnowledgeService extends Service<KnowledgeEntity> {
  logger = new Logger(KnowledgeService.name);
  entity = KnowledgeEntity;

  @InjectQueue(JobType.DELETE_KNOWLEDGE) private readonly deleteKnowledgeQueue: Queue;

  override async create(input: CreateKnowledgeDto, manager?: EntityManager): Promise<KnowledgeEntity> {
    return await this.transaction(async (manager) => {
      const knowledge = await super.create(new KnowledgeEntity(input), manager);
      const defaultLLMs = await manager.getRepository(LLMEntity).find({
        where: { default: true, tenantId: input.tenantId }
      });

      if (defaultLLMs.length === 0) throw new NotFoundException("Default LLM not found");
      const embeddingLLM = defaultLLMs.find((llm) => llm.type === LLMType.EMBEDDING);
      const textLLM = defaultLLMs.find((llm) => llm.type === LLMType.TEXT);
      if (!embeddingLLM || !textLLM) throw new NotFoundException("Default LLM not found");

      await manager.getRepository(KnowledgeLLMEntity).save([
        new KnowledgeLLMEntity({
          default: true,
          knowledgeId: knowledge.id,
          llmId: embeddingLLM.id
        }),
        new KnowledgeLLMEntity({
          default: true,
          knowledgeId: knowledge.id,
          llmId: textLLM.id
        })
      ]);
      return knowledge;
    }, manager);
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
