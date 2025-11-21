import React, { createContext } from 'react';

import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useParams } from '@/hooks/use-params';
import { useRouter } from '@/hooks/use-router';

import { chatQueryKeyFn, messageQueryKeyFn, useApiChatByID, useApiChatCreate, useApiMessage, useApiMessageNewMessage, type ChatEntity, type MessageEntity } from '@/gen';
type ChatContextType = {
  chat?: ChatEntity;
  loadingChat: boolean;
  loadingMessages: boolean;
  messages: Array<MessageEntity & { streaming?: boolean }>;
  sendMessage: (message: string) => Promise<void>;
  createChat: (initialMessage: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);
type ChatProviderProps = {
  children: React.ReactNode;
  chatId?: string;
  tenantId: string;
  knowledgeId: string;
}

export const ChatProvider = ({ children, chatId, knowledgeId, tenantId }: ChatProviderProps) => {
  const { chatId: routerChatId, knowledgeSlug } = useParams<{ knowledgeSlug: string, chatId?: string }>();
  chatId = chatId ?? routerChatId;

  const invalidate = useApiInvalidate();

  const router = useRouter();
  const { data: messages = [], isLoading: loadingMessages } = useApiMessage(
    tenantId, knowledgeId, chatId ?? "",
    { },
    { query: { enabled: !!chatId } }
  );

  const { data: chat, isLoading: loadingChat } = useApiChatByID(
    chatId ?? "", tenantId, knowledgeId,
    { query: { enabled: !!chatId } }
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
      chatId: chatId ?? "",
      knowledgeId,
      tenantId,
      data: { content: message }
    }, {
      onSuccess: () => {
        invalidate(
          messageQueryKeyFn(tenantId, knowledgeId, chatId ?? ""),
          chatQueryKeyFn(tenantId, knowledgeId)
        )
      }
    });
  }

  const createChat = async (initialMessage: string) => {
    createChatMutation({ knowledgeId, tenantId, data: { name: "" } },
      {
        onSuccess: async (data) => {
          router.replace(`/${knowledgeSlug}/chat/${data.id}`);
          await invalidate(chatQueryKeyFn(tenantId, knowledgeId));
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