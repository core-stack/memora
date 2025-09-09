import { env } from '@/env';
import { Embeddings } from '@langchain/core/embeddings';
import { VectorStore } from '@langchain/core/vectorstores';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Module } from '@nestjs/common';

import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [EmbeddingsModule],
  providers: [{ 
    provide: VectorStore,
    inject: [Embeddings],
    useFactory: async (embeddings: Embeddings) => {
      return QdrantVectorStore.fromExistingCollection(embeddings, {
        url: env.QDRANT_URL,
        collectionName: env.QDRANT_COLLECTION,
      });
    }
  }],
  exports: [VectorStore],
})
export class VectorModule {}
