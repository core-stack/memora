import { z } from "zod";

export const isUUID = (value: string): boolean => {
  const res = z.uuid().safeParse(value);
  return res.success;
};
