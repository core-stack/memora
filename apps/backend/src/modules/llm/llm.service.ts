import { readdir } from 'fs/promises';
import { join } from 'path';

import { env } from '@/env';
import { FilterOptions } from '@/generics/filter-options';
import { ServiceOptions } from '@/generics/service.interface';
import { GenericTenantService } from '@/generics/tenant.service';
import { SecurityService } from '@/infra/security/security.service';
import { __root } from '@/root';
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateLLM, LLM, LLMPreset, llmPresetSchema, UpdateLLM } from '@snipet/schemas';

import { CreateLLMEntity, LLMEntity, UpdateLLMEntity } from './llm.entity';
import { LLMRepository } from './llm.repository';

@Injectable()
export class LLMService extends GenericTenantService<
  LLM, CreateLLM, UpdateLLM,
  LLMEntity, CreateLLMEntity, UpdateLLMEntity
> implements OnModuleInit {
  logger = new Logger(LLMService.name);
  presets: LLMPreset[] = [];

  constructor(
    protected readonly repository: LLMRepository,
    private readonly securityService: SecurityService
  ) {
    super(repository);
  }

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

  async findByKnowledge(knowledgeId: string): Promise<LLMEntity[]> {
    const res = await this.repository.findByKnowledge(knowledgeId);
    for (const llm of res) {
      const preset = this.presets.find(preset => preset.config.model === llm.model);
      if (!preset) throw new NotFoundException("Model not found");
      await Promise.all(Object.entries(llm.config).map(async ([key, value]) => {
        const isSecret = preset.fields?.[key] === "secret-string";
        if (isSecret) llm.config[key] = await this.securityService.decrypt(value as any, env.ENCRYPT_MASTER_PASSWORD);
      }))
    }
    return res;
  }

  override async find(filterOpts: FilterOptions<LLM>, opts?: ServiceOptions): Promise<LLM[]> {
    return (await this.repository.find(filterOpts, { tx: opts?.tx })).map(({ config: _, ...llm }) => (llm))
  }

  override async create(input: CreateLLM, opts?: ServiceOptions): Promise<LLM> {
    const preset = this.presets.find(preset => preset.config.model === input.model);
    if (!preset) throw new NotFoundException("Model not found");
    await Promise.all(Object.entries(input.config).map(async ([key, value]) => {
      const isSecret = preset.fields?.[key] === "secret-string";
      if (isSecret) input.config[key] = await this.securityService.encrypt(value as string, env.ENCRYPT_MASTER_PASSWORD);
    }))

    return super.create(input, opts);
  }
}
