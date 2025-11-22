import { ChatProvider } from './context';
import { ChatRoot } from './root';

import type { ChatProviderProps } from './context';

export const Chat = (props: Omit<ChatProviderProps, "children">) => {
  return (
    <ChatProvider {...props}>
      <ChatRoot />
    </ChatProvider>
  )
}