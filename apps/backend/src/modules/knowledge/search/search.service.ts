import { SourceMemoryService } from "@/modules/memory/source-memory/source-memory.service";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { KnowledgeService } from "../knowledge.service";
import { GenericService } from "@/shared/generic-service";

@Injectable()
export class SearchService extends GenericService {
  logger = new Logger(SearchService.name);

  @Inject() private memoryService: SourceMemoryService;

  async searchByTerm() {
    const knowledgeId = this.context.params.shouldGetString("knowledgeId");
    const text = this.context.query.shouldGetString("text");
    return (await this.memoryService.findByTerm(knowledgeId, text)).toArray();
  }

  async recent() {
    return this.memoryService.findRecent(this.context.params.shouldGetString("knowledgeId"));
  }
}
