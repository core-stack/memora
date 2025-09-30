import { Download, ExternalLink, FileText, Package, Tag, Trash2 } from 'lucide-react';

import { MarkdownViewer } from '@/components/markdown-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DialogType } from '@/dialogs';
import { env } from '@/env';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDialog } from '@/hooks/use-dialog';

import { useSource } from '../../hooks/use-source';

export function PluginDocs() {
  const { plugin } = useSource();
  const url = `${env.STORAGE_URL}/plugins/${plugin?.name}/documentation.md`;
  const { openDialog } = useDialog();

  const { data: installedPlugins = [] } = useApiQuery("/api/plugin", { method: "GET" });
  const isInstalled = installedPlugins.some((installedPlugin) => installedPlugin.pluginRegistry === plugin?.name);
  
  const handleInstall = () => openDialog({ type: DialogType.INSTALL_PLUGIN, props: { plugin } });
  const handleUninstall = () => openDialog({ type: DialogType.INSTALL_PLUGIN, props: { plugin } });

  if (!plugin) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Plugin Header */}
      <div className="border-b border-border bg-card/30 p-6">
        <div className="flex items-start gap-4">
          {plugin.iconPath && (
            <img
              src={plugin.iconPath || "/placeholder.svg"}
              alt={plugin.displayName || plugin.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground">{plugin.displayName || plugin.name}</h1>
              {isInstalled && (
                <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Package className="h-3 w-3 mr-1" />
                  Installed
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">{plugin.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>v{plugin.version}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{plugin.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <Button variant="destructive" onClick={handleUninstall}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Uninstall
                </Button>
              ) : (
                <Button onClick={handleInstall}>
                  <Download className="h-4 w-4 mr-2" />
                  Install Plugin
                </Button>
              )}
              {plugin.documentationPath && (
                <Button variant="outline" asChild>
                  <a href={plugin.documentationPath} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="flex-1 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">Documentation</h2>
          <Separator />
        </div>

        <ScrollArea className="h-[calc(100vh-400px)]">
          <MarkdownViewer url={url} />
        </ScrollArea>
      </div>
    </div>
  )
}
