import { Module } from "@nestjs/common";

import { IngestModule } from "./modules/ingest/ingest.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { SearchModule } from "./modules/search/search.module";
import { DatabaseModule } from "./services/database/database.module";
import { PrismaModule } from "./services/prisma/prisma.module";
import { StorageModule } from "./services/storage/storage.module";

@Module({
  imports: [
    IngestModule,
    SearchModule,
    DatabaseModule,
    PrismaModule,
    StorageModule,
    KnowledgeModule
  ],
})
export class AppModule {}
