import { HttpContext } from "@/generics/http-context";
import { VectorStore } from "@/infra/vector/vector-store.service";
import { PluginManagerService } from "@/plugin-registry/plugin-manager.service";
import { Embeddings } from "@langchain/core/embeddings";
import { Injectable } from "@nestjs/common";

import { KnowledgeService } from "../knowledge/knowledge.service";

@Injectable()
export class SearchService {
  constructor(
    private vectorStore: VectorStore,
    private embeddings: Embeddings,
    private knowledgeService: KnowledgeService,
    private pluginManager: PluginManagerService
  ) {}

  async search(ctx: HttpContext) {
    console.log("search");

    const knowledge = await this.knowledgeService.loadFromSlug(ctx);
    const knowledgeId = knowledge.id;
    const query = ctx.query.shouldGetString("query");
    console.log("query", query);

    const queryEmbedding = await this.embeddings.embedQuery(query);
    console.log("queryEmbedding", queryEmbedding);

    return this.vectorStore.search(queryEmbedding, knowledgeId, {});
  }
}
