"use client"

import {
  ChevronDown, ChevronRight, File, FileText, Folder, Globe, ImageIcon, Info, Music, RotateCcw, Video
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SourceType } from '@memora/schemas';

import { useExplorer } from '../../../hooks/use-explorer';
import { useSource } from '../../../hooks/use-source';

import type { KnowledgeFolder, Source } from '@memora/schemas';

interface FileTreeItemProps {
  item: Source | KnowledgeFolder
  level: number
}

const isSource = (item: KnowledgeFolder | Source): item is Source => "folderId" in item;

const getFileIcon = (item: Source | KnowledgeFolder) => {
  if (isSource(item)) {
    switch  (item.sourceType) {
      case SourceType.TEXT:
        return FileText;
      case SourceType.IMAGE:
        return ImageIcon;
      case SourceType.VIDEO:
        return Video;
      case SourceType.AUDIO:
        return Music;
      case SourceType.FILE:
        return File;
      case SourceType.LINK:
        return Globe;
    }
  } else {
    return Folder;
  }
}

const getIndexingColor = (item: Source | KnowledgeFolder): string | undefined => {
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
  const { setSelectedFolderId, setSelectedFileId, selectedFileId, selectedFolderId } = useSource();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = getFileIcon(item);
  const isFolder = !isSource(item);
  const isIndexing = isSource(item) && item.indexStatus === 'INDEXING';
  const indexError = isSource(item) && item.indexStatus === 'ERROR';
  const isSelected = isFolder ? selectedFolderId === item.id : selectedFileId === item.id;
  const { data: childs } = useExplorer(item.id, isFolder);

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
  const handleRetryIndexing = () => {
    
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
            <Icon className="h-4 w-4 flex-shrink-0" />
            {isIndexing && <Spinner />}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex-1 truncate text-sm font-medium w-full">{item.name}</span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="font-medium w-full">{item.name}</p>
                {/* <p className="text-xs text-muted-foreground">{item.path}</p> */}
                {/* {item.size && <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>} */}
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

// function formatFileSize(bytes: number): string {
//   if (bytes === 0) return "0 B"
//   const k = 1024
//   const sizes = ["B", "KB", "MB", "GB"]
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
// }