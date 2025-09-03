import { Module } from "@nestjs/common";

import { IngestModule } from "./modules/ingest/ingest.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { SearchModule } from "./modules/search/search.module";
import { TagModule } from "./modules/tag/tag.module";
import { DatabaseModule } from "./services/database/database.module";
import { RepositoryModule } from "./services/repository/repository.module";
import { StorageModule } from "./services/storage/storage.module";

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
