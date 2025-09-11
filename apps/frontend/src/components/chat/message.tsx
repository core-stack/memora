import { cn } from "@/lib/utils";

import type { Message } from "@memora/schemas"

export type Props = {
  message: Message;
}
export const ChatMessage = ({ message: { content, messageRole } }: Props) => {
  return (
    <div className={cn("w-full p-2 rounded-md rounded-br-none", messageRole === "USER" && "bg-accent text-right")}>
      {content}
    </div>
  )
}