import { Module } from "@nestjs/common";

import { DatabaseModule } from "./infra/database/database.module";
import { RepositoryModule } from "./infra/repository/repository.module";
import { StorageModule } from "./infra/storage/storage.module";
import { IngestModule } from "./modules/ingest/ingest.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { SearchModule } from "./modules/search/search.module";
import { TagModule } from "./modules/tag/tag.module";

@Module({
  imports: [
    IngestModule,
    SearchModule,
    DatabaseModule,
    StorageModule,
    KnowledgeModule,
    RepositoryModule,
    TagModule
  ],
})
export class AppModule {}
