import z from 'zod';

export const knowledgeTagSchema = z.object({
  id: z.string().uuid(),

  name: z.string().trim(),

  knowledgeId: z.string().uuid(),
  tenantId: z.string().uuid(),
});
export type KnowledgeTag = z.infer<typeof knowledgeTagSchema>;