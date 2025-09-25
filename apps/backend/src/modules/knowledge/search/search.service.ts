import { HttpContext } from '@/generics/http-context';
import { MemoryService } from '@/modules/memory/memory.service';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';

@Injectable()
export class SearchService {
  constructor(
    private knowledgeService: KnowledgeService,
    private memoryService: MemoryService,
  ) {}

  async searchByTerm(ctx: HttpContext) {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(ctx);
    const text = ctx.query.shouldGetString("text");
    return (await this.memoryService.findByTerm(knowledgeId, text)).toArray();
  }

  async recent(ctx: HttpContext) {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug(ctx);
    return this.memoryService.findRecent(knowledgeId);
  }
}
