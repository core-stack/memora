import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useParams } from '@/hooks/use-params';

import { Chat } from '../../../components/chat';
import { ChatSidebar } from './components/sidebar';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15} minSize={15} maxSize={20}>
        <ChatSidebar  />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <Chat chatId={chatId} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        Auxiliary Content
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}