import { useEffect, useRef } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { useChat } from './context';
import { ChatMessage } from './message';

export const ChatMessagesArea = () => {
  const { messages, loadingMessages: isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, messagesEndRef]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className='space-y-4'>
          {
            !isLoading && messages && messages.length > 0 &&
            messages.map((msg) => (
              <ChatMessage {...msg} key={msg.id} />
            ))
          }
        </div>

        {/* {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-card text-card-foreground border border-border flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">AI Assistant</span>
                <span className="text-xs text-muted-foreground">typing...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )} */}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}