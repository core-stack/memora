import type React from "react";

export const ChatRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-h-[calc(100vh-65px)] h-full flex flex-col">
      {children}
    </div>
  );
}