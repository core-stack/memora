import { CacheModule } from '@/infra/cache/cache.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { MessageModule } from '@/modules/knowledge/chat/message/message.module';
import { KnowledgeModule } from '@/modules/knowledge/knowledge.module';
import { forwardRef, Module } from '@nestjs/common';

import { ChatMemoryService } from './chat-memory.service';

@Module({
  providers: [ChatMemoryService],
  imports: [
    VectorModule,
    CacheModule.register("chat-memory"),
    KnowledgeModule,
    PromptModule,
    forwardRef(() => MessageModule)
  ],
  exports: [ChatMemoryService]
})
export class ChatMemoryModule {}
