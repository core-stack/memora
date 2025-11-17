import { DatabaseModule } from '@/infra/database/database.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { LLMModule } from '@/modules/llm/llm.module';
import { ChatMemoryModule } from '@/modules/memory/chat-memory/chat-memory.module';
import { SourceMemoryModule } from '@/modules/memory/source-memory/source-memory.module';
import { HTTPContextModule } from '@/shared/http-context/http-context.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../../knowledge.module';
import { ChatModule } from '../chat.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    DatabaseModule,
    KnowledgeModule,
    StorageModule,
    PromptModule,
    ChatModule,
    HTTPContextModule,
    LLMModule,
    ChatMemoryModule,
    SourceMemoryModule
  ],
  exports: [MessageService],
})
export class MessageModule {}
