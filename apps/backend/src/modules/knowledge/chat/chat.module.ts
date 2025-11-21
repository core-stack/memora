import { DatabaseModule } from "@/infra/database/database.module";
import { PromptModule } from "@/infra/prompt/prompt.module";
import { StorageModule } from "@/infra/storage/storage.module";
import { HTTPContextModule } from "@/shared/http-context/http-context.module";
import { Module } from "@nestjs/common";

import { KnowledgeModule } from "../knowledge.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  controllers: [ ChatController ],
  providers: [ ChatService ],
  imports: [
    DatabaseModule,
    StorageModule,
    PromptModule,
    HTTPContextModule
  ],
  exports: [ ChatService ]
})
export class ChatModule {}
