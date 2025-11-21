import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

import { Tab } from '../../context';
import { useSource } from '../../hooks/use-source';
import { FileTreeSidebar } from './file-tree';

export const TabContent = () => {
  const { tab } = useSource();
  if (tab === Tab.NONE) return;
  return (
    <>
      <ResizablePanel minSize={20} maxSize={25} defaultSize={20}>
        { tab === Tab.TREE_SOURCE && <FileTreeSidebar /> }
      </ResizablePanel>
      <ResizableHandle withHandle />
    </>
  )
}