"use client"

import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiLLMGetPresets } from "@/gen";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";

import { DialogType } from "../";

import type { LLMPreset } from "@/gen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface SelectPresetDialogProps {
  onSelectPreset?: (preset: LLMPreset) => void;
  openConfigDialog?: boolean;
  tenantId: string;
}

export function SelectPresetDialog({ onSelectPreset, openConfigDialog = true, tenantId }: SelectPresetDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { openDialog, closeDialog } = useDialog();
  const { data: presets = [] } = useApiLLMGetPresets({ tenantId });

  const filteredPresets = presets.filter(
    (preset) =>
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectPreset = (preset: LLMPreset) => {
    onSelectPreset?.(preset);
    setSearchQuery("")
    if (openConfigDialog) openDialog({ type: DialogType.CONFIGURE_LLM, props: { preset, tenantId }});
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
                  <Avatar>
                    <AvatarImage src={preset.iconPath} alt={preset.name} />
                    <AvatarFallback>
                      <Sparkles className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{preset.name}</h3>
                    <Badge
                      variant={(preset.config as Record<string, string>).type === "TEXT" ? "default" : "secondary"}
                      className={cn("text-xs", (preset.config as Record<string, string>).type === "TEXT" && "text-foreground")}
                    >
                      {(preset.config as Record<string, string>).type}
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
