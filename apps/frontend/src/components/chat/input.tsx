import React, { useRef } from "react";

interface ChatInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export const ChatInput = ({ placeholder, onSubmit }: ChatInputProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!divRef.current) return;

      const text = divRef.current.innerText.trim();
      if (text && onSubmit) {
        onSubmit(text);
      }

      divRef.current.innerText = "";
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border px-3 py-2 m-auto max-w-[800px]">
      <div
        ref={divRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="max-h-48 w-full overflow-y-auto whitespace-pre-wrap break-words outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
};
