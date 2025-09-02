import z from "zod";

import { filterSchema, orderSchema } from "./shared";

export const knowledgeSchema = z.object({
  id: z.string().uuid(),

  slug: z.string().trim(),
  title: z.string().trim(),
  description: z.string().trim(),

  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Knowledge = z.infer<typeof knowledgeSchema>;

export const knowledgeFilterSchema = filterSchema.extend({
  filter: knowledgeSchema.pick({
    id: true,
    slug: true,
    title: true,
  }),
  order: z.object({
    slug: orderSchema,
    title: orderSchema,
    createdAt: orderSchema,
    updatedAt: orderSchema,
  }),
});

export type KnowledgeFilter = z.infer<typeof knowledgeFilterSchema>;

export const createKnowledgeSchema = knowledgeSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateKnowledge = z.infer<typeof createKnowledgeSchema>;

export const updateKnowledgeSchema = knowledgeSchema.omit({
  slug: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateKnowledge = z.infer<typeof updateKnowledgeSchema>;