import moment from 'moment';

import { Fragments, SourceFragment } from '@/fragment';
import { CacheService } from '@/infra/cache/cache.service';
import { LLMService } from '@/infra/llm/llm.service';
import { PromptService } from '@/infra/prompt/prompt.service';
import { SourceVectorStoreService } from '@/infra/vector/source-vector-store.service';
import { KnowledgeService } from '@/modules/knowledge/knowledge.service';
import { PluginService } from '@/modules/plugin/plugin.service';
import { PluginManagerService } from '@/plugin-registry/plugin-manager.service';
import { mergeBy } from '@/utils/array';
import { buildOptions } from '@/utils/build-options';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import type { Recent } from "@snipet/schemas";
export type FindOptions = {
  knowledgeId: string;
  userInput: string;
  metadata?: Record<string, any>;
  forceUsePlugins?: string[]; // list of plugin ids
  excludePlugins?: string[]; // list of plugin ids
}

export type Finder = (...args: any[]) => Partial<FindOptions>;


@Injectable()
export class SourceMemoryService {
  private readonly logger = new Logger(SourceMemoryService.name);

  constructor(
    private readonly vectorStore:      SourceVectorStoreService,
    private readonly knowledgeService: KnowledgeService,
    private readonly llmService:       LLMService,
    private readonly pluginManager:    PluginManagerService,
    private readonly pluginService:    PluginService,
    private readonly cacheService:     CacheService,
    private readonly promptService: PromptService
  ) {}

  private buildFindOptions(knowledgeId: string, userInput: string, ...opts: Finder[]): FindOptions {
    return buildOptions({ knowledgeId, userInput }, opts);
  }

  async find(knowledgeId: string, userInput: string, ...options: Finder[]): Promise<Fragments<SourceFragment>> {
    const opts = this.buildFindOptions(knowledgeId, userInput, ...options);
    // get knowledge
    const knowledge = await this.knowledgeService.findByID(knowledgeId);
    if (!knowledge) throw new NotFoundException("Knowledge not found");


    // heat up plugins
    const forcedPlugins = opts.forceUsePlugins ? await this.pluginService.findByIDList(opts.forceUsePlugins) : [];
    const relevantPlugins = await this.pluginService.getRelevantPlugins(userInput, knowledgeId, knowledge.instructions);
    const plugins = mergeBy("id", forcedPlugins, relevantPlugins).filter(p => !opts.excludePlugins?.includes(p.id));
    await this.pluginManager.preloadPlugins(plugins);

    const fragments = new Fragments<SourceFragment>();

    for (const p of plugins) {
      const pluginResponse = await this.pluginManager.executeFromQuery<string>(p, userInput);
      this.logger.debug(`Plugin ${p.pluginRegistry} response: ${pluginResponse}`);
    }

    return fragments.merge(await this.vectorStore.search(
      knowledgeId,
      SourceVectorStoreService.withFilters({ ...opts.metadata }),
      SourceVectorStoreService.withDense({ query: userInput, topK: 100 }),
      SourceVectorStoreService.withSparse({ query: userInput, topK: 100 }),
      SourceVectorStoreService.withTopK(10),
    ));
  }

  private async findFragmentsInCache(knowledgeId: string, userInput: string): Promise<SourceFragment[] | null> {
    const key = encodeURIComponent(userInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase());
    return this.cacheService.get<SourceFragment[]>(`fragments:${key}`, { namespace: knowledgeId });
  }

  private async saveFragmentsInCache(knowledgeId: string, userInput: string, fragments: SourceFragment[]) {
    const key = encodeURIComponent(userInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase());
    await this.cacheService.set<SourceFragment[]>(
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

  async findByTerm(knowledgeId: string, userInput: string): Promise<Fragments<SourceFragment>> {
    this.logger.verbose("Finding fragments by term");
    await this.saveInputToRecents(knowledgeId, userInput);

    const cachedFragments = await this.findFragmentsInCache(knowledgeId, userInput);
    if (cachedFragments) {
      this.logger.verbose("Found fragments in cache");
      return Fragments.fromFragmentArray(cachedFragments);
    }

    const fragments = await this.vectorStore.search(
      knowledgeId,
      SourceVectorStoreService.withSparse(userInput),
      SourceVectorStoreService.withTerm(userInput),
    );
    this.logger.verbose(fragments);
    await this.saveFragmentsInCache(knowledgeId, userInput, fragments.toArray());
    return fragments;
  }

  async findRecent(knowledgeId: string) {
    return this.cacheService.get<string[]>("recent", { namespace: knowledgeId });
  }

  static withMetadata(metadata: Record<string, any>): Finder {
    return prev => ({ ...prev, metadata });
  }
  static withExcludePlugins(plugins: string[]): Finder {
    return prev => ({ ...prev, excludePlugins: plugins });
  }
  static withForceUsePlugins(plugins: string[]): Finder {
    return prev => ({ ...prev, forceUsePlugins: plugins });
  }
}
