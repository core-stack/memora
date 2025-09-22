import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

import { Tab } from '../../context';
import { useSource } from '../../hooks/use-source';
import { ExternalSource } from './external-source';
import { Plugins } from './plugins';
import { TreeSource } from './tree-source';

export const TabContent = () => {
  const { tab } = useSource();
  if (tab === Tab.NONE) return;
  return (
    <>
      <ResizablePanel minSize={15} maxSize={25} defaultSize={15}>
        { tab === Tab.TREE_SOURCE && <TreeSource /> }
        { tab === Tab.EXTERNAL_SOURCE && <ExternalSource /> }
        { tab === Tab.ADD_SOURCE && <Plugins /> }
      </ResizablePanel>
      <ResizableHandle withHandle />
    </>
  )
} 