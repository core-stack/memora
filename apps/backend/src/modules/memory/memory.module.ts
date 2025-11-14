import { CacheModule } from '@/infra/cache/cache.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../knowledge/knowledge.module';
import { ChatMemoryModule } from './chat-memory/chat-memory.module';
import { SourceMemoryModule } from './source-memory/source-memory.module';

@Module({
  imports: [
    VectorModule,
    KnowledgeModule,
    LLMModule,
    CacheModule,
    ChatMemoryModule,
    SourceMemoryModule
  ],
  exports: [
    ChatMemoryModule,
    SourceMemoryModule
  ]
})
export class MemoryModule {}
