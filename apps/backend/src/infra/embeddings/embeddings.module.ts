import { env } from '@/env';
import { Embeddings } from '@langchain/core/embeddings';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Module } from '@nestjs/common';

@Module({
  providers: [{
    provide: Embeddings,
    useFactory: () => new GoogleGenerativeAIEmbeddings({ apiKey: env.GEMINI_API_KEY, model: env.EMBEDDING_MODEL }),
  }],
  exports: [ Embeddings ]
})
export class EmbeddingsModule {}
