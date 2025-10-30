import { ChatFragment, Fragments } from '@/fragment';
import { ChatVectorStoreService } from '@/infra/vector/chat-vector-store.service';
import { buildOptions } from '@/utils/build-options';
import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@snipet/schemas';

export type ChatSearchOptions = {
  // lastNMessages?: number;
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
    return ChatFragment.fromObject({
      id: message.id,
      chatId: message.chatId,
      content: message.content,
      createdAt: message.createdAt,
      knowledgeId: message.knowledgeId,
      role: message.messageRole,
      tenantId: message.tenantId,
      metadata: {},
      updatedAt: message.updatedAt
    });
  }

  async add(message: Message) {
    await this.chatVectorStore.addFragments(message.knowledgeId, await this.messageToFragment(message));
  }

  async remove(message: Message) {
    await this.chatVectorStore.deleteFragments(message.knowledgeId, await this.messageToFragment(message));
  }

  async search(knowledgeId: string, chatId: string, ...opts: WithChatSearchOptions[]) {
    const options = this.buildChatSearchOptions(...opts);
    const response: { lastNMessages: Fragments<ChatFragment>, searchQuery: Fragments<ChatFragment> } = {
      lastNMessages: Fragments.fromFragmentArray([]),
      searchQuery: Fragments.fromFragmentArray([]),
    }
    // if (options.lastNMessages) {
    //   response.lastNMessages = await this.chatVectorStore.searchLastNMessages(chatId, options.lastNMessages);
    // }
    if (options.searchQuery) {
      const searchQuery = await this.chatVectorStore.search(
        knowledgeId,
        ChatVectorStoreService.withChatId(chatId),
        ChatVectorStoreService.withQuery(options.searchQuery),
        options.filters && ChatVectorStoreService.withFilters(options.filters)
      )
      response.searchQuery = searchQuery;
    }
    return response;
  }



  static withFilters(filters: Record<string, string | number | boolean>): WithChatSearchOptions {
    return (currentOpts: Partial<ChatSearchOptions>) => {
      return { ...currentOpts, filters: { ...currentOpts.filters, ...filters } };
    }
  }

  // static withLastNMessages(lastNMessages: number): WithChatSearchOptions {
  //   return (currentOpts: Partial<ChatSearchOptions>) => {
  //     return { ...currentOpts, lastNMessages };
  //   }
  // }

  static withSearchQuery(searchQuery: string): WithChatSearchOptions {
    return (currentOpts: Partial<ChatSearchOptions>) => {
      return { ...currentOpts, searchQuery };
    }
  }

  protected buildChatSearchOptions(...opts: WithChatSearchOptions[]) {
    return buildOptions<WithChatSearchOptions, ChatSearchOptions>({}, opts);
  }
}
