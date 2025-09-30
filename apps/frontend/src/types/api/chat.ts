import type { Chat, ChatFilter, CreateChat, UpdateChat } from "@memora/schemas";

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
  "/api/knowledge/:knowledgeSlug/chat/:id": {
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