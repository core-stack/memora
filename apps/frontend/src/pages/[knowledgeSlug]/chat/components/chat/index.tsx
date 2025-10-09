import { useApiQuery } from '@/hooks/use-api-query';
import { cn } from '@/lib/utils';

import { ChatInput } from './input';
import { ChatMessagesArea } from './messages-area';

export const Chat = ({ chatId }: { chatId?: string }) => {
  const { data: chat } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/chat/:id",
    { method: "GET", params: { id: chatId ?? "" }, enabled: !!chatId }
  );
  return (
    <div className={cn("flex-1 h-full flex flex-col bg-background", !chat && "justify-center")}>
      { chat && <ChatMessagesArea chatId={chatId} /> }
      <ChatInput chatId={chatId} />
    </div>
  )
}