import { SourceMemoryService } from '@/modules/memory/source-memory/source-memory.service';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { GenericService } from '@/shared/generic-service';

@Injectable()
export class SearchService extends GenericService {
  logger = new Logger(SearchService.name);

  @Inject() private knowledgeService: KnowledgeService;
  @Inject() private memoryService: SourceMemoryService;

  async searchByTerm() {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    const text = this.context.query.shouldGetString("text");
    return (await this.memoryService.findByTerm(knowledgeId, text)).toArray();
  }

  async recent() {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    return this.memoryService.findRecent(knowledgeId);
  }
}
