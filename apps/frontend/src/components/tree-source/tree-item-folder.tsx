import { ChevronRight, Folder } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Spinner } from '../ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useExplore } from './hooks/use-explore';
import { useTreeSource } from './hooks/use-tree-source';
import { TreeItem } from './tree-item';
import { TreeItemEmpty } from './tree-item-empty';
import { TreeItemError } from './tree-item-error';

import type { KnowledgeFolder } from "@memora/schemas";
type TreeItemFolderProps =  {
  item: KnowledgeFolder;
}

export const TreeItemFolder = ({ item }: TreeItemFolderProps) => {
  const [open, setOpen] = useState(false);
  const { setSelectedFolderId, selectedFolderId } = useTreeSource();
  const selected = selectedFolderId === item.id;
  const toggleOpen = () => {
    setSelectedFolderId(item.id);
    setOpen(!open);
  }

  const { isLoading, error, data } = useExplore(item.id);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn('flex items-center gap-2 p-0.5 cursor-pointer w-full hover:bg-accent', selected && 'bg-accent text-primary')} 
              onClick={toggleOpen}
            >
              <ChevronRight className={cn('w-4 h-4 transition', { 'rotate-90': open })} />
              <Folder className='w-4 h-4' />
              {item.name}
            </button>
          </TooltipTrigger>
          <TooltipContent>{item.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {
        open && (
          <>
            { isLoading && <Spinner variant="secondary" size="sm" /> }
            { error && <TreeItemError message={error.message} /> }
            {
              !isLoading && !error && (
                <>
                  { data.length === 0 && <TreeItemEmpty /> }
                  { data?.map((item) => <TreeItem key={item.id} item={item} /> ) }
                </>
              )
            }
          </>
        )
      }
    </>
  )
}