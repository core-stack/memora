"use client"

import { Check, ChevronDown, ChevronRight, File, Folder, Puzzle, Search, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedSourceDialogProps {
  selectedSources: SelectedSource[]
  onSourcesChange: (sources: SelectedSource[]) => void
}

export function EnhancedSourceDialog({
  selectedSources,
  onSourcesChange,
}: EnhancedSourceDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [pluginForceUse, setPluginForceUse] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const expandedSet = new Set<string>()
    const expandAll = (nodes: FileTreeNode[]) => {
      nodes.forEach((node) => {
        if (node.type === "folder") {
          expandedSet.add(node.path)
          if (node.children) {
            expandAll(node.children)
          }
        }
      })
    }
    expandAll(mockFileTree)
    setExpandedNodes(expandedSet)
  }, [])

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedNodes(newExpanded)
  }

  const isFileSelected = (node: FileTreeNode): boolean => {
    return selectedSources.some((source) => source.path === node.path && source.type !== "plugin")
  }

  const isPluginSelected = (plugin: PluginRegistry): boolean => {
    return selectedSources.some((source) => source.name === plugin.name && source.type === "plugin")
  }

  const toggleFileSelection = (node: FileTreeNode) => {
    const newSources = [...selectedSources]
    const existingIndex = newSources.findIndex((source) => source.path === node.path && source.type !== "plugin")

    if (existingIndex >= 0) {
      newSources.splice(existingIndex, 1)
    } else {
      newSources.push({
        path: node.path,
        name: node.name,
        type: node.type as "file" | "folder",
      })
    }

    onSourcesChange(newSources)
  }

  const togglePluginSelection = (plugin: PluginRegistry) => {
    const newSources = [...selectedSources]
    const existingIndex = newSources.findIndex((source) => source.name === plugin.name && source.type === "plugin")

    if (existingIndex >= 0) {
      newSources.splice(existingIndex, 1)
    } else {
      newSources.push({
        path: `/plugins/${plugin.name}`,
        name: plugin.displayName || plugin.name,
        type: "plugin",
        pluginInfo: {
          name: plugin.name,
          displayName: plugin.displayName,
          version: plugin.version,
          type: plugin.type,
          forceUse: pluginForceUse[plugin.name] || false,
          iconPath: plugin.iconPath,
        },
      })
    }

    onSourcesChange(newSources)
  }

  const togglePluginForceUse = (pluginName: string) => {
    const newForceUse = { ...pluginForceUse }
    newForceUse[pluginName] = !newForceUse[pluginName]
    setPluginForceUse(newForceUse)

    // Update existing selection if plugin is already selected
    const newSources = selectedSources.map((source) => {
      if (source.type === "plugin" && source.pluginInfo?.name === pluginName) {
        return {
          ...source,
          pluginInfo: {
            ...source.pluginInfo,
            forceUse: newForceUse[pluginName],
          },
        }
      }
      return source
    })
    onSourcesChange(newSources)
  }

  const filterTree = (nodes: FileTreeNode[], query: string): FileTreeNode[] => {
    if (!query) return nodes

    return nodes.reduce<FileTreeNode[]>((filtered, node) => {
      const matchesQuery =
        node.name.toLowerCase().includes(query.toLowerCase()) || node.path.toLowerCase().includes(query.toLowerCase())

      if (node.type === "file") {
        if (matchesQuery) {
          filtered.push(node)
        }
      } else if (node.children) {
        const filteredChildren = filterTree(node.children, query)
        if (matchesQuery || filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren,
          })
        }
      }

      return filtered
    }, [])
  }

  const filterPlugins = (plugins: PluginRegistry[], query: string): PluginRegistry[] => {
    if (!query) return plugins

    return plugins.filter(
      (plugin) =>
        plugin.name.toLowerCase().includes(query.toLowerCase()) ||
        plugin.displayName?.toLowerCase().includes(query.toLowerCase()) ||
        plugin.description.toLowerCase().includes(query.toLowerCase()) ||
        plugin.type.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const renderTreeNode = (node: FileTreeNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.path)
    const selected = isFileSelected(node)

    return (
      <div key={node.path}>
        <div
          className="flex items-center gap-2 py-1.5 px-2 hover:bg-accent/50 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {node.type === "folder" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(node.path)
              }}
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          {node.type === "file" && <div className="w-4" />}

          <Checkbox checked={selected} onCheckedChange={() => toggleFileSelection(node)} className="h-4 w-4" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {node.type === "folder" ? (
              <Folder className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span className="text-sm truncate">{node.name}</span>
          </div>
        </div>

        {node.type === "folder" && node.children && isExpanded && (
          <div>{node.children.map((child) => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const renderPluginCard = (plugin: PluginRegistry) => {
    const selected = isPluginSelected(plugin)
    const forceUse = pluginForceUse[plugin.name] || false

    return (
      <div
        key={plugin.name}
        className={`p-4 border rounded-lg hover:bg-accent/30 transition-colors ${
          selected ? "border-primary bg-accent/20" : "border-border"
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox checked={selected} onCheckedChange={() => togglePluginSelection(plugin)} className="h-4 w-4 mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {plugin.iconPath ? (
                <img src={plugin.iconPath || "/placeholder.svg"} alt="" className="h-5 w-5 rounded" />
              ) : (
                <Puzzle className="h-5 w-5 text-primary" />
              )}
              <h4 className="font-medium text-sm truncate">{plugin.displayName || plugin.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {plugin.type}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{plugin.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">v{plugin.version}</span>

              {selected && (
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Force use</span>
                  <Switch
                    checked={forceUse}
                    onCheckedChange={() => togglePluginForceUse(plugin.name)}
                    className="h-4 w-7"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredTree = filterTree(fileTree, searchQuery)
  const filteredPlugins = filterPlugins(plugins, searchQuery)

  const handleApply = () => {
    onOpenChange(false)
  }

  const handleClear = () => {
    onSourcesChange([])
    setPluginForceUse({})
  }

  const fileSourcesCount = selectedSources.filter((s) => s.type !== "plugin").length
  const pluginSourcesCount = selectedSources.filter((s) => s.type === "plugin").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Sources & Plugins</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files, folders, and plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span>{fileSourcesCount} files/folders</span>
              <span>{pluginSourcesCount} plugins</span>
            </div>
            {(fileSourcesCount > 0 || pluginSourcesCount > 0) && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear all
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="files" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="files" className="flex items-center gap-2">
                <File className="h-4 w-4" />
                Files & Folders
              </TabsTrigger>
              <TabsTrigger value="plugins" className="flex items-center gap-2">
                <Puzzle className="h-4 w-4" />
                Plugins
              </TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="flex-1 min-h-0">
              <ScrollArea className="flex-1 border rounded-md">
                {/* <div className="p-2">
                  {filteredTree.length > 0 ? (
                    filteredTree.map((node) => renderTreeNode(node))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No files found</p>
                    </div>
                  )}
                </div> */}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="plugins" className="flex-1 min-h-0">
              <ScrollArea className="flex-1 border rounded-md">
                <div className="p-2 space-y-3">
                  {filteredPlugins.length > 0 ? (
                    filteredPlugins.map((plugin) => renderPluginCard(plugin))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Puzzle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No plugins found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            <Check className="h-4 w-4 mr-2" />
            Apply Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
