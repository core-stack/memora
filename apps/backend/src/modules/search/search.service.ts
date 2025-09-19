import { HttpContext } from '@/generics/http-context';
import { LLMService } from '@/infra/llm/llm.service';
import { VectorStore } from '@/infra/vector/vector-store.service';
import { PluginManagerService } from '@/plugin-registry/plugin-manager.service';
import { Embeddings } from '@langchain/core/embeddings';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge/knowledge.service';
import { PluginService } from '../plugin/plugin.service';

@Injectable()
export class SearchService {
  constructor(
    private vectorStore: VectorStore,
    private embeddings: Embeddings,
    private knowledgeService: KnowledgeService,
    private llmService: LLMService,
    private pluginManager: PluginManagerService,
    private pluginService: PluginService
  ) {}

  async search(ctx: HttpContext) {
    const knowledge = await this.knowledgeService.loadFromSlug(ctx);
    const knowledgeId = knowledge.id;
    const query = await this.llmService.improveQuery(ctx.query.shouldGetString("query"), knowledge.description);
    
    const plugins = await this.pluginService.getRelevantPlugins(query, knowledgeId, knowledge.description);
    await this.pluginManager.preloadPlugins(plugins);
    let context = "";
     
    for (const p of plugins) {
      context += await this.pluginManager.executeFromQuery<string>(p, query);
    }

    const queryEmbedding = await this.embeddings.embedQuery(query);
    const store = await this.vectorStore.search(queryEmbedding, knowledgeId, {});

    return this.vectorStore.search(queryEmbedding, knowledgeId, {});
  }
}
