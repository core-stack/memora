import z from 'zod';

export const knowledgeBaseSchema = z.object({
  id: z.string().uuid(),

  slug: z.string(),
  title: z.string(),
  description: z.string(),

  tenantId: z.string().uuid(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type KnowledgeBase = z.infer<typeof knowledgeBaseSchema>;

export const createKnowledgeBaseSchema = knowledgeBaseSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateKnowledgeBase = z.infer<typeof createKnowledgeBaseSchema>;

export const updateKnowledgeBaseSchema = knowledgeBaseSchema.omit({
  slug: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateKnowledgeBase = z.infer<typeof updateKnowledgeBaseSchema>;