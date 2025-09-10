import type { ChatFilter, CreateChat, UpdateChat } from "@memora/schemas";

export interface ChatRoutes {
  "/api/knowledge/:knowledgeSlug/chat": {
    GET: {
      query: ChatFilter;
      params: { knowledgeSlug: string };
    },
    POST: {
      body: CreateChat;
      params: { knowledgeSlug: string };
    }
  },
  "/api/knowledge/:knowledgeSlug/chat/:id": {
    PUT: {
      body: UpdateChat;
      params: { knowledgeSlug: string, id: string };
    },
    DELETE: { params: { knowledgeSlug: string, id: string }; }
  },
}