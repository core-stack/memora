import { DatabaseModule } from '@/infra/database/database.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../knowledge.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [
    DatabaseModule,
    KnowledgeModule,
    StorageModule,
    LLMModule,
    PromptModule
  ],
  exports: [ChatService],
})
export class ChatModule {}
