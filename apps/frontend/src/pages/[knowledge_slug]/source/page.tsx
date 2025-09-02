import { Blocks, Cpu, Database, ListTree } from 'lucide-react';
import { useState } from 'react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import { AddSource } from './components/add-source';
import { ExternalSource } from './components/external-source';
import { TabButton } from './components/sidebar';
import { TreeSource } from './components/tree-source';

enum Tabs {
  TREE_SOURCE,
  EXTERNAL_SOURCE,
  ADD_SOURCE,
  NONE
}

export default function Source() {
  const [tab, setTab] = useState<Tabs>(Tabs.TREE_SOURCE);
  const toogleTab = (tab: Tabs) => {
    setTab(current => {
      if (current === tab) {
        return Tabs.NONE
      }
      return tab
    })
  }
  return (
    <div className='h-full flex'>
      <div className='h-full w-min bg-background border-r flex flex-col'>
        <TabButton setTab={() => toogleTab(Tabs.TREE_SOURCE)} active={tab === Tabs.TREE_SOURCE}>
          <ListTree />
        </TabButton>
        <TabButton setTab={() => toogleTab(Tabs.EXTERNAL_SOURCE)} active={tab === Tabs.EXTERNAL_SOURCE}>
          <Database />
        </TabButton>
        <TabButton setTab={() => toogleTab(Tabs.ADD_SOURCE)} active={tab === Tabs.ADD_SOURCE}>
          <Blocks />
        </TabButton>
      </div>
      <ResizablePanelGroup direction='horizontal'>
        {
          tab !== Tabs.NONE && (
            <>
              <ResizablePanel minSize={15} maxSize={25} defaultSize={15}>
                { tab === Tabs.TREE_SOURCE && <TreeSource /> }
                { tab === Tabs.EXTERNAL_SOURCE && <ExternalSource /> }
                { tab === Tabs.ADD_SOURCE && <AddSource /> }
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )
        }
        <ResizablePanel className='bg-background flex flex-col items-center justify-center gap-2'>
          <Cpu size={200} className='opacity-10' />
          <p className='text-muted-foreground text-2xl'>Select a source to start</p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}