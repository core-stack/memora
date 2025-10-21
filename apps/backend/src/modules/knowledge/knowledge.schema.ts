import z from 'zod';

import { createKnowledgeSchema, knowledgeSchema, updateKnowledgeSchema } from '@snipet/schemas';

export const knowledge = knowledgeSchema.extend({
  tenantId: z.string().uuid()
});
export type Knowledge = z.infer<typeof knowledge>;

export const createKnowledge = createKnowledgeSchema.extend({
  tenantId: z.string().uuid()
});
export type CreateKnowledge = z.infer<typeof createKnowledge>;

export const updateKnowledge = updateKnowledgeSchema.extend({
  tenantId: z.string().uuid(),
  storage: z.number().optional(),
  files: z.number().optional()
});
export type UpdateKnowledge = z.infer<typeof updateKnowledge>;