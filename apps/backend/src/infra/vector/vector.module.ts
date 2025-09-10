import { Module } from '@nestjs/common';

import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { MilvusService } from './milvus';
import { VectorStore } from './vector-store.service';

@Module({
  imports: [EmbeddingsModule],
  providers: [{ 
    provide: VectorStore,
    useClass: MilvusService
  }],
  exports: [VectorStore],
})
export class VectorModule {}
