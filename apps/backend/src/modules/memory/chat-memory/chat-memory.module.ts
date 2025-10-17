import { CacheModule } from '@/infra/cache/cache.module';
import { EmbeddingsModule } from '@/infra/embeddings/embeddings.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { KnowledgeModule } from '@/modules/knowledge/knowledge.module';
import { Module } from '@nestjs/common';

import { ChatMemoryService } from './chat-memory.service';

@Module({
  providers: [ChatMemoryService],
  imports: [
    VectorModule,
    CacheModule.register("chat-memory"),
    LLMModule,
    EmbeddingsModule,
    KnowledgeModule,
    PromptModule
  ],
  exports: [ChatMemoryService]
})
export class ChatMemoryModule {}
