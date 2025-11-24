"use client"

import { FolderPlus, Minimize2, Plus, Search } from 'lucide-react';

import { AsyncBoundary } from '@/components/async-boundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useTenant } from '@/hooks/use-tenant';
import { cn } from '@/lib/utils';

import { useExplorer } from '../../../hooks/use-explorer';
import { useSource } from '../../../hooks/use-source';
import { FileTreeItem } from './file-tree-item';

import type { FolderEntity, KnowledgeEntity, SourceEntity, TenantEntity } from '@/gen';

export function FileTreeSidebar() {
  const { tenant, error: tenantError, isLoading: tenantLoading } = useTenant();
  const { knowledge, error: knowledgeError } = useKnowledge();
  const { data, isLoading: explorerLoading, error: explorerError } = useExplorer();
  const isLoading = tenantLoading || explorerLoading;
  const error = tenantError || knowledgeError || explorerError;
  return (
    <AsyncBoundary isLoading={isLoading} error={error}>
      <Component data={data!} knowledge={knowledge!} tenant={tenant!} />
    </AsyncBoundary>
  )
}

type Props = {
  tenant: TenantEntity;
  knowledge: KnowledgeEntity;
  data: Array<SourceEntity | FolderEntity>;
}

function Component({ data, knowledge, tenant }: Props) {
  const { openDialog } = useDialog();
  const { selectedFolderId } = useSource();
  
  const handleCollapseAll = () => {
    
  }

  const handleCreateFolder = () => {
    openDialog({ type: DialogType.CREATE_FOLDER, props: { parentId: selectedFolderId, knowledgeId: knowledge.id, tenantId: tenant.id } });
  }

  const handleCreateFile = () => {
    openDialog({ type: DialogType.CREATE_SOURCE, props: { folderId: selectedFolderId, knowledgeId: knowledge.id, tenantId: tenant.id } });
  }

  
  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border w-full")}>
      <div className="flex items-center gap-2 p-2 border-b border-sidebar-border">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Search files and folders..."
            className={cn(
              "pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground",
              "placeholder:text-muted-foreground",
              "focus:ring-sidebar-ring focus:border-sidebar-ring",
            )}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
            onClick={handleCollapseAll}
            title="Collapse all folders"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
            onClick={handleCreateFolder}
            title="New folder"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
            onClick={handleCreateFile}
            title="New file"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="py-2 space-y-1">
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <p className="text-sm">No files found</p>
          </div>
        ) : (
          data.map((item) => (
            <FileTreeItem
              key={item.id}
              item={item}
              level={0}
            />
          ))
        )}
      </div>
    </div>
  )
}
