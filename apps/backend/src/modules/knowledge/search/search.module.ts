import { SourceMemoryModule } from "@/modules/memory/source-memory/source-memory.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge.module";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  controllers: [ SearchController ],
  providers: [ SearchService ],
  imports: [ SourceMemoryModule, KnowledgeModule, HTTPContextModule ]
})
export class SearchModule {}
