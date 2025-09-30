import { MemoryModule } from "@/modules/memory/memory.module";
import { Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge.module";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [MemoryModule, KnowledgeModule],
})
export class SearchModule {}
