import type { Chat, ChatFilter, CreateChat, UpdateChat } from "@snipet/schemas";

export interface ChatRoutes {
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/chat": {
    GET: {
      query: ChatFilter;
      params: { tenantId: string, knowledgeSlug: string };
      response: Chat[];
    },
    POST: {
      body: CreateChat;
      params: { tenantId: string, knowledgeSlug: string };
      response: Chat;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/chat/:id": {
    GET: {
      params: { tenantId: string, knowledgeSlug: string, id: string };
      response: Chat;
    },
    PUT: {
      body: UpdateChat;
      params: { tenantId: string, knowledgeSlug: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { tenantId: string, knowledgeSlug: string, id: string };
      response: undefined;
    }
  },
}