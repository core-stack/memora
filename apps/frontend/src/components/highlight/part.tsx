import React from "react";

type HighlightPartProps = {
  text: string;
  cut?: boolean;
  lastIndex?: number;
  offset?: number;
  maxLength?: number;
};

export const HighlightPart: React.FC<HighlightPartProps> = ({
  text,
  cut = false,
  lastIndex = 0,
  offset = 0,
  maxLength = 50,
}) => {
  const spacer = <span className="mx-1 text-muted-foreground">...</span>;

  if (!cut) return <>{text}</>;

  const start = text.slice(0, maxLength / 2);
  const end = text.slice(-maxLength / (lastIndex > 0 ? 2 : 1));

  return (
    <span key={`cut-${offset}`}>
      {lastIndex > 0 && start}
      {spacer}
      {end}
    </span>
  );
};
