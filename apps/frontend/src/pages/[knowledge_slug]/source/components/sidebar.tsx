import { Blocks, Database, ListTree } from 'lucide-react';
import React, { useState } from 'react';

import { TreeSource } from '@/components/tree-source';
import { cn } from '@/lib/utils';

import { AddSource } from './add-source';
import { ExternalSource } from './external-source';

enum Tabs {
  TREE_SOURCE,
  EXTERNAL_SOURCE,
  ADD_SOURCE,
  NONE
}
export const Sidebar = () => {
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
    <nav className="h-full flex w-min">
      <div className='h-full bg-background border-r flex flex-col'>
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
      {
        tab !== Tabs.NONE && (
          <div className='bg-background border-r'>
            { tab === Tabs.TREE_SOURCE && <TreeSource /> }
            { tab === Tabs.EXTERNAL_SOURCE && <ExternalSource /> }
            { tab === Tabs.ADD_SOURCE && <AddSource /> }
          </div>
        )
      }
    </nav>
  )
}

type TabButtonProps = {
  children: React.ReactNode;
  setTab: () => void;
  active: boolean
}
export const TabButton = ({ children, active, setTab }: TabButtonProps) => {
  return (
    <button onClick={setTab} className={cn('p-3 hover:bg-accent cursor-pointer', active && 'bg-accent text-primary')}>
      {children}
    </button>
  )
}