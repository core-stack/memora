import { useContext } from "react";

import { TreeSourceContext } from "../context";

export const useTreeSource = () => {
  const ctx = useContext(TreeSourceContext);
  if (!ctx) throw new Error("Please add the TreeSourceProvider");
  return ctx;
}