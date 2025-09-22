import type { Source } from "@memora/schemas"
import { File, Info } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useSource } from '../../../hooks/use-source';

export const TreeItemSource = ({ item }: { item: Source }) => {
  const { setSelectedFileId, selectedFileId } = useSource();
  const toggleSelect = () => setSelectedFileId(item.id);
  const selected = selectedFileId === item.id;
  const indexing = ["PENDING", "INDEXING"].includes(item.indexStatus);
 
  return (
    <div className={cn("group hover:bg-accent", selected && "text-primary")}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("display flex items-center w-full overflow-hidden", indexing && "text-yellow-500")}>
              <button className="flex items-center gap-1 cursor-pointer min-w-0" onClick={toggleSelect}>
                <File className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </button>
              <div className="flex items-center px-2 gap-2 bg-background group-hover:bg-accent">
                <button className="cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 group-hover:block">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>{item.name}{indexing && " - Indexing"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}