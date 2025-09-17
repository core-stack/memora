import { HttpContext } from "@/generics/http-context";
import { Controller, Get, Req } from "@nestjs/common";

import { SearchService } from "./search.service";

import type { Request } from 'express';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(":knowledgeSlug")
  async search(@Req() req: Request) {
    const ctx = new HttpContext(req);
    return this.searchService.search(ctx);
  }
}
