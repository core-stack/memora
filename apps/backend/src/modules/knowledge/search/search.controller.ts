import { Controller } from '@/shared/controller/decorators';
import { Get } from '@nestjs/common';

import { SearchService } from './search.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchByTerm() {
    return this.searchService.searchByTerm();
  }

  @Get("recent")
  async searchRecent() {
    return this.searchService.recent();
  }
}
