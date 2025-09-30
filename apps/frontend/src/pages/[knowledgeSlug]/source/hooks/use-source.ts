import { useContext } from 'react';

import { SourceContext } from '../context';

export const useSource = () => {
  const ctx = useContext(SourceContext);
  if (!ctx) throw new Error("Please add the SourceProvider");
  return ctx;
}