import moment from 'moment';

import { ChatFragment, Fragments } from '@/fragment';
import { LLMManagerService } from '@/infra/llm-manager/llm-manager.service';
import { Injectable, Logger } from '@nestjs/common';
import { RowData, SearchResultData } from '@zilliz/milvus2-sdk-node';

import { MilvusService } from '../base';
import { chatFields, chatFunctions, chatIndexSchema } from './chat-schemas';

@Injectable()
export class MilvusChatVectorStoreService extends MilvusService<ChatFragment> {
  protected override logger = new Logger(MilvusChatVectorStoreService.name);
  constructor(llmManager: LLMManagerService) {
    super(llmManager, "chat", ChatFragment, chatFields, chatFunctions, chatIndexSchema)
  }

  fragmentToChunk(c: ChatFragment | ChatFragment[] | Fragments<ChatFragment>): RowData[] {
    const fragments = this.toFragments(c);

    return fragments.map<RowData>(c => ({
      id: c.id,
      content: c.content,
      role: c.role,
      chatId: c.chatId,
      knowledgeId: c.knowledgeId,
      tenantId: c.tenantId,
      createdAt: c.createdAt.getTime() ?? Date.now(),
      updatedAt: c.updatedAt.getTime() ?? Date.now(),
      metadata: c.metadata
    }));
  }

  searchResultToFragment(data: SearchResultData[]): Fragments<ChatFragment> {
    return Fragments.fromFragmentArray(
      data.map(c => new ChatFragment({
        id: c.id,
        content: c.content,
        chatId: c.chatId,
        role: c.role,
        knowledgeId: c.knowledgeId,
        metadata: c.metadata,
        tenantId: c.tenantId,
        createdAt: moment(Number(c.createdAt)).toDate(),
        updatedAt: moment(Number(c.updatedAt)).toDate(),
      }))
    );
  }

  async searchLastNMessages(chatId: string, n: number): Promise<Fragments<ChatFragment>> {
    const filter = `chatId == "${chatId}"`;

    const result = await this.client.search({
      collection_name: this.collectionName,
      filter,
      data: {},
      topk: n,
    });

    return this.searchResultToFragment(result.results);
  }
}