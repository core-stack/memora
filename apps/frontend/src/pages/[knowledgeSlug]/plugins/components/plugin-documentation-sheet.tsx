"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import type { PluginRegistry } from "@memora/schemas"

interface PluginDocumentationSheetProps {
  plugin: PluginRegistry | null
  isOpen: boolean
  onClose: () => void
  onInstall: (plugin: PluginRegistry) => void
}

export function PluginDocumentationSheet({ plugin, isOpen, onClose, onInstall }: PluginDocumentationSheetProps) {
  const [documentation, setDocumentation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (plugin?.documentationPath && isOpen) {
      setIsLoading(true)
      setError(null)

      fetch(plugin.documentationPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch documentation")
          }
          return response.text()
        })
        .then((text) => {
          setDocumentation(text)
        })
        .catch((err) => {
          setError("Failed to load documentation")
          console.error("Error fetching documentation:", err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [plugin?.documentationPath, isOpen])

  if (!plugin) return null

  const handleInstall = () => {
    onInstall(plugin)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
              <img
                src={plugin.iconPath || "/placeholder.svg?height=48&width=48&query=plugin+icon"}
                alt={`${plugin.displayName || plugin.name} icon`}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-semibold text-balance">
                {plugin.displayName || plugin.name}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground mt-1">{plugin.description}</SheetDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{plugin.type}</Badge>
                <Badge variant="outline">v{plugin.version}</Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Install Plugin
            </Button>
            {plugin.documentationPath && (
              <Button variant="outline" asChild>
                <a
                  href={plugin.documentationPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documentation</h3>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading documentation...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!isLoading && !error && documentation && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {/* <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mt-5 mb-3 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium mt-4 mb-2 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>,
                  code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs">{children}</pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-sm text-muted-foreground">{children}</li>,
                }}
              >
                {documentation}
              </ReactMarkdown> */}
            </div>
          )}

          {!isLoading && !error && !documentation && plugin.documentationPath && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No documentation content available.</p>
            </div>
          )}

          {!plugin.documentationPath && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No documentation available for this plugin.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
