import { FilePlus2, FolderPlus, ListCollapse, Search } from 'lucide-react';

import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

import { Button } from '../ui/button';
import { useTreeSource } from './hooks/use-tree-source';

export const TreeSourceHeader = () => {
  const { openDialog } = useDialog();
  const { selectedFolderId } = useTreeSource();

  const handleCreateSource = () => {
    openDialog({ type: DialogType.CREATE_SOURCE, props: { folderId: selectedFolderId } });
  }

  const handleCreateFolder = () => {
    openDialog({ type: DialogType.CREATE_FOLDER, props: { folderId: selectedFolderId } });
  }

  return (
    <div className='p-1 flex gap-2 justify-evenly'>
      <Button size="icon" variant="ghost">
        <Search />
      </Button>
      <Button size="icon" variant="ghost" onClick={handleCreateSource}>
        <FilePlus2 />
      </Button>
      <Button size="icon" variant="ghost" onClick={handleCreateFolder}>
        <FolderPlus />
      </Button>
      <Button size="icon" variant="ghost">
        <ListCollapse />
      </Button>
    </div>
  )
}