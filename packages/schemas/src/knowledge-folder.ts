import z from 'zod';

import { filterSchema, orderSchema } from './shared';

export const knowledgeFolderSchema = z.object({
  id: z.string().uuid(),

  name: z.string(),
  root: z.boolean(),

  parentId: z.string().uuid().optional(),
  knowledgeId: z.string().uuid(),

  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type KnowledgeFolder = z.infer<typeof knowledgeFolderSchema>;

export const knowledgeFolderFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.string().uuid().nullable().optional(),
    name: z.string().optional(),
    parentId: z.string().uuid().nullable().optional(),
  }).strict().optional(),
  order: z.object({
    name: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional(),
}).strict();
export type KnowledgeFolderFilter = z.infer<typeof knowledgeFolderFilterSchema>;

export const createKnowledgeFolderSchema = knowledgeFolderSchema.pick({
  name: true,
  parentId: true
});
export type CreateKnowledgeFolder = z.infer<typeof createKnowledgeFolderSchema>;

export const updateKnowledgeFolderSchema = knowledgeFolderSchema.omit({
  name: true,
  parentId: true
});
export type UpdateKnowledgeFolder = z.infer<typeof updateKnowledgeFolderSchema>;