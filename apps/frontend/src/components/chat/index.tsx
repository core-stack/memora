import { ChatProvider } from './context';
import { ChatRoot } from './root';
type ChatProps = {
  tenantId: string;
  knowledgeId: string;
  chatId?: string;
}
export const Chat = (props: ChatProps) => {
  return (
    <ChatProvider {...props}>
      <ChatRoot />
    </ChatProvider>
  )
}