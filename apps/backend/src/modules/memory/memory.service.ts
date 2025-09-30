import moment from 'moment';

import { Fragment, Fragments } from '@/fragment';
import { CacheService } from '@/infra/cache/cache.service';
import { LLMService } from '@/infra/llm/llm.service';
import { VectorStore } from '@/infra/vector/vector-store.service';
import { PluginManagerService } from '@/plugin-registry/plugin-manager.service';
import { mergeBy } from '@/utils/array';
import { Embeddings } from '@langchain/core/embeddings';
import { Injectable, Logger } from '@nestjs/common';

import { KnowledgeService } from '../knowledge/knowledge.service';
import { PluginService } from '../plugin/plugin.service';
import { Finder, FindOptions } from './find-options';

import type { Recent } from "@memora/schemas";

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);

  constructor(
    private vectorStore:      VectorStore,
    private embeddings:       Embeddings,
    private knowledgeService: KnowledgeService,
    private llmService:       LLMService,
    private pluginManager:    PluginManagerService,
    private pluginService:    PluginService,
    private cacheService:     CacheService
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
      this.logger.debug(`Plugin ${p.pluginRegistry} response: ${pluginResponse}`);
    }

    const queryEmbedding = await this.embeddings.embedQuery(query);
    return fragments.merge(await this.vectorStore.searchByEmbeddings(knowledgeId, queryEmbedding));
  }

  private async findFragmentsInCache(knowledgeId: string, userInput: string): Promise<Fragment[] | null> {
    const key = encodeURIComponent(userInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase());
    return this.cacheService.get<Fragment[]>(`fragments:${key}`, { namespace: knowledgeId });
  }

  private async saveFragmentsInCache(knowledgeId: string, userInput: string, fragments: Fragment[]) {
    const key = encodeURIComponent(userInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase());
    await this.cacheService.set<Fragment[]>(
      `fragments:${key}`,
      fragments,
      { namespace: knowledgeId, ttl: 60 * 5 } // expires cache in 5 minutes
    );
  }

  private async saveInputToRecents(knowledgeId: string, text: string) {
    const recents = (await this.cacheService.get<Recent[]>("recent", { namespace: knowledgeId })) ?? [];
    const index = recents.findIndex(p => p.text === text);
    if (index !== -1) {
      recents[index].count += 1;
      recents[index].lastUsed = new Date();
    } else {
      recents.push({ text, count: 1, lastUsed: new Date() });
    }
    recents.sort((a, b) => moment(b.lastUsed).valueOf() - moment(a.lastUsed).valueOf());
    while(recents.length > 5) recents.pop();

    await this.cacheService.set<Recent[]>("recent", recents, { namespace: knowledgeId });
  }

  async findByTerm(knowledgeId: string, userInput: string): Promise<Fragments> {
    await this.saveInputToRecents(knowledgeId, userInput);

    const cachedFragments = await this.findFragmentsInCache(knowledgeId, userInput);
    if (cachedFragments) {
      this.logger.verbose("Found fragments in cache");
      return Fragments.fromFragmentArray(cachedFragments);
    }

    const fragments = await this.vectorStore.searchByTerm(knowledgeId, userInput);
    await this.saveFragmentsInCache(knowledgeId, userInput, fragments.toArray());
    return fragments;
  }

  async findRecent(knowledgeId: string) {
    return this.cacheService.get<string[]>("recent", { namespace: knowledgeId });
  }
}
