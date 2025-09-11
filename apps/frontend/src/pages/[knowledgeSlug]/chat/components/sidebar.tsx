import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { useApiQuery } from "@/hooks/use-api-query";
import { useKnowledge } from "@/hooks/use-knowledge";
import { Plus } from "lucide-react";

export const ChatSidebar = () => {
  const { slug } = useKnowledge();
  const { data } = useApiQuery("/api/knowledge/:knowledgeSlug/chat", { method: "GET" });

  return (
    <nav className="h-full w-full divide-y divide-solid space-y-2">
      <div className="w-full p-2 space-y-2">
        <Input placeholder="Search" className="w-full" />
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/${slug}/chat`}>
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Link>
        </Button>
      </div>
      <div className="w-full p-2">
        <h2 className="text-muted-foreground text-sm">Chats</h2>
        {
          data?.map((chat) => (
            <Link
              href={`/${slug}/chat/${chat.id}`}
              key={chat.id}
              className="text-muted-foreground w-full flex gap-1 items-center cursor-pointer p-2 hover:bg-accent rounded-md"
            >
              {chat.name}
            </Link>
          ))
        }
      </div>
    </nav>
  )
}