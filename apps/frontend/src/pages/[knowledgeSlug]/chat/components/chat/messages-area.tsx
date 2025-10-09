import { Bot, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useApiQuery } from '@/hooks/use-api-query';
import { DateFormat, formatDate } from '@/utils/format';

export const ChatMessagesArea = ({ chatId }: { chatId?: string }) => {
  const { data: messages, isLoading } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/chat/:chatId/message",
    { method: "GET", enabled: !!chatId }
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages?.map((msg) => (
          <div key={msg.id} className="flex gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  msg.messageRole === "USER"
                    ? "bg-primary text-primary-foreground border-primary/20"
                    : "bg-card text-card-foreground border-border"
                }`}
              >
                {msg.messageRole === "USER" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {msg.messageRole === "USER" ? "You" : "AI Assistant"}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt, DateFormat.lll)}</span>
              </div>

              <div className="prose prose-sm max-w-none text-foreground">
                <div className="whitespace-pre-wrap leading-relaxed text-pretty">{msg.content}</div>
              </div>

              {/* References */}
              {/* {msg.references && msg.references.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">References:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.references.map((ref, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 text-xs hover:bg-accent/50 bg-card/50 border-border/50"
                        onClick={() => onSelectReference(ref)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-32">{ref.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        ))}

        {isLoading && (
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
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}