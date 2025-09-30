import { DatabaseModule } from "@/infra/database/database.module";
import { StorageModule } from "@/infra/storage/storage.module";
import { IngestModule } from "@/jobs/ingest/ingest.module";
import { forwardRef, Module } from "@nestjs/common";

import { KnowledgeModule } from "../../knowledge.module";

import { MessageController } from "./message.controller";
import { MessageRepository } from "./message.repository";
import { MessageService } from "./message.service";

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  imports: [DatabaseModule, KnowledgeModule, StorageModule.register(), forwardRef(() => IngestModule)],
  exports: [MessageService, MessageRepository],
})
export class MessageModule {}
