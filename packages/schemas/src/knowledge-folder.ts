import z from "zod";

import { filterSchema, orderSchema } from "./shared";

export const knowledgeFolderSchema = z.object({
  id: z.string().uuid(),

  slug: z.string(),
  name: z.string(),
  description: z.string(),
  root: z.boolean(),

  parentId: z.string().uuid().optional(),
  knowledgeBaseId: z.string().uuid(),

  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type KnowledgeFolder = z.infer<typeof knowledgeFolderSchema>;

export const knowledgeFolderFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.string().uuid().optional(),
    slug: z.string().optional(),
    name: z.string().optional(),
    parentId: z.string().uuid().optional(),
  }).strict().optional(),
  order: z.object({
    slug: orderSchema,
    name: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional(),
}).strict();
export type KnowledgeFolderFilter = z.infer<typeof knowledgeFolderFilterSchema>;

export const createKnowledgeFolderSchema = knowledgeFolderSchema.omit({
  id: true,
  knowledgeBaseId: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateKnowledgeFolder = z.infer<typeof createKnowledgeFolderSchema>;

export const updateKnowledgeFolderSchema = knowledgeFolderSchema.omit({
  slug: true,
  knowledgeBaseId: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateKnowledgeFolder = z.infer<typeof updateKnowledgeFolderSchema>;