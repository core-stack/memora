import z from "zod";

import { filterSchema, idSchema, orderSchema } from "./shared";

export const chatSchema = z.object({
  id: idSchema,

  name: z.string().max(50),

  knowledgeId: idSchema,
  tenantId: idSchema,

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Chat = z.infer<typeof chatSchema>;

export const chatFilterSchema = filterSchema.extend({
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
export type ChatFilter = z.infer<typeof chatFilterSchema>;

export const createChatSchema = chatSchema.pick({
  name: true
})
export type CreateChat = z.infer<typeof createChatSchema>;

export const updateChatSchema = chatSchema.pick({
  id: true,
  name: true
})
export type UpdateChat = z.infer<typeof updateChatSchema>;
