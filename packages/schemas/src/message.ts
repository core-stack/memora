import z from 'zod';

import { filterSchema, orderSchema } from './shared';

export const messageRoleSchema = z.enum(["USER", "AI"]);
export type MessageRole = z.infer<typeof messageRoleSchema>;

export const messageSchema = z.object({
  id: z.uuid(),

  messageRole: messageRoleSchema,

  content: z.string(),

  chatId: z.uuid(),
  knowledgeId: z.uuid(),
  tenantId: z.uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;

export const messageFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().optional(),
    name: z.string().optional(),
    knowledgeId: z.uuid().optional(),
    chatId: z.uuid().optional(),
    tenantId: z.uuid().optional(),
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


export const streamMessageSchema = z.object({
  userMessageId: z.uuid(),
  aiMessageId: z.uuid(),
});
export type StreamMessage = z.infer<typeof streamMessageSchema>;