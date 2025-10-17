import React from "react";
import { HighlightPart } from "./part";
import { HighlightMatch } from "./match";

type HighlightProps = {
  text: string;
  query: string;
  maxLength?: number;
  className?: string;
};

export const Highlight: React.FC<HighlightProps> = ({
  text,
  query,
  maxLength = 50,
  className = "",
}) => {
  if (!query.trim()) return <span>{text}</span>;

  const normalizedWords = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (normalizedWords.length === 0) return <span>{text}</span>;

  const regex = new RegExp(`(${normalizedWords.join("|")})`, "gi");

  const normalizedText = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  normalizedText.replace(regex, (match, _group, offset) => {
    if (lastIndex < offset) {
      const previousText = text.slice(lastIndex, offset);
      const cut = previousText.length > maxLength;

      parts.push(
        <HighlightPart
          key={`part-${offset}`}
          text={previousText}
          cut={cut}
          lastIndex={lastIndex}
          offset={offset}
          maxLength={maxLength}
        />
      );
    }

    parts.push(
      <HighlightMatch
        key={`match-${offset}`}
        text={text}
        offset={offset}
        length={match.length}
      />
    );

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    const tailText = text.slice(lastIndex, lastIndex + maxLength);
    parts.push(
      <HighlightPart
        key="end"
        text={tailText}
        cut={true}
        lastIndex={lastIndex}
      />
    );
  }

  return <span className={`inline ${className}`}>{parts}</span>;
};
