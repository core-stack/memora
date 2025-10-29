import { createMessageSchema, messageSchema, updateMessageSchema } from "@snipet/schemas";
import z from "zod";

export const messageEntity = messageSchema;
export type MessageEntity = z.infer<typeof messageEntity>;

export const createMessageEntity = messageEntity.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateMessageEntity = z.infer<typeof createMessageEntity>;

export const updateMessageEntity = updateMessageSchema;
export type UpdateMessageEntity = z.infer<typeof updateMessageEntity>;