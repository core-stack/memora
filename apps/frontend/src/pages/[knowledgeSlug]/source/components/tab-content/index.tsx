import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

import { Tab } from '../../context';
import { useSource } from '../../hooks/use-source';
import { FileTreeSidebar } from './file-tree';
import { Plugins } from './plugins';

export const TabContent = () => {
  const { tab } = useSource();
  if (tab === Tab.NONE) return;
  return (
    <>
      <ResizablePanel minSize={20} maxSize={25} defaultSize={20}>
        { tab === Tab.TREE_SOURCE && <FileTreeSidebar /> }
        { tab === Tab.ADD_SOURCE && <Plugins /> }
      </ResizablePanel>
      <ResizableHandle withHandle />
    </>
  )
} 