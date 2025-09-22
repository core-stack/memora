import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import { SourcePageContent } from './components/content';
import { TabContent } from './components/tab-content';
import { TabSelector } from './components/tab-selector';
import { SourceProvider } from './context';

export default function Source() {
  return (
    <SourceProvider>
      <div className='h-full flex'>
        <TabSelector />
        <ResizablePanelGroup direction='horizontal'>
          <TabContent />
          <ResizablePanel>
            <SourcePageContent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SourceProvider>
  )
}