"use client"

import { Calendar, MessageSquare, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from '@/hooks/use-params';
import { DateFormat, formatDate } from '@/utils/format';

import type { Chat } from "@memora/schemas";
export function ChatSidebar() {
  const { chatId } = useParams<{ chatId?: string }>();
  
  const [searchQuery, setSearchQuery] = useState("")
  const [chats] = useState<Chat[]>([])

  // Filter chats based on search
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const onNewChat = () => {

  }
  const onSelectChat = () => {

  }

  return (
    <div className="w-full bg-card/30 flex flex-col h-full">
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
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredChats.map((chat) => {
            const isSelected = chatId === chat.id

            return (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                  isSelected ? "bg-accent border border-accent-foreground/20" : "bg-card/50 hover:bg-accent/30"
                }`}
                onClick={onSelectChat}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm text-foreground truncate flex-1 mr-2">{chat.name}</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Calendar className="h-3 w-3" />
                    {formatDate(chat.updatedAt, DateFormat.lll)}
                  </div>
                </div>
              </div>
            )
          })}

          {filteredChats.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">{searchQuery ? "No chats found" : "No chats yet"}</p>
              {!searchQuery && (
                <Button variant="ghost" size="sm" onClick={onNewChat} className="mt-2 text-xs">
                  Create your first chat
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
