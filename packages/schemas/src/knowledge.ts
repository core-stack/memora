import z from 'zod';

import { knowledgeTagSchema } from './knowledge-tag';
import { filterSchema, orderSchema } from './shared';

export const knowledgeSchema = z.object({
  id: z.string().uuid(),

  slug: z.string().trim().min(3),
  title: z.string().trim().min(3),
  description: z.string().trim().optional(),
  instructions: z.string().trim().optional(),

  files: z.number(),
  storage: z.number(),

  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),

  tags: z.array(knowledgeTagSchema),
});

export type Knowledge = z.infer<typeof knowledgeSchema>;

export const knowledgeFilterSchema = filterSchema.extend({
  filter: z.object({
    id: z.string().uuid().optional(),
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

export const createKnowledgeSchema = knowledgeSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
  files: true,
  storage: true,
}).extend({
  tags: z.array(z.string()).optional()
});
export type CreateKnowledge = z.infer<typeof createKnowledgeSchema>;

export const updateKnowledgeSchema = knowledgeSchema.omit({
  slug: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
  files: true,
  storage: true,
}).extend({
  tags: z.array(z.string()).optional()
});
export type UpdateKnowledge = z.infer<typeof updateKnowledgeSchema>;