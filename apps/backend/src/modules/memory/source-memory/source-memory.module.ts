import { CacheModule } from '@/infra/cache/cache.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { PromptModule } from '@/infra/prompt/prompt.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { KnowledgeModule } from '@/modules/knowledge/knowledge.module';
import { PluginModule } from '@/modules/plugin/plugin.module';
import { Module } from '@nestjs/common';

import { SourceMemoryService } from './source-memory.service';

@Module({
  providers: [SourceMemoryService],
  imports: [
    VectorModule,
    CacheModule.register('source-memory'),
    KnowledgeModule,
    LLMModule,
    PluginModule,
    PromptModule
  ],
  exports: [SourceMemoryService],
})
export class SourceMemoryModule {}
