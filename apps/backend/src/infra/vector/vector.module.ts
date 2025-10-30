import { Module } from '@nestjs/common';

import { LLMManagerModule } from '../llm-manager/llm-manager.module';
import { ChatVectorStoreService } from './chat-vector-store.service';
import { MilvusChatVectorStoreService } from './milvus/chat/chat-vector-store.service';
import { MilvusSourceVectorStoreService } from './milvus/source/source-vector-store.service';
import { SourceVectorStoreService } from './source-vector-store.service';

@Module({
  imports: [LLMManagerModule],
  exports: [SourceVectorStoreService, ChatVectorStoreService],
  providers: [
    {
      provide: SourceVectorStoreService,
      useClass: MilvusSourceVectorStoreService
    },
    {
      provide: ChatVectorStoreService,
      useClass: MilvusChatVectorStoreService
    }
  ]
})
export class VectorModule {}
