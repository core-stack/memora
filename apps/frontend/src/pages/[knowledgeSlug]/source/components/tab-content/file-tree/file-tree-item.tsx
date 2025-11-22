"use client"

import {
  ChevronDown, ChevronRight, File, FileText, Folder, ImageIcon, Info, Music, RotateCcw, Video
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  folderQueryKeyFn, sourceEntitySourceTypeEnum, sourceQueryKeyFn, useApiSourceRetry
} from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useTenant } from '@/hooks/use-tenant';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/utils/format';

import { useExplorer } from '../../../hooks/use-explorer';
import { useSource } from '../../../hooks/use-source';

import type { SourceEntity, FolderEntity } from "@/gen";

interface FileTreeItemProps {
  item: SourceEntity | FolderEntity
  level: number
}

const isSource = (item: FolderEntity | SourceEntity): item is SourceEntity => "folderId" in item;

const getFileIcon = (item: SourceEntity | FolderEntity): React.ReactNode => {
  if (isSource(item)) {
    switch (item.sourceType) {
      case sourceEntitySourceTypeEnum.TEXT:
        return <FileText className='w-4 h-4 shrink-0' />;
      case sourceEntitySourceTypeEnum.IMAGE:
        return <ImageIcon className='w-4 h-4 shrink-0' />;
      case sourceEntitySourceTypeEnum.VIDEO:
        return <Video className='w-4 h-4 shrink-0' />;
      case sourceEntitySourceTypeEnum.AUDIO:
        return <Music className='w-4 h-4 shrink-0' />;
      case sourceEntitySourceTypeEnum.DOC:
        return <File className='w-4 h-4 shrink-0' />;
    }
  } else {
    return <Folder className='w-4 h-4 shrink-0' />;
  }
}

const getIndexingColor = (item: SourceEntity | FolderEntity): string | undefined => {
  if (isSource(item)) {
    switch (item.indexStatus) {
      case 'PENDING':
        return "text-muted-foreground";
      case 'INDEXED':
        return "text-foreground";
      case 'INDEXING':
        return "text-yellow-500";
      case 'ERROR':
        return "text-red-500";
    }
  }
}

export function FileTreeItem({
  item,
  level,
}: FileTreeItemProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { setSelectedFolderId, setSelectedFileId, selectedFileId, selectedFolderId } = useSource();
  const [isHovered, setIsHovered] = useState(false);
  const { knowledge } = useKnowledge();
  const { tenant } = useTenant();
  const isFolder = !isSource(item);
  const isIndexing = isSource(item) && item.indexStatus === 'INDEXING';
  const indexError = isSource(item) && item.indexStatus === 'ERROR';
  const isSelected = isFolder ? selectedFolderId === item.id : selectedFileId === item.id;
  const { data: childs } = useExplorer(tenant?.id, knowledge?.id, item.id, isFolder);
  const invalidate = useApiInvalidate();
  const { mutateAsync: retryIndexing } = useApiSourceRetry();
  const handleClick = () => {
    if (isFolder) {
      setOpen(!open);
      setSelectedFolderId(item.id);
    } else {
      setSelectedFileId(item.id);
    }
  }

  const handleShowInfo = () => {
    if (isFolder) {
      setSelectedFolderId(item.id);
    } else {
      setSelectedFileId(item.id);
    }
  }
  const handleRetryIndexing = async () => {
    await retryIndexing({
      knowledgeId: knowledge?.id ?? "",
      id: item.id,
      tenantId: tenant?.id ?? ""
    });
    await invalidate(
      sourceQueryKeyFn({ knowledgeId: knowledge?.id ?? "", tenantId: tenant?.id ?? "" }),
      folderQueryKeyFn({ knowledgeId: knowledge?.id ?? "", tenantId: tenant?.id ?? "" }),
    )
    toast({
      title: "Indexing retried",
      description: "The indexing process has been retried.",
    })
  }

  return (
    <TooltipProvider>
      <div>
        <div
          className={cn(
            "group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors",
            "hover:bg-accent/50",
            isSelected && "bg-accent text-accent-foreground",
            getIndexingColor(item),
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {isFolder && (
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
              {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          <div className="flex items-center gap-1">
            { isIndexing &&
              <Spinner className="fill-yellow-500" size="sm" /> ||
              getFileIcon(item)
            }
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex-1 truncate text-sm font-medium w-full">{item.name}</span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="font-medium w-full">{item.name}</p>
                {
                  !isFolder && item.path &&
                  <p className="text-xs text-muted-foreground">{item.path}</p>
                }
                {
                  !isFolder &&
                  <p className="text-xs text-muted-foreground">{formatBytes(item.metadata.size)}</p>
                }
              </div>
            </TooltipContent>
          </Tooltip>

          <div className={cn("flex items-center gap-1", !isHovered && "opacity-0", "transition-opacity")}>
            {indexError && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRetryIndexing()
                    }}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Retry indexing</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShowInfo()
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show file info</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {isFolder && open && childs && (
          <div>
            {childs.map((child) => (
              <FileTreeItem
                key={child.id}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}