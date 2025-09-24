import { Download, Package, Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DialogType } from '@/dialogs';
import { env } from '@/env';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { truncateText } from '@/lib/string';

import { useSource } from '../../hooks/use-source';

import type { PluginRegistry } from '@memora/schemas';
export const Plugins = () => {
  const { data: plugins = [] } = useApiQuery("/api/plugin-registry", { method: "GET", query: { filter: { type: "source" } } });
  const { data: installedPlugins = [] } = useApiQuery("/api/plugin", { method: "GET" });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { setPlugin, plugin: selectedPlugin } = useSource();
  const { openDialog } = useDialog();

  // Filter plugins based on search
  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plugin.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesSearch
  });

  const installedPluginsList = filteredPlugins.filter((plugin) => installedPlugins.some((installedPlugin) => installedPlugin.pluginRegistry === plugin.name));
  const availablePluginsList = filteredPlugins.filter((plugin) => installedPlugins.every((installedPlugin) => installedPlugin.pluginRegistry !== plugin.name));

  const handleInstall = (plugin: PluginRegistry) => openDialog({ type: DialogType.INSTALL_PLUGIN, props: { plugin } });

  const handleUninstall = (plugin: PluginRegistry) => {
    toast({
      title: "Plugin Uninstalled",
      description: `${plugin.displayName || plugin.name} has been uninstalled.`,
      variant: "destructive",
    });
  }

  return (
    <div className="bg-card/30 h-full">
      <div className="p-4 space-y-4 ">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-6">
            {/* Installed Plugins Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4 text-green-500" />
                <h3 className="font-medium text-sm text-foreground">Installed Plugins</h3>
                <Badge variant="secondary" className="text-xs">
                  {installedPluginsList.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {installedPluginsList.map((plugin) => (
                  <div
                    key={plugin.name}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedPlugin?.name === plugin.name ? "bg-accent border-accent-foreground/20" : "bg-card/50 border-border"
                    }`}
                    onClick={() => setPlugin(plugin)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={`${env.STORAGE_URL}/plugins/${plugin.name}/${plugin.iconPath ?? "icon.png"}`}
                        alt={plugin.displayName || plugin.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {plugin.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {plugin.displayName || plugin.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">v{plugin.version}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {truncateText(plugin.description, 60)}
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-2 h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUninstall(plugin)
                          }}
                        >
                          Uninstall
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {installedPluginsList.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No installed plugins found</p>
                )}
              </div>
            </div>

            <Separator />

            {/* All Plugins Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Download className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-sm text-foreground">Available Plugins</h3>
                <Badge variant="secondary" className="text-xs">
                  {availablePluginsList.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {availablePluginsList.map((plugin) => (
                  <div
                    key={plugin.name}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedPlugin?.name === plugin.name ? "bg-accent border-accent-foreground/20" : "bg-card/50 border-border"
                    }`}
                    onClick={() => setPlugin(plugin)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={`${env.STORAGE_URL}/plugins/${plugin.name}/${plugin.iconPath ?? "icon.png"}`}
                        alt={plugin.displayName || plugin.name}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {plugin.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {plugin.displayName || plugin.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">v{plugin.version}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {truncateText(plugin.description, 60)}
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInstall(plugin)
                          }}
                        >
                          Install
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {availablePluginsList.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No available plugins found</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
