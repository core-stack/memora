import { chatSchema, updateChatSchema } from "@snipet/schemas";
import z from "zod";

export const chatEntity = chatSchema;
export type ChatEntity = z.infer<typeof chatSchema>;

export const createChatEntity = chatEntity.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateChatEntity = z.infer<typeof createChatEntity>;

export const updateChatEntity = updateChatSchema;
export type UpdateChatEntity = z.infer<typeof updateChatEntity>;
