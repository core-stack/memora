import z from 'zod';

import { knowledgeTagSchema } from './knowledge-tag';
import { filterSchema, orderSchema } from './shared';

export const knowledgeStatusEnum = z.enum(["DELETING", "DELETE_ERROR", "OK"]);

export const knowledgeSchema = z.object({
  id: z.uuid(),

  slug: z.string().trim().min(3),
  title: z.string().trim().min(3),
  description: z.string().trim().optional(),
  instructions: z.string().trim().optional(),

  files: z.number(),
  storage: z.number(),

  status: knowledgeStatusEnum,
  deleteError: z.string().optional(),

  tenantId: z.uuid(),
  embeddingModelId: z.uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),

  tags: z.array(knowledgeTagSchema),
});

export type Knowledge = z.infer<typeof knowledgeSchema>;

export const knowledgeFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.uuid().optional(),
    slug: z.string().optional(),
    title: z.string().optional(),
    tag: z.string().optional(),
  }).strict().optional(),
  order: z.object({
    slug: orderSchema,
    title: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }).strict().optional(),
}).strict();

export type KnowledgeFilter = z.infer<typeof knowledgeFilterSchema>;

export const createKnowledgeSchema = knowledgeSchema.pick({
  slug: true,
  title: true,
  description: true,
  instructions: true,
  embeddingModelId: true,
}).extend({
  tags: z.array(z.string()).optional()
});
export type CreateKnowledge = z.infer<typeof createKnowledgeSchema>;

export const updateKnowledgeSchema = createKnowledgeSchema.omit({
  slug: true,
}).partial();
export type UpdateKnowledge = z.infer<typeof updateKnowledgeSchema>;