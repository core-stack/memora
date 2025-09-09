import { VectorModule } from "@/infra/vector/vector.module";
import { Module } from "@nestjs/common";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [VectorModule]
})
export class SearchModule {}
