import { readdir } from 'fs/promises';
import { join } from 'path';
import { EntityManager } from 'typeorm';

import { env } from '@/env';
import { SecurityService } from '@/infra/security/security.service';
import { __root } from '@/root';
import { Service } from '@/shared/service';
import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { LLMPreset, llmPresetSchema } from '@snipet/schemas';

import { KnowledgeService } from '../knowledge/knowledge.service';
import { LLMEntity } from './llm.entity';

@Injectable()
export class LLMService extends Service<LLMEntity> implements OnModuleInit {
  logger = new Logger(LLMService.name);
  entity = LLMEntity;

  presets: LLMPreset[] = [];

  @Inject() private readonly securityService: SecurityService;
  @Inject() private readonly knowledgeService: KnowledgeService;


  async onModuleInit() {
    const presetsPath = join(__root, 'dist', '@llm-presets');
    const dir = await readdir(presetsPath);
    const presets = dir.filter((file) => file.endsWith(".json")).reduce<Array<LLMPreset>>((acc, file) => {
      const presets = require(`${presetsPath}/${file}`);
      return [...acc, ...presets];
    }, [] as LLMPreset[]);

    presets.forEach(preset => {
      try {
        llmPresetSchema.parse(preset);
      } catch (error) {
        console.error(`Invalid preset: ${JSON.stringify(preset)}`);
        console.error(error);
        throw error;
      }
    })

    this.presets = presets;
  }

  getPresets() {
    return this.presets.map(preset => ({ ...preset, iconPath: `${env.AWS_PUBLIC_BASE_URL}/${preset.iconPath}` }));
  }

  async findByKnowledge(knowledgeId: string, manager?: EntityManager): Promise<LLMEntity[]> {
    const knowledge = await this.knowledgeService.findUnique({ where: { id: knowledgeId }, relations: ['llms'] }, manager);
    if (!knowledge) throw new NotFoundException("Knowledge not found");
    const llms = knowledge.llms;
    for (const llm of llms) {
      const preset = this.presets.find(preset => preset.config.model === llm.model);
      if (!preset) throw new NotFoundException("Model not found");
      await Promise.all(Object.entries(llm.config).map(async ([key, value]) => {
        const isSecret = preset.fields?.[key] === "secret-string";
        if (isSecret) llm.config[key] = await this.securityService.decrypt(value as any, env.ENCRYPT_MASTER_PASSWORD);
      }))
    }
    return llms;
  }

  override async create(input: LLMEntity, manager?: EntityManager): Promise<LLMEntity> {
    const preset = this.presets.find(preset => preset.config.model === input.model);
    if (!preset) throw new NotFoundException("Model not found");
    await Promise.all(Object.entries(input.config).map(async ([key, value]) => {
      const isSecret = preset.fields?.[key] === "secret-string";
      if (isSecret) input.config[key] = await this.securityService.encrypt(value as string, env.ENCRYPT_MASTER_PASSWORD);
    }))

    return super.create(input, manager);
  }
}
