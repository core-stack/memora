import { Paperclip, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

import { useChat } from './context';

export const ChatInput = () => {
  const { chat, createChat, sendMessage } = useChat();
  const divRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [chatMessage, setChatMessage] = useLocalStorage(`${chat?.id ?? "new"}-chat-message`, "");

  const getText = () => divRef.current?.innerText || "";

  const onOpenSourceSelector = () => {

  }

  const handleSend = async () => {
    await (chat?.id ? sendMessage(getText()) : createChat(getText()));
    if (divRef.current?.innerText) divRef.current.innerText = "";
    setChatMessage(null);
  }

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

  useEffect(() => {
    if (chatMessage && divRef.current) {
      divRef.current.innerText = chatMessage;
      setIsEmpty(false);
    }

    const onBeforeUnload = () => setChatMessage(getText());

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [chatMessage, setChatMessage]);

  return (
    <div className="flex items-center flex-col">
      { !chat?.id && <div><h3>What would you like to ask?</h3></div> }
      <div className='flex gap-2 max-w-5xl items-center w-full p-5'>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSourceSelector}
          className="shrink-0 bg-card/50 border-border/50 hover:bg-accent/50"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="flex-1 relative flex items-center gap-2">
          <div
            contentEditable
            className={cn(
              "w-full resize-none p-2 rounded-md  bg-card/50 outline-none border border-border focus:bg-card/70",
            )}
            ref={divRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          { isEmpty && <span className='absolute p-2 text-md text-muted-foreground pointer-events-none'>Type a message...</span> }
          <Button
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