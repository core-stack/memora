import { LLMService } from '@/infra/llm/llm.service';
import { VectorStore } from '@/infra/vector/vector-store.service';
import { PluginManagerService } from '@/plugin-registry/plugin-manager.service';
import { mergeBy } from '@/utils/array';
import { Embeddings } from '@langchain/core/embeddings';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge/knowledge.service';
import { PluginService } from '../plugin/plugin.service';
import { Finder, FindOptions } from './find-options';
import { Fragment, Fragments, OriginType } from './fragment';

@Injectable()
export class MemoryService {

  constructor(
    private vectorStore: VectorStore,
    private embeddings: Embeddings,
    private knowledgeService: KnowledgeService,
    private llmService: LLMService,
    private pluginManager: PluginManagerService,
    private pluginService: PluginService
  ) {}

  private buildFindOptions(knowledgeId: string, userInput: string, ...opts: Finder[]): FindOptions {
    let findOpts: FindOptions = { knowledgeId, userInput }
    for (const opt of opts) {
      findOpts = { ...findOpts, ...opt(findOpts) };
    }
    return findOpts;
  }

  async find(knowledgeId: string, userInput: string, ...options: Finder[]): Promise<Fragments> {
    const opts = this.buildFindOptions(knowledgeId, userInput, ...options);
    const knowledge = await this.knowledgeService.findByID(knowledgeId);
    if (!knowledge) throw new Error("Knowledge not found");

    const query = await this.llmService.improveQuery(opts.userInput, knowledge.description);

    const forcedPlugins = opts.forceUsePlugins ? await this.pluginService.findByIDList(opts.forceUsePlugins) : [];
    const relevantPlugins = await this.pluginService.getRelevantPlugins(query, knowledgeId, knowledge.description);

    const plugins = mergeBy("id", forcedPlugins, relevantPlugins).filter(p => !opts.excludePlugins?.includes(p.id));
    await this.pluginManager.preloadPlugins(plugins);
    const fragments = new Fragments();

    for (const p of plugins) {
      const pluginResponse = await this.pluginManager.executeFromQuery<string>(p, query);
      fragments.push(new Fragment(OriginType.PLUGIN, p.id, pluginResponse, false, {}));
    }

    const queryEmbedding = await this.embeddings.embedQuery(query);
    const chunks = await this.vectorStore.search(queryEmbedding, knowledgeId, {});
    fragments.fromChunks(chunks);
    return fragments;
  }
}
