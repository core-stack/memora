import type { Chat, ChatFilter, CreateChat, CreateChatWithInitialMessage, UpdateChat } from "@memora/schemas";

export interface ChatRoutes {
  "/api/knowledge/:knowledgeSlug/chat": {
    GET: {
      query: ChatFilter;
      params: { knowledgeSlug: string };
      response: Chat[];
    },
    POST: {
      body: CreateChat;
      params: { knowledgeSlug: string };
      response: Chat;
    }
  },
  "/api/knowledge/:knowledgeSlug/chat/with-message": {
    POST: {
      body: CreateChatWithInitialMessage;
      params: { knowledgeSlug: string };
      response: Chat;
    }
  },
  "/api/knowledge/:knowledgeSlug/chat/:id": {
    GET: {
      params: { knowledgeSlug: string, id: string };
      response: Chat;
    },
    PUT: {
      body: UpdateChat;
      params: { knowledgeSlug: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { knowledgeSlug: string, id: string };
      response: undefined;
    }
  },
}