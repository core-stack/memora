import { ChatProvider } from './context';
import { ChatRoot } from './root';

export const Chat = ({ chatId }: { chatId?: string }) => {
  return (
    <ChatProvider chatId={chatId}>
      <ChatRoot />
    </ChatProvider>
  )
}