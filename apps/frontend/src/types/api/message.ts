import type { Message, MessageFilter, CreateMessage, UpdateMessage, StreamMessage } from "@snipet/schemas";

export interface MessageRoutes {
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/chat/:chatId/message": {
    GET: {
      query: MessageFilter;
      params: { tenantId: string, knowledgeSlug: string, chatId: string };
      response: Message[];
    },
    POST: {
      body: CreateMessage;
      params: { knowledgeSlug: string, chatId: string };
      response: Message;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/chat/:chatId/message/new": {
    POST: {
      body: CreateMessage;
      params: Partial<{ tenantId: string, knowledgeSlug: string, chatId: string }>;
      response: { userMessage: Message; aiMessage: Message; };
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/chat/:chatId/message/stream": {
    POST: {
      params: { tenantId: string, knowledgeSlug: string, chatId: string };
      query: StreamMessage;
    }
  },
  "/api/tenant/:tenantId/knowledge/:knowledgeSlug/chat/:chatId/message/:id": {
    PUT: {
      body: UpdateMessage;
      params: { tenantId: string, knowledgeSlug: string, chatId: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { tenantId: string, knowledgeSlug: string, chatId: string, id: string };
      response: undefined;
    }
  },
}