import z from 'zod';

import {
  createKnowledgeSchema, knowledgeSchema, knowledgeStatusEnum, updateKnowledgeSchema
} from '@snipet/schemas';

export const knowledge = knowledgeSchema
export type Knowledge = z.infer<typeof knowledge>;

export const createKnowledge = createKnowledgeSchema.extend({
  tenantId: z.string().uuid()
});
export type CreateKnowledge = z.infer<typeof createKnowledge>;

export const updateKnowledge = updateKnowledgeSchema.extend({
  tenantId: z.string().uuid(),
  storage: z.number().optional(),
  files: z.number().optional(),
  deleteError: z.string().optional(),
  status: knowledgeStatusEnum
});
export type UpdateKnowledge = z.infer<typeof updateKnowledge>;