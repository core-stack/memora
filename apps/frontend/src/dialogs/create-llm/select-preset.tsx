"use client"

import { Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDialog } from '@/hooks/use-dialog';
import { cn } from '@/lib/utils';

import { DialogType } from '../';

import { useApiLLMGetPresets } from '@/gen';
import { useTenant } from '@/hooks/use-tenant';
export interface SelectPresetDialogProps {
  onSelectPreset?: (preset: LLMPreset) => void;
  openConfigDialog?: boolean;
}

export function SelectPresetDialog({ onSelectPreset, openConfigDialog = true }: SelectPresetDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { openDialog, closeDialog } = useDialog();
  const { tenant } = useTenant();
  const { data: presets = [] } = useApiLLMGetPresets(tenant?.id ?? "")

  const filteredPresets = presets.filter(
    (preset) =>
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectPreset = (preset: LLMPreset) => {
    onSelectPreset?.(preset);
    setSearchQuery("")
    if (openConfigDialog) openDialog({ type: DialogType.CONFIGURE_LLM, props: { preset }});
    closeDialog(DialogType.SELECT_LLM_PRESET);
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Select LLM Provider</DialogTitle>
        <DialogDescription>Choose a language model provider to configure</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px]">
          {filteredPresets.map((preset) => (
            <div key={preset.name} className='w-full pr-3 py-1'>
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-colors text-left"
              >
                <div className="relative h-12 w-12 shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={preset.iconPath || "/placeholder.svg"}
                    alt={preset.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{preset.name}</h3>
                    <Badge
                      variant={preset.config.type === "TEXT" ? "default" : "secondary"}
                      className={cn("text-xs", preset.config.type === "TEXT" && "text-foreground")}
                    >
                      {preset.config.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{preset.description}</p>
                </div>
              </button>
            </div>
          ))}

          {filteredPresets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No providers found</div>
          )}
        </ScrollArea>
      </div>
    </DialogContent>
  )
}
