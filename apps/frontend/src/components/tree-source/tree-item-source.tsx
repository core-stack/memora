import type { Source } from "@memora/schemas"
import { File, Info } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const TreeItemSource = ({ item }: { item: Source }) => {
  return (
    <div className="relative group hover:bg-accent">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex w-full items-center gap-1 cursor-pointer">
              <File className="w-4 h-4" />
              <span className="w-full truncate">{item.name}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{item.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <button className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center bg-accent px-2 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
        <Info className="w-4 h-4" />
      </button>
    </div>
  )
}