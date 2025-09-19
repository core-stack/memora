import { EmbeddingsModule } from '@/infra/embeddings/embeddings.module';
import { LLMModule } from '@/infra/llm/llm.module';
import { VectorModule } from '@/infra/vector/vector.module';
import { Module } from '@nestjs/common';

import { KnowledgeModule } from '../knowledge/knowledge.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [VectorModule, EmbeddingsModule, KnowledgeModule, LLMModule],
})
export class SearchModule {}
