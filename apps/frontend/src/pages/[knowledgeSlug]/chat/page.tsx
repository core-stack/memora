import { Chat } from '@/components/chat';
import { AsyncBoundary } from '@/components/suspense-boundary';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useParams } from '@/hooks/use-params';
import { useTenant } from '@/hooks/use-tenant';

import { ChatSidebar } from './components/sidebar';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { tenant, error: tenantError, isLoading } = useTenant();
  const { knowledge, error: knowledgeError } = useKnowledge();
  const error = tenantError || knowledgeError;

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15} minSize={15} maxSize={20}>
        <AsyncBoundary error={error} isLoading={isLoading}>
          <ChatSidebar knowledge={knowledge!} tenant={tenant!} chatId={chatId} />
        </AsyncBoundary>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <AsyncBoundary error={error} isLoading={isLoading}>
          <Chat knowledge={knowledge!} tenant={tenant!} chatId={chatId} />
        </AsyncBoundary>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}