import { DatabaseModule } from '@/infra/database/database.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { MemoryModule } from '@/modules/memory/memory.module';
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
    LLMModule,
    MemoryModule,
    PromptModule,
    ChatModule
  ],
  exports: [MessageService],
})
export class MessageModule {}
