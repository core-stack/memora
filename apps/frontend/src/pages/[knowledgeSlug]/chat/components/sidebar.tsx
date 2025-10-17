"use client"

import { Calendar, MessageSquare, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { If } from '@/components/if';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useApiQuery } from '@/hooks/use-api-query';
import { useParams } from '@/hooks/use-params';
import { useRouter } from '@/hooks/use-router';
import { cn } from '@/lib/utils';
import { DateFormat, formatDate } from '@/utils/format';

export function ChatSidebar() {
  const { knowledgeSlug, chatId } = useParams<{ knowledgeSlug: string, chatId?: string }>();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("")
  const { data: chats = [], isLoading } = useApiQuery("/api/knowledge/:knowledgeSlug/chat", { method: "GET" });

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const onNewChat = () => {
    router.replace(`/${knowledgeSlug}/chat`);
  }

  const onSelectChat = (chatId: string) => {
    router.push(`/${knowledgeSlug}/chat/${chatId}`);
  }

  return (
    <div className="w-full overflow-hidden bg-card/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Chats</h2>
          <Button size="sm" onClick={onNewChat} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="p-2 space-y-1 h-full">
        <If condition={isLoading}>
          <div>
            {
              Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className='h-10 w-full mb-2'/>
              ))
            }
          </div>
        </If>
        <If condition={!isLoading}>
          {filteredChats.map((chat) => {
            const isSelected = chatId === chat.id

            return (
              <TooltipProvider key={chat.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      key={chat.id}
                      className={cn(
                        "flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
                        isSelected && "bg-accent border border-accent-foreground/20"
                      )}
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <h3 className="font-medium text-sm text-foreground truncate overflow-hidden whitespace-nowrap flex-1 min-w-0">
                        {chat.name}
                      </h3>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="font-medium text-sm text-foreground flex-1 mr-2">{chat.name}</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Calendar className="h-3 w-3" />
                        {formatDate(chat.updatedAt, DateFormat.lll)}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </If>
        <If condition={!isLoading && filteredChats.length === 0}>
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">{searchQuery ? "No chats found" : "No chats yet"}</p>
            {!searchQuery && (
              <Button variant="ghost" size="sm" onClick={onNewChat} className="mt-2 text-xs">
                Create your first chat
              </Button>
            )}
          </div>
        </If>
      </ScrollArea>
    </div>
  )
}
