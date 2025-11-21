import { ChatFragment, Fragments } from "@/fragment";

import { SearchOptions, VectorStore, WithSearchOptions } from "./vector-store.service";

export abstract class ChatVectorStoreService extends VectorStore<ChatFragment> {
  abstract searchLastNMessages(chatId: string, n: number): Promise<Fragments<ChatFragment>>;


  static withChatId(chatId: string): WithSearchOptions {
    return (currentOpts: Partial<SearchOptions>) => {
      return { ...currentOpts, filters: { ...currentOpts.filters, chatId } };
    };
  }
}
