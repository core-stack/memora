"use client"

import type React from "react"

import { Bot, FileText, Paperclip, Puzzle, Send, User, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

import type { Chat } from "@memora/schemas";

interface ChatInterfaceProps {
  chat: Chat | null
  selectedSources: SelectedSource[]
  onSendMessage: (content: string, sources: SelectedSource[]) => void
  onSelectReference: (reference: FileReference) => void
  onOpenSourceSelector: () => void
}

export function ChatInterface({
  chat,
  selectedSources,
  onSendMessage,
  onSelectReference,
  onOpenSourceSelector,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const messageContent = message.trim()
    setMessage("")
    setIsLoading(true)

    try {
      await onSendMessage(messageContent, selectedSources)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Select a Chat</h3>
          <p className="text-sm">Choose a chat from the sidebar or create a new one to start</p>
        </div>
      </div>
    )
  }

  const fileSources = selectedSources.filter((s) => s.type !== "plugin")
  const pluginSources = selectedSources.filter((s) => s.type === "plugin")

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm p-4">
        <h2 className="text-lg font-semibold text-foreground text-balance">{chat.name}</h2>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {chat.messages.map((msg) => (
            <div key={msg.id} className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground border-primary/20"
                      : "bg-card text-card-foreground border-border"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</span>
                </div>

                <div className="prose prose-sm max-w-none text-foreground">
                  <div className="whitespace-pre-wrap leading-relaxed text-pretty">{msg.content}</div>
                </div>

                {/* References */}
                {msg.references && msg.references.length > 0 && (
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
                )}
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

      {/* Input Area */}
      <div className="border-t border-border bg-card/30 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Selected Sources */}
          {(fileSources.length > 0 || pluginSources.length > 0) && (
            <div className="space-y-2">
              {fileSources.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-muted-foreground">Files:</span>
                  {fileSources.map((source, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-card/50 border-border/50">
                      <FileText className="h-3 w-3 mr-1" />
                      {source.name}
                    </Badge>
                  ))}
                </div>
              )}

              {pluginSources.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-muted-foreground">Plugins:</span>
                  {pluginSources.map((source, index) => (
                    <Badge
                      key={index}
                      variant={source.pluginInfo?.forceUse ? "default" : "secondary"}
                      className="text-xs bg-card/50 border-border/50"
                    >
                      <Puzzle className="h-3 w-3 mr-1" />
                      {source.name}
                      {source.pluginInfo?.forceUse && <Zap className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSourceSelector}
              className="flex-shrink-0 bg-card/50 border-border/50 hover:bg-accent/50"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                className="min-h-[44px] max-h-32 resize-none pr-12 bg-card/50 border-border/50 focus:bg-card/70"
                disabled={isLoading}
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
