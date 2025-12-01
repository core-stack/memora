import { EntityManager } from "typeorm";

import { LLMEntity } from "@/entities/llm.entity";
import { env } from "@/env";
import { LLMManagerService } from "@/infra/llm-manager/llm-manager.service";
import { EmbeddingProvider } from "@/infra/llm-manager/provider/embedding/base";
import { TextProvider } from "@/infra/llm-manager/provider/text/base";
import { SecurityService } from "@/infra/security/security.service";
import { Service } from "@/shared/service";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";

import { KnowledgeLLMEntity } from "../../entities/knowledge-llm.entity";
import { KnowledgeEntity } from "../../entities/knowledge.entity";
import { KnowledgeService } from "../knowledge/knowledge.service";
import { CreateLLMDto } from "./dto/create-llm.dto";

@Injectable()
export class LLMService extends Service<LLMEntity> {
  logger = new Logger(LLMService.name);
  entity = LLMEntity;

  @Inject() manager: LLMManagerService;
  @Inject() private readonly securityService: SecurityService;
  @Inject() private readonly knowledgeService: KnowledgeService;

  async findByKnowledge(knowledgeId: string, manager?: EntityManager): Promise<KnowledgeLLMEntity[]> {
    const knowledge = await this.knowledgeService.findUnique({
      where: { id: knowledgeId },
      relations: [ "knowledgeLLMs.llm" ]
    }, manager);
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    const llms = knowledge.knowledgeLLMs ?? [];
    for (const kLLM of llms) {
      const preset = this.manager.getPresets().find(preset => preset.config.model === kLLM.llm?.model);
      if (!preset) throw new NotFoundException("Model not found");
      if (!kLLM.llm) {
        this.logger.warn(`LLM not found for knowledge ${knowledgeId}`);
        continue;
      }
      const config = kLLM.llm.config;
      await Promise.all(Object.entries(config).map(async ([ key, value ]) => {
        const isSecret = preset.fields?.[key] === "secret-string";
        if (isSecret) {
          config[key] = await this.securityService.decrypt(value as any, env.ENCRYPT_MASTER_PASSWORD);
        }
      }));
    }
    return llms;
  }

  async getInstanceByKnowledge(
    entityOrId: string | KnowledgeEntity,
    type: "EMBEDDING",
    manager?: EntityManager
  ): Promise<EmbeddingProvider | null>
  async getInstanceByKnowledge(
    entityOrId: string | KnowledgeEntity,
    type: "TEXT",
    manager?: EntityManager
  ): Promise<TextProvider | null>
  async getInstanceByKnowledge(
    entityOrId: string | KnowledgeEntity,
    type: "EMBEDDING" | "TEXT",
    manager?: EntityManager
  ): Promise<EmbeddingProvider | TextProvider | null> {
    const knowledgeId = typeof entityOrId === "string" ? entityOrId : entityOrId.id;
    const llms = await this.findByKnowledge(knowledgeId, manager);
    const llm = llms.find(llm => llm.llm?.type === type && llm.default);
    if (!llm) return null;
    if (!llm.llm) return null;
    return this.manager.getInstance(llm.llm);
  }

  override async create(input: CreateLLMDto, manager?: EntityManager): Promise<LLMEntity> {
    const preset = this.manager.getPresets().find(preset => preset.key === input.key);
    if (!preset) throw new NotFoundException("Model not found");
    if (preset.config.model && typeof preset.config.model === "string") input.model = preset.config.model;
    await Promise.all(Object.entries(input.config).map(async ([ key, value ]) => {
      const isSecret = preset.fields?.[key] === "secret-string";
      if (isSecret) {
        input.config[key] = await this.securityService.encrypt(value as string, env.ENCRYPT_MASTER_PASSWORD);
      }
    }));

    return super.create(new LLMEntity(input), manager);
  }
}
