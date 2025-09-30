"use client"

import type { SearchResult, RecentSearch, SearchSuggestion } from "./search-types"

export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "plugin-card.tsx",
    content: `import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plugin } from '@/lib/types'
import { Download, ExternalLink } from 'lucide-react'

interface PluginCardProps {
  plugin: Plugin
  onInstall: (plugin: Plugin) => void
  onViewDocs: (plugin: Plugin) => void
}

export function PluginCard({ plugin, onInstall, onViewDocs }: PluginCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <img src={plugin.icon || "/placeholder.svg"} alt={plugin.name} className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {plugin.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {plugin.type}
                </Badge>
                <span className="text-xs text-muted-foreground">v{plugin.version}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {plugin.description}
        </CardDescription>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => onInstall(plugin)}
            size="sm" 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button 
            onClick={() => onViewDocs(plugin)}
            variant="outline" 
            size="sm"
            className="border-border hover:bg-accent"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}`,
    filePath: "components/plugin-card.tsx",
    folder: "components",
    type: "file",
    matches: [
      {
        line: 15,
        text: "export function PluginCard({ plugin, onInstall, onViewDocs }: PluginCardProps) {",
        startIndex: 17,
        endIndex: 27,
      },
    ],
  },
  {
    id: "2",
    title: "chat-interface.tsx",
    content: `import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Paperclip, Settings } from 'lucide-react'
import { Message } from '@/lib/chat-types'
import { EnhancedSourceModal } from './enhanced-source-modal'

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string, sources: string[], plugins: string[]) => void
  onReferenceClick: (reference: string) => void
}

export function ChatInterface({ messages, onSendMessage, onReferenceClick }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])
  const [forcedPlugins, setForcedPlugins] = useState<string[]>([])
  const [showSourceModal, setShowSourceModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input, selectedSources, [...selectedPlugins, ...forcedPlugins])
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = \`\${textareaRef.current.scrollHeight}px\`
    }
  }

  const renderMessageContent = (content: string) => {
    // Simple reference detection - in a real app, this would be more sophisticated
    const referenceRegex = /\\[([^\\]]+)\\]/g
    const parts = content.split(referenceRegex)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a reference
        return (
          <button
            key={index}
            onClick={() => onReferenceClick(part)}
            className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium"
          >
            [{part}]
          </button>
        )
      }
      return part
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {message.role === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="text-foreground leading-relaxed">
                    {message.role === 'assistant' 
                      ? renderMessageContent(message.content)
                      : message.content
                    }
                  </div>
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.sources.map((source, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Selected Sources/Plugins Display */}
          {(selectedSources.length > 0 || selectedPlugins.length > 0 || forcedPlugins.length > 0) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedSources.map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
                >
                  📄 {source}
                </span>
              ))}
              {selectedPlugins.map((plugin) => (
                <span
                  key={plugin}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                >
                  🔌 {plugin}
                </span>
              ))}
              {forcedPlugins.map((plugin) => (
                <span
                  key={plugin}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs"
                >
                  ⚡ {plugin} (forced)
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-32 resize-none pr-20 bg-input border-border focus:border-ring"
                rows={1}
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSourceModal(true)}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim()}
              className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <EnhancedSourceModal
        open={showSourceModal}
        onOpenChange={setShowSourceModal}
        selectedSources={selectedSources}
        onSourcesChange={setSelectedSources}
        selectedPlugins={selectedPlugins}
        onPluginsChange={setSelectedPlugins}
        forcedPlugins={forcedPlugins}
        onForcedPluginsChange={setForcedPlugins}
      />
    </div>
  )
}`,
    filePath: "components/chat-interface.tsx",
    folder: "components",
    type: "file",
    matches: [
      {
        line: 15,
        text: "export function ChatInterface({ messages, onSendMessage, onReferenceClick }: ChatInterfaceProps) {",
        startIndex: 17,
        endIndex: 30,
      },
    ],
  },
]

export const mockRecentSearches: RecentSearch[] = [
  {
    id: "1",
    query: "plugin card",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    results: 5,
  },
  {
    id: "2",
    query: "chat interface",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    results: 3,
  },
  {
    id: "3",
    query: "button component",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    results: 8,
  },
]

export const mockSearchSuggestions: SearchSuggestion[] = [
  { id: "1", text: "plugin card", type: "suggestion", icon: "🔌" },
  { id: "2", text: "chat interface", type: "suggestion", icon: "💬" },
  { id: "3", text: "button component", type: "suggestion", icon: "🔘" },
  { id: "4", text: "modal dialog", type: "suggestion", icon: "📱" },
  { id: "5", text: "form validation", type: "suggestion", icon: "✅" },
  { id: "6", text: "api routes", type: "suggestion", icon: "🛣️" },
  { id: "7", text: "database schema", type: "suggestion", icon: "🗄️" },
  { id: "8", text: "authentication", type: "suggestion", icon: "🔐" },
]
