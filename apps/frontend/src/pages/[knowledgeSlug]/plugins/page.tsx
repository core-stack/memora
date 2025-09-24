"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiQuery } from "@/hooks/use-api-query";
import { Search } from "lucide-react";
import { useState } from "react";

import { PluginCard } from "./components/plugin-card";
import { PluginDocumentationSheet } from "./components/plugin-documentation-sheet";

import type { PluginRegistry } from "@memora/schemas";

export default function PluginPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<PluginRegistry | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: plugins } = useApiQuery("/api/plugin-registry", { method: "GET" });
  const pluginTypes = Array.from(new Set(plugins?.map((plugin) => plugin.type)))

  const filteredPlugins = plugins?.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plugin.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesType = !selectedType || plugin.type === selectedType

    return matchesSearch && matchesType
  })

  const handleCardClick = (plugin: PluginRegistry) => {
    setSelectedPlugin(plugin)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setSelectedPlugin(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground text-balance">Plugin Marketplace</h1>
              <p className="text-muted-foreground mt-1">Discover and install plugins to extend your application</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(null)}
              className="h-8"
            >
              All Categories
            </Button>
            {pluginTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className="h-8"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredPlugins?.length} plugin{filteredPlugins?.length !== 1 ? "s" : ""} found
            </span>
            {selectedType && (
              <Badge variant="secondary" className="text-xs">
                {selectedType}
              </Badge>
            )}
          </div>
        </div>

        {/* Plugin Grid */}
        {filteredPlugins && filteredPlugins?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin) => (
              <PluginCard key={plugin.name} plugin={plugin} onCardClick={handleCardClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No plugins found</h3>
              <p className="text-sm">Try adjusting your search terms or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Documentation Sheet */}
      <PluginDocumentationSheet
        plugin={selectedPlugin}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  )
}