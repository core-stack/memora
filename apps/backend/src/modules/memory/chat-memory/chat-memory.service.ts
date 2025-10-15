import { ChatFragment, Fragments } from '@/fragment';
import { ChatVectorStoreService } from '@/infra/vector/chat-vector-store.service';
import { Message } from '@memora/schemas';
import { Injectable, Logger } from '@nestjs/common';

export type ChatSearchOptions = {
  lastNMessages?: number;
  searchQuery?: string | { topK?: number, query: string };
  filters?: Record<string, string | number | boolean>;
}

export type WithChatSearchOptions = (currentOpts: Partial<ChatSearchOptions>) =>  Partial<ChatSearchOptions>;


@Injectable()
export class ChatMemoryService {
  private readonly logger = new Logger(ChatMemoryService.name);
  
  constructor(
    private readonly chatVectorStore: ChatVectorStoreService
  ) {}
  
  private async messageToFragment(message: Message): Promise<ChatFragment> {
    const fragments = await this.chatVectorStore.search(
      ChatVectorStoreService.withChatId(message.chatId)
    );

    return ChatFragment.fromObject({
      id: message.id,
      chatId: message.chatId,
      content: message.content,
      createdAt: message.createdAt,
      knowledgeId: message.knowledgeId,
      role: message.messageRole,
      tenantId: message.tenantId,
      seqId: fragments.length,
      metadata: {},
      updatedAt: message.updatedAt
    });
  }

  async add(message: Message) {
    await this.chatVectorStore.addFragments(await this.messageToFragment(message));
  }

  async remove(message: Message) {
    await this.chatVectorStore.deleteFragments(await this.messageToFragment(message));
  }

  async search(chatId: string, ...opts: WithChatSearchOptions[]) {
    const options = this.buildChatSearchOptions(...opts);
    const response: { lastNMessages: Fragments<ChatFragment>, searchQuery: Fragments<ChatFragment> } = {
      lastNMessages: Fragments.fromFragmentArray([]),
      searchQuery: Fragments.fromFragmentArray([]),
    }
    if (options.lastNMessages) {
      response.lastNMessages = await this.chatVectorStore.searchLastNMessages(chatId, options.lastNMessages);
    }
    if (options.searchQuery) {
      const withQuery = await this.chatVectorStore.search(
        ChatVectorStoreService.withChatId(chatId),
        ChatVectorStoreService.withQuery(options.searchQuery),
        options.filters && ChatVectorStoreService.withFilters(options.filters)
      )
      response.searchQuery = withQuery;
    }
    return response;
  }



  static withFilters(filters: Record<string, string | number | boolean>): WithChatSearchOptions {
    return (currentOpts: Partial<ChatSearchOptions>) => {
      return { ...currentOpts, filters: { ...currentOpts.filters, ...filters } };
    }
  }

  static withLastNMessages(lastNMessages: number): WithChatSearchOptions {
    return (currentOpts: Partial<ChatSearchOptions>) => {
      return { ...currentOpts, lastNMessages };
    }
  }

  static withSearchQuery(searchQuery: string): WithChatSearchOptions {
    return (currentOpts: Partial<ChatSearchOptions>) => {
      return { ...currentOpts, searchQuery };
    }
  }

  protected buildChatSearchOptions(...opts: WithChatSearchOptions[]) {
    let searchOpts: ChatSearchOptions = { };
    for (const opt of opts) {
      searchOpts = { ...searchOpts, ...opt(searchOpts) };
    }

    return searchOpts;
  }
}
