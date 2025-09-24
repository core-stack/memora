"use client"

import type React from "react"

import { Download } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogType } from '@/dialogs';
import { env } from '@/env';
import { useDialog } from '@/hooks/use-dialog';

import type { PluginRegistry } from "@memora/schemas"
interface PluginCardProps {
  plugin: PluginRegistry
  onCardClick: (plugin: PluginRegistry) => void
}

export function PluginCard({ plugin, onCardClick }: PluginCardProps) {
  const truncateDescription = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }
  const { openDialog } = useDialog();
  
  const handleInstall = (e: React.MouseEvent) => {
    e.stopPropagation()
    openDialog({ type: DialogType.INSTALL_PLUGIN, props: { plugin } })
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:border-muted-foreground/20 hover:shadow-lg bg-card/50 backdrop-blur-sm"
      onClick={() => onCardClick(plugin)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <img
                src={`${env.STORAGE_URL}/plugins/${plugin.name}/${plugin.iconPath ?? "icon.png"}`}
                alt={`${plugin.displayName || plugin.name} icon`}
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-foreground">
                {plugin.displayName || plugin.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {plugin.type}
                </Badge>
                <span className="text-xs text-muted-foreground">v{plugin.version}</span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleInstall}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {truncateDescription(plugin.description)}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
