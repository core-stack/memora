import React, { createContext } from 'react';

import {
  chatQueryKeyFn, messageQueryKeyFn, useApiChatByID, useApiChatCreate, useApiMessage,
  useApiMessageNewMessage
} from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useParams } from '@/hooks/use-params';
import { useRouter } from '@/hooks/use-router';

import type {
  ChatEntity, KnowledgeEntity, MessageEntity, TenantEntity,
} from '@/gen';

type ChatContextType = {
  chat?: ChatEntity;
  loadingChat: boolean;
  loadingMessages: boolean;
  messages: Array<MessageEntity & { streaming?: boolean }>;
  sendMessage: (message: string) => Promise<void>;
  createChat: (initialMessage: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);
export type ChatProviderProps = {
  children: React.ReactNode;
  chatId?: string;
  tenant: TenantEntity;
  knowledge: KnowledgeEntity;
}

export const ChatProvider = ({ children, chatId, knowledge, tenant }: ChatProviderProps) => {
  const { chatId: routerChatId, knowledgeSlug } = useParams<{ knowledgeSlug: string, chatId?: string }>();
  const tenantId = tenant.id;
  const knowledgeId = knowledge.id;
  chatId = chatId ?? routerChatId;
  const invalidate = useApiInvalidate();

  const router = useRouter();
  const { data: messages = [], isLoading: loadingMessages } = useApiMessage(
    { chatId: chatId ?? "", knowledgeId, tenantId }, { query: { enabled: !!chatId } }
  );
  const { data: chat, isLoading: loadingChat } = useApiChatByID(
    { id: chatId ?? "", knowledgeId, tenantId }, { query: { enabled: !!chatId } }
  );

  const { mutate: createChatMutation } = useApiChatCreate();
  const { mutate: sendChatMessage } = useApiMessageNewMessage();

  const sendMessage = async (message: string, newChat?: ChatEntity) => {
    const c = newChat ?? chat;
    if (!c) {
      console.warn("Missing chat");
      return;
    }
    sendChatMessage({
      chatId: chatId ?? "", knowledgeId, tenantId,
      data: { content: message }
    }, {
      onSuccess: () => {
        invalidate(
          messageQueryKeyFn({ tenantId, knowledgeId, chatId: chatId ?? ""}),
          chatQueryKeyFn({ tenantId, knowledgeId })
        )
      }
    });
  }

  const createChat = async (initialMessage: string) => {
    createChatMutation({ knowledgeId, tenantId, data: { name: "" } },
      {
        onSuccess: async (data) => {
          router.replace(`/${knowledgeSlug}/chat/${data.id}`);
          await invalidate(chatQueryKeyFn({ tenantId, knowledgeId }));
          sendMessage(initialMessage, data);
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