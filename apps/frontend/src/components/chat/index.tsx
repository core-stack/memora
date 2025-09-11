import { ChatInput } from "./input";
import { MessageArea } from "./message-area";
import { ChatRoot } from "./root";

export const Chat = ({ chatId }: { chatId?: string }) => {
  return (
    <ChatRoot>
      <MessageArea chatId={chatId} />
      <div className="p-2">
        <ChatInput />
      </div>
    </ChatRoot>
  )
}