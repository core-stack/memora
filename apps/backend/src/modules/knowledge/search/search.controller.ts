import { HttpContext } from "@/generics/http-context";
import { Controller, Get, Req } from "@nestjs/common";

import { SearchService } from "./search.service";

import type { Request } from "express";

@Controller('knowledge/:knowledgeSlug/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("term")
  async searchByTerm(@Req() req: Request) {
    return this.searchService.searchByTerm(new HttpContext(req));
  }

  @Get("recent")
  async searchRecent(@Req() req: Request) {
    return this.searchService.searchRecent(new HttpContext(req));
  }
}
