import { DatabaseModule } from '@/infra/database/database.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../knowledge.module';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  imports: [
    DatabaseModule,
    KnowledgeModule,
    StorageModule.register(),
    LLMModule,
    PromptModule
  ],
  exports: [ChatService, ChatRepository],
})
export class ChatModule {}
