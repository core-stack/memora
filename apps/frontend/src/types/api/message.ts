import type { Message, MessageFilter, CreateMessage, UpdateMessage } from "@memora/schemas";

export interface MessageRoutes {
  "/api/knowledge/:knowledgeSlug/chat/:chatId/message": {
    GET: {
      query: MessageFilter;
      params: { knowledgeSlug: string, chatId: string };
      response: Message[];
    },
    POST: {
      body: CreateMessage;
      params: { knowledgeSlug: string, chatId: string };
      response: Message;
    }
  },
  "/api/knowledge/:knowledgeSlug/chat/:chatId/message/:id": {
    PUT: {
      body: UpdateMessage;
      params: { knowledgeSlug: string, chatId: string, id: string };
      response: undefined;
    },
    DELETE: {
      params: { knowledgeSlug: string, chatId: string, id: string };
      response: undefined;
    }
  },
}