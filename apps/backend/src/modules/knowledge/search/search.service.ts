import { HttpContext } from "@/generics/http-context";
import { MemoryService } from "@/modules/memory/memory.service";
import { Injectable } from "@nestjs/common";

import { KnowledgeService } from "../knowledge.service";

@Injectable()
export class SearchService {
  constructor(
    private knowledgeService: KnowledgeService,
    private memoryService: MemoryService,
  ) {}

  async searchByTerm(ctx: HttpContext) {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(ctx);
    const query = ctx.query.shouldGetString("query");
    return (await this.memoryService.findByTerm(knowledgeId, query)).toArray();
  }

}
