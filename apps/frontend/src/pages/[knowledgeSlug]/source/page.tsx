import { TreeSource } from "@/components/tree-source";
import { TreeSourceProvider } from "@/components/tree-source/context";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Blocks, Database, ListTree } from "lucide-react";
import { useState } from "react";

import { SourcePageContent } from "./components/content";
import { AddSource } from "./components/sidebar/add-source";
import { ExternalSource } from "./components/sidebar/external-source";
import { TabButton } from "./components/sidebar/sidebar";

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
    <TreeSourceProvider>
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
          <ResizablePanel>
            <SourcePageContent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TreeSourceProvider>
  )
}