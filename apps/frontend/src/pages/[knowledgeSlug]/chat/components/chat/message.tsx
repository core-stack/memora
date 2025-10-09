import { DateFormat, formatDate } from '@/utils/format';

import type { Message } from "@memora/schemas"

export const ChatMessage = ({ msg }: { msg: Message }) => {
  return (
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {msg.messageRole === "USER" ? "You" : "AI Assistant"}
        </span>
        <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt, DateFormat.lll)}</span>
      </div>

      <div className="prose prose-sm max-w-none text-foreground">
        <div className="whitespace-pre-wrap leading-relaxed text-pretty">{msg.content}</div>
      </div>

      {/* References */}
      {/* {msg.references && msg.references.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">References:</p>
          <div className="flex flex-wrap gap-2">
            {msg.references.map((ref, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto p-2 text-xs hover:bg-accent/50 bg-card/50 border-border/50"
                onClick={() => onSelectReference(ref)}
              >
                <FileText className="h-3 w-3 mr-1" />
                <span className="truncate max-w-32">{ref.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}