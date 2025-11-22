import { SourceFragment } from '@/fragment';
import { SourceMemoryService } from '@/modules/memory/source-memory/source-memory.service';
import { RecentSearch } from '@/modules/memory/source-memory/types';
import { GenericService } from '@/shared/generic-service';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SearchService extends GenericService {
  logger = new Logger(SearchService.name);

  @Inject() private memoryService: SourceMemoryService;

  async searchByTerm(knowledgeId: string, term: string): Promise<SourceFragment[]> {
    return (await this.memoryService.findByTerm(knowledgeId, term)).toArray();
  }

  async recent(knowledgeId: string): Promise<RecentSearch[]> {
    return this.memoryService.findRecent(knowledgeId);
  }
}
