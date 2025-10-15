import { ChatFragment, Fragments } from '@/fragment';
import { OriginType } from '@memora/schemas';
import { RowData, SearchResultData } from '@zilliz/milvus2-sdk-node';

import { MilvusService } from '../base';
import { chatFields, chatFunctions, chatIndexSchema } from './chat-schemas';

export class MilvusChatVectorStoreService extends MilvusService<ChatFragment> {
  constructor() {
    super(ChatFragment, "chat", chatFields, chatFunctions, chatIndexSchema)
  }

  fragmentToChunk(c: ChatFragment | ChatFragment[] | Fragments<ChatFragment>): RowData[] {
    const fragments = this.toFragments(c);

    return fragments.map<RowData>(c => ({
      id: c.id,
      seqId: c.metadata.type === OriginType.FILE ? c.seqId : undefined,
      content: c.content,
      role: c.role,
      chatId: c.chatId,
      knowledgeId: c.knowledgeId,
      tenantId: c.tenantId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
        seqId: c.seqId,
        knowledgeId: c.knowledgeId,
        metadata: c.metadata,
        tenantId: c.tenantId,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }))
    );
  }

  async searchLastNMessages(chatId: string, n: number): Promise<Fragments<ChatFragment>> {
    const filter = `chatId == "${chatId}"`;

    const result = await this.client.search({
      collection_name: this.collectionName,
      filter,
      order_by: 'seqId desc',
      topk: n,
    });

    return this.searchResultToFragment(result.results);
  }
}