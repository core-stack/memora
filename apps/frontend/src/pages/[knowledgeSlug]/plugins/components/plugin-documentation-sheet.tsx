import { Download, ExternalLink } from 'lucide-react';

import { MarkdownViewer } from '@/components/markdown-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { DialogType } from '@/dialogs';
import { env } from '@/env';
import { useDialog } from '@/hooks/use-dialog';

import type { PluginRegistry } from "@memora/schemas";
interface PluginDocumentationSheetProps {
  plugin: PluginRegistry | null
  isOpen: boolean
  onClose: () => void
}

export function PluginDocumentationSheet({ plugin, isOpen, onClose }: PluginDocumentationSheetProps) {
  const url = `${env.STORAGE_URL}/plugins/${plugin?.name}/documentation.md`;
  const { openDialog } = useDialog();
  const handleInstall = () => openDialog({ type: DialogType.INSTALL_PLUGIN, props: { plugin } });

  if (!plugin) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
              <img
                src={`${env.STORAGE_URL}/plugins/${plugin.name}/${plugin.iconPath ?? "icon.png"}`}
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
          <ScrollArea className="h-[calc(100vh-300px)]">
            <MarkdownViewer url={url} />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
