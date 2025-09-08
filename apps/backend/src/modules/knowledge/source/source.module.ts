import { DatabaseModule } from "@/infra/database/database.module";
import { StorageModule } from "@/infra/storage/storage.module";
import { IngestModule } from "@/jobs/ingest/ingest.module";
import { Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge.module";

import { SourceController } from "./source.controller";
import { SourceRepository } from "./source.repository";
import { SourceService } from "./source.service";

@Module({
  controllers: [SourceController],
  providers: [SourceService, SourceRepository],
  imports: [DatabaseModule, KnowledgeModule, StorageModule.register(), IngestModule],
  exports: [SourceService],
})
export class SourceModule {}
