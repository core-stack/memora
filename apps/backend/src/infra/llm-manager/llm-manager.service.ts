import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { env } from '@/env';
import { LLMEntity } from '@/modules/llm/llm.entity';
import { LLMRepository } from '@/modules/llm/llm.repository';
import { __root } from '@/root';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LLMPreset, llmPresetSchema, LLMType } from '@snipet/schemas';

import { NotFoundError } from './errors/not-found.error';
import { LLMLoaderService } from './llm-loader.service';
import { EmbeddingProvider } from './provider/embedding/base';
import { TextProvider } from './provider/text/base';

@Injectable()
export class LLMManagerService {
  private readonly logger = new Logger(LLMManagerService.name);

  private presets: LLMPreset[] = [];

  instances: Map<string, { instance: EmbeddingProvider | TextProvider, lastUse: number }> = new Map();

  constructor(
    private readonly loader: LLMLoaderService,
    private readonly llmRepository: LLMRepository
  ) {}
  
  async onModuleInit() {
    try {
      const presetsPath = join(__root, 'dist', '@llm-presets');
      
      try {
        await readdir(presetsPath);
      } catch (dirError) {
        this.logger.warn(`Preset directory not found: ${presetsPath}`);
        this.presets = [];
        return;
      }
  
      const dir = await readdir(presetsPath);
      const presets: LLMPreset[] = [];
      
      for (const file of dir.filter((f) => f.endsWith('.json'))) {
        const filePath = join(presetsPath, file);
        try {
          const content = await readFile(filePath, 'utf8');
          const parsedData = JSON.parse(content);
          
          const validatedPresets = llmPresetSchema.array().parse(parsedData);
          presets.push(...validatedPresets);
        } catch (err) {
          this.logger.error(`Error loading preset ${file}:`, err);
        }
      }
      
      setTimeout(() => {
        this.presets = presets || [];
        this.logger.verbose(`LLM Manager inicializado com ${this.presets.length} presets`);
        this.presets.forEach(preset => {
          this.logger.verbose(`   - ${preset.name}`);
        });
      });
    } catch (err) {
      this.logger.error(err);
      this.presets = [];
    }
  }


  getPresets() {
    return this.presets.map(preset => ({ ...preset, iconPath: `${env.AWS_PUBLIC_BASE_URL}/${preset.iconPath}` }));
  }

  async getEmbeddingByKnowledge(knowledgeId: string) {
    const llms = await this.llmRepository.findByKnowledge(knowledgeId);
    const embeddingLLM = llms.find(llm => llm.type === "EMBEDDING");
    if (!embeddingLLM) return null;
    return this.getInstance("EMBEDDING", embeddingLLM);
  }

  getInstance(type: "EMBEDDING", llm: LLMEntity): Promise<EmbeddingProvider>
  getInstance(type: "TEXT", llm: LLMEntity): Promise<TextProvider>
  async getInstance(type: LLMType, llm: LLMEntity): Promise<EmbeddingProvider | TextProvider> {
    if (this.instances.has(llm.id)) return this.instances.get(llm.id)!.instance;

    const preset = this.presets.find(preset => preset.config.model === llm.model);
    if (!preset) throw new NotFoundError("LLM not found");
    
    const instance = await this.loader.load(llm, preset);
    this.addInstance(llm, instance);
    return instance;
  }

  private addInstance(llm: LLMEntity, instance: EmbeddingProvider | TextProvider) {
    this.instances.set(llm.id, { instance, lastUse: Date.now() });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupInstances() {
    this.logger.verbose(`Cleaning up instances...`);
    if (this.instances.size > env.LLM_INSTANCE_LIMIT) {
      this.logger.verbose(`Cleaning up ${this.instances.size - env.LLM_INSTANCE_LIMIT} instances...`);
      // remove most old usages
      this.instances = new Map(Array.from(this.instances).sort((a, b) => a[1].lastUse - b[1].lastUse).slice(0, env.LLM_INSTANCE_LIMIT));   
    }

    this.instances.forEach((instance, key) => {
      this.logger.verbose(`Checking instance ${key}...`);
      const instanceLifetime = Date.now() - instance.lastUse;
      const maxInstanceLifetime = env.LLM_INSTANCE_DURATION;
      if (instanceLifetime > maxInstanceLifetime) {
        this.logger.verbose(`Disposing instance ${key}...`);
        this.instances.get(key)?.instance.dispose();
        this.instances.delete(key);
        return;
      }
    });

    this.logger.verbose(`Done cleaning up instances...`);
  }
}