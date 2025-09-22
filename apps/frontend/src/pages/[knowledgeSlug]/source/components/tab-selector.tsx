import { Blocks, Database, ListTree } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Tab } from '../context';
import { useSource } from '../hooks/use-source';

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
export const TabSelector = () => {
  const { toggleTab, tab } = useSource();
  return (
    <div className='h-full w-min bg-background border-r flex flex-col'>
      <TabButton setTab={() => toggleTab(Tab.TREE_SOURCE)} active={tab === Tab.TREE_SOURCE}>
        <ListTree />
      </TabButton>
      <TabButton setTab={() => toggleTab(Tab.EXTERNAL_SOURCE)} active={tab === Tab.EXTERNAL_SOURCE}>
        <Database />
      </TabButton>
      <TabButton setTab={() => toggleTab(Tab.ADD_SOURCE)} active={tab === Tab.ADD_SOURCE}>
        <Blocks />
      </TabButton>
    </div>
  )
}