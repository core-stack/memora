import z from 'zod';

export const knowledgeTagSchema = z.object({
  id: z.uuid(),

  name: z.string().trim(),

  knowledgeId: z.uuid(),
  tenantId: z.uuid(),
});
export type KnowledgeTag = z.infer<typeof knowledgeTagSchema>;