import { z } from "zod";

export const isUUID = (value: string) => {
  const res = z.uuid().safeParse(value);
  return res.success
}