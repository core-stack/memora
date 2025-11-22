

import { MarkdownViewer } from '@/components/markdown-viewer';
import { cn } from '@/lib/utils';
import { DateFormat, formatDate } from '@/utils/format';

import { Skeleton } from '../ui/skeleton';

import type { MessageEntity } from '@/gen';

type Props = MessageEntity & {
  streaming?: boolean
}
export const ChatMessage = ({ content, messageRole, createdAt, streaming }: Props) => {
  const userMessage = messageRole === "user";

  return (
    <div className={cn("flex-1 space-y-2")}>
      <div className={cn("flex items-center gap-2", userMessage && "justify-end")}>
        <span className="text-sm font-medium text-foreground">
          {userMessage ? "You" : "AI Assistant"}
        </span>
        <span className="text-xs text-muted-foreground">{formatDate(createdAt, DateFormat.lll)}</span>
      </div>

      <div className={cn("flex gap-4 w-full", userMessage && "justify-end")}>
        <div className={cn("w-full space-y-2", userMessage && "w-auto text-end bg-primary/50 rounded-b-lg rounded-tl-lg p-2")}>
          {
            streaming && 
            <>
              {}
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-4/5' />
            </>
          }
        
          <MarkdownViewer type='text' text={content} />
        </div>
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