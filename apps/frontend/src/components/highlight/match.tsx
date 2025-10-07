import React from "react";

type HighlightMatchProps = {
  text: string;
  offset: number;
  length: number;
};

export const HighlightMatch: React.FC<HighlightMatchProps> = ({
  text,
  offset,
  length,
}) => (
  <span
    key={offset}
    className="bg-yellow-200 text-yellow-900 font-medium rounded px-1"
  >
    {text.slice(offset, offset + length)}
  </span>
);
