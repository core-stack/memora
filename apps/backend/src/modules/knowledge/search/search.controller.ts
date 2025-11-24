import { SourceFragment } from "@/fragment";
import { RecentSearch } from "@/modules/memory/source-memory/types";
import { ErrorResponse } from "@/shared/controller";
import { ApiResponses, Controller, HttpGet, HttpPost } from "@/shared/controller/decorators";
import { Param, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { SearchService } from "./search.service";

@Controller("tenant/:tenantId/knowledge/:knowledgeId/search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiResponses([
    { status: 200, description: "Records found successfully", type: SourceFragment, isArray: true },
    { status: 400, description: "Bad request", type: ErrorResponse },
    { status: 401, description: "Unauthorized", type: ErrorResponse },
    { status: 500, description: "Internal server error", type: ErrorResponse }
  ])
  @ApiQuery({ name: "term", required: true, type: String })
  @HttpPost()
  async byTerm(@Query("term") term: string, @Param("knowledgeId") knowledgeId: string) {
    return this.searchService.searchByTerm(knowledgeId, term);
  }


  @ApiResponses([
    { status: 200, description: "Records found successfully", type: RecentSearch, isArray: true },
    { status: 400, description: "Bad request", type: ErrorResponse },
    { status: 401, description: "Unauthorized", type: ErrorResponse },
    { status: 500, description: "Internal server error", type: ErrorResponse }
  ])
  @HttpGet("recent")
  async recent(@Param("knowledgeId") knowledgeId: string) {
    return this.searchService.recent(knowledgeId);
  }
}
