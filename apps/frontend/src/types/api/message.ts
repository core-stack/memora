import type { Message, MessageFilter, CreateMessage, UpdateMessage, StreamMessage } from "@memora/schemas";

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
  "/api/knowledge/:knowledgeSlug/chat/:chatId/message/new": {
    POST: {
      body: CreateMessage;
      params: { knowledgeSlug: string, chatId: string };
      response: { userMessage: Message; aiMessage: Message; };
    }
  },
  "/api/knowledge/:knowledgeSlug/chat/:chatId/message/stream": {
    POST: {
      params: { knowledgeSlug: string, chatId: string };
      query: StreamMessage;
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