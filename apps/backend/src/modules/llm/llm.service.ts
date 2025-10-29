import { readdir } from 'fs/promises';
import { join } from 'path';

import { env } from '@/env';
import { FilterOptions } from '@/generics/filter-options';
import { HttpContext } from '@/generics/http-context';
import { SecurityService } from '@/infra/security/security.service';
import { __root } from '@/root';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateLLM, LLM, LLMPreset, llmPresetSchema, UpdateLLM } from '@snipet/schemas';

import { LLMRepository } from './llm.repository';
import { CrudService } from '@/generics';
import { CreateLLMEntity, LLMEntity, UpdateLLMEntity } from './llm.entity';
import { ServiceOptions } from '@/generics/service.interface';

@Injectable()
export class LLMService extends CrudService<
  LLM, CreateLLM, UpdateLLM,
  LLMEntity, CreateLLMEntity, UpdateLLMEntity
> implements OnModuleInit {
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
    const presets = (llmPresetSchema.array().array().parse(dir
      .filter((file) => file.endsWith(".json"))
      .map((file) => require(`${presetsPath}/${file}`))));

    this.presets = presets.flat();
  }

  getPresets() {
    return this.presets.map(preset => ({ ...preset, iconPath: `${env.AWS_PUBLIC_BASE_URL}/${preset.iconPath}` }));
  }

  override async find(filterOpts: FilterOptions<LLM>, opts?: ServiceOptions): Promise<LLM[]> {
    return (await this.repository.find(filterOpts, { tx: opts?.tx })).map(({ config: _, ...llm }) => (llm))
  }

  override async create(input: CreateLLM, opts?: ServiceOptions): Promise<LLM> {
    const preset = this.presets.find(preset => preset.config.model === input.model);
    if (!preset) throw new NotFoundException("LLM not found");
    await Promise.all(Object.entries(input.config).map(async ([key, value]) => {
      const isSecret = preset.fields?.[key] === "secret-string";
      if (isSecret) {
        input.config[key] = await this.securityService.encrypt(value, env.ENCRYPT_KEY_MASTER_PASSWORD);
      }
    }));

    return super.create(input, opts);
  }
}
