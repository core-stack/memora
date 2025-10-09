import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ChatInput = ({ chatId }: { chatId?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);


  const onOpenSourceSelector = () => {

  }
  
  const handleSend = async () => {
    console.log("sendMessage");
  }
  const getText = () => divRef.current?.innerText || "";

  const handleInput = () => {
    const text = getText();
    setIsEmpty(text.trim().length === 0);
    
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    
    if (e.key === "Enter" && e.shiftKey) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const text = getText().trim();
      if (text) {
        handleSend()
        if (divRef.current) divRef.current.innerText = "";
        setIsEmpty(true); 
      }
    }
  }
  
  return (
    <div className="flex items-center flex-col">
      {
        !chatId && (
          <div>
            <h3>What would you like to ask?</h3>
          </div>
        )
      }
      <div className='flex gap-2 max-w-5xl w-full p-5'>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSourceSelector}
          className="flex-shrink-0 bg-card/50 border-border/50 hover:bg-accent/50"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="flex-1 relative flex items-center gap-2">
          <div 
            contentEditable
            className={cn(
              "w-full resize-none p-2 rounded-md  bg-card/50 outline-none border-border/50 focus:bg-card/70",
            )}
            ref={divRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          {
            isEmpty && <span className='absolute p-2 text-md text-muted-foreground'>Type a message...</span>
          }
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isEmpty}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}