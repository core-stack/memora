import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiQuery } from "@/hooks/use-api-query";
import { AlertOctagon } from "lucide-react";

import { Spinner } from "../ui/spinner";

import { ChatMessage } from "./message";

export const MessageArea = ({ chatId }: { chatId?: string }) => {
  const { data, isLoading, error } = useApiQuery(
    "/api/knowledge/:knowledgeSlug/chat/:chatId/message",
    { method: "GET", enabled: !!chatId }
  );

  return (
    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
      {
        !isLoading && !!data && data.length > 0 &&
        <ScrollArea className="flex-1 p-2 pr-4">
          {
            data.map(message => (
              <ChatMessage message={message} />
            ))
          }
        </ScrollArea>
      }
      {
        error && (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <AlertOctagon className="w-10 h-10 text-destructive opacity-50" />
            <p>{error?.message}</p>
          </div>
        )
      }
      {
        isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner variant="secondary" />
          </div>
        )
      }
      {
        !isLoading && !error && !data?.length && (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-accent">
            <AlertOctagon className="w-10 h-10" />
            <p>No messages</p>
          </div>
        )
      }
    </div>
  );
}