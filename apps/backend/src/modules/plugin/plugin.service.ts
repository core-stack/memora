

import { CrudService } from '@/generics';
import { LLMService } from '@/infra/llm/llm.service';
import { Plugin } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgePluginRepository } from './knowledge-plugin.repository';
import { PluginRepository } from './plugin.repository';

@Injectable()
export class PluginService extends CrudService<Plugin> {
  constructor(
    repository: PluginRepository,
    private knowledgePluginRepository: KnowledgePluginRepository,
    private llmService: LLMService
  ) {
    super(repository);
  }

  async getRelevantPlugins(query: string, knowledgeId: string, knowledgeDescription: string): Promise<Plugin[]> {
    const plugins = await this.knowledgePluginRepository.findPluginByKnowledgeId(knowledgeId);
    return this.llmService.decidePluginsToUse(query, knowledgeDescription, plugins);
  }
}
