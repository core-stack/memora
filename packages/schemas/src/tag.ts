import z from "zod";

import { filterSchema, orderSchema } from "./shared";

export const tagSchema = z.object({
  id: z.string().uuid(),

  name: z.string().max(255),
  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
export type Tag = z.infer<typeof tagSchema>;

export const tagFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.string().uuid().optional(),
    name: z.string().optional(),
  }).strict().optional(),
  order: z.object({
    name: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional()
}).strict();
export type TagFilter = z.infer<typeof tagFilterSchema>;

export const createTagSchema = tagSchema.pick({
  name: true
});
export type CreateTag = z.infer<typeof createTagSchema>;

export const updateTagSchema = tagSchema.pick({
  name: true
});
export type UpdateTag = z.infer<typeof updateTagSchema>;