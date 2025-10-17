

import { cn } from '@/lib/utils';

import { useChat } from './context';
import { ChatInput } from './input';
import { ChatMessagesArea } from './messages-area';

export const ChatRoot = () => {
  const { chat } = useChat();
  
  return (
    <div className={cn("flex-1 h-full flex flex-col bg-background", !chat && "justify-center")}>
      { chat && <ChatMessagesArea /> }
      <ChatInput />
    </div>
  )
}