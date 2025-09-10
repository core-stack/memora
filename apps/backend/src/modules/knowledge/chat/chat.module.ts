import { DatabaseModule } from "@/infra/database/database.module";
import { StorageModule } from "@/infra/storage/storage.module";
import { IngestModule } from "@/jobs/ingest/ingest.module";
import { forwardRef, Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge.module";

import { ChatController } from "./chat.controller";
import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  imports: [DatabaseModule, KnowledgeModule, StorageModule.register(), forwardRef(() => IngestModule)],
  exports: [ChatService, ChatRepository],
})
export class ChatModule {}
