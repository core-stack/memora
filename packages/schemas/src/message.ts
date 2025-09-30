import z from "zod";

import { filterSchema, orderSchema } from "./shared";

export const messageRoleSchema = z.enum(["USER", "AI"]);
export type MessageRole = z.infer<typeof messageRoleSchema>;

export const messageSchema = z.object({
  id: z.string().uuid(),

  messageRole: messageRoleSchema,

  content: z.string().max(50),

  chatId: z.string().uuid(),
  knowledgeId: z.string().uuid(),
  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;

export const messageFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.string().uuid().optional(),
    name: z.string().optional(),
    knowledgeId: z.string().uuid().optional(),
  }).strict().optional(),
  order: z.object({
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type MessageFilter = z.infer<typeof messageFilterSchema>;

export const createMessageSchema = messageSchema.pick({ content: true });
export type CreateMessage = z.infer<typeof createMessageSchema>;

export const updateMessageSchema = messageSchema.pick({ content: true });
export type UpdateMessage = z.infer<typeof updateMessageSchema>;
