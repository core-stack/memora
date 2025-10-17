import React, { createContext } from 'react';

import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useParams } from '@/hooks/use-params';
import { useRouter } from '@/hooks/use-router';

import type { Chat, Message } from '@snipet/schemas';
type ChatContextType = {
  chat?: Chat;
  loadingChat: boolean;
  loadingMessages: boolean;
  messages: Array<Message & { streaming?: boolean }>;
  sendMessage: (message: string) => Promise<void>;
  createChat: (initialMessage: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);
type ChatProviderProps = {
  children: React.ReactNode;
  chatId?: string;
}

export const ChatProvider = ({ children, chatId }: ChatProviderProps) => {
  const { chatId: routerChatId, knowledgeSlug } = useParams<{ knowledgeSlug: string, chatId?: string }>();
  chatId = chatId ?? routerChatId;

  const invalidate = useApiInvalidate();
  
  const router = useRouter();
  const { data: messages = [], isLoading: loadingMessages, optimisticUpdate } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/chat/:chatId/message",
    { method: "GET", enabled: !!chatId }
  );

  const { data: chat, isLoading: loadingChat } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/chat/:id",
    { method: "GET", params: { id: chatId ?? "" }, enabled: !!chatId }
  );

  const { mutate: createChatMutation } = useApiMutation(
    "/api/knowledge/:knowledgeSlug/chat",
    { method: "POST" }
  );
  const { mutate: sendChatMessage } = useApiMutation(
    "/api/knowledge/:knowledgeSlug/chat/:chatId/message/new",
    { method: "POST" }
  )

  const sendMessage = async (message: string, chatId?: string) => {
    console.log(chatId);
    
    optimisticUpdate((prev) => {
      if (!prev) return [];
      return [
        ...prev,
        {
          chatId: chatId ?? chat?.id ?? "",
          content: message,
          knowledgeId: chat?.knowledgeId ?? "",
          tenantId: chat?.tenantId ?? "",
          messageRole: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          id: crypto.randomUUID()
        },
        {
          streaming: true,
          chatId: chatId ?? chat?.id ?? "",
          content: "",
          knowledgeId: chat?.knowledgeId ?? "",
          tenantId: chat?.tenantId ?? "",
          messageRole: "AI",
          createdAt: new Date(),
          updatedAt: new Date(),
          id: crypto.randomUUID(),
        }
      ]
    });

    sendChatMessage({ body: { content: message }, params: chatId ? { chatId } : undefined }, {
      onSuccess: () => {
        invalidate("/api/knowledge/:knowledgeSlug/chat/:chatId/message");
      }
    });
  }

  const createChat = async (initialMessage: string) => {
    createChatMutation({ body: { name: "" } },
      {
        onSuccess: (data) => {
          router.replace(`/${knowledgeSlug}/chat/${data.id}`);
          invalidate('/api/knowledge/:knowledgeSlug/chat');
          sendMessage(initialMessage, data.id);
        }
      }
    )
  }

  return (
    <ChatContext.Provider value={{
      chat,
      loadingChat,
      createChat,
      messages,
      loadingMessages,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  return React.useContext(ChatContext);
}